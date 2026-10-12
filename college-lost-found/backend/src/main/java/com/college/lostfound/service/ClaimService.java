package com.college.lostfound.service;

import com.college.lostfound.dto.ClaimDecisionDto;
import com.college.lostfound.dto.ClaimRequestDto;
import com.college.lostfound.dto.ClaimResponse;
import com.college.lostfound.exception.BadRequestException;
import com.college.lostfound.exception.ResourceNotFoundException;
import com.college.lostfound.exception.UnauthorizedActionException;
import com.college.lostfound.model.*;
import com.college.lostfound.repository.ClaimRepository;
import com.college.lostfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;

    @Autowired
    public ClaimService(ClaimRepository claimRepository, ItemRepository itemRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public ClaimResponse submitClaim(Long itemId, ClaimRequestDto request, User claimant) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        // Rule: Users cannot claim their own items
        if (item.getCreatedBy().getId().equals(claimant.getId())) {
            throw new BadRequestException("You cannot submit a claim on an item you reported yourself.");
        }

        // Rule: Prevent duplicate active claims by same user for same item
        boolean existsPending = claimRepository.existsByItemIdAndClaimantIdAndStatus(itemId, claimant.getId(), ClaimStatus.PENDING);
        if (existsPending) {
            throw new BadRequestException("You already have a pending claim for this item.");
        }

        Claim claim = new Claim(item, claimant, request.getClaimDescription().trim());
        Claim saved = claimRepository.save(claim);

        // Update item status to CLAIM_PENDING if currently ACTIVE
        if (item.getStatus() == ItemStatus.ACTIVE) {
            item.setStatus(ItemStatus.CLAIM_PENDING);
            itemRepository.save(item);
        }

        return new ClaimResponse(saved);
    }

    public List<ClaimResponse> getReceivedClaims(User reporter) {
        List<Claim> claims = claimRepository.findReceivedClaimsForReporter(reporter.getId());
        return claims.stream().map(ClaimResponse::new).collect(Collectors.toList());
    }

    public List<ClaimResponse> getMyClaims(User claimant) {
        List<Claim> claims = claimRepository.findByClaimantIdOrderByCreatedAtDesc(claimant.getId());
        return claims.stream().map(ClaimResponse::new).collect(Collectors.toList());
    }

    public List<ClaimResponse> getClaimsForItem(Long itemId, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        // Only the item reporter can view all claims for this item
        if (!item.getCreatedBy().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You are not authorized to view claims for this item.");
        }

        return claimRepository.findByItemIdOrderByCreatedAtDesc(itemId)
                .stream()
                .map(ClaimResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimResponse processClaimDecision(Long claimId, ClaimDecisionDto decisionDto, User reporter) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        Item item = claim.getItem();
        if (!item.getCreatedBy().getId().equals(reporter.getId())) {
            throw new UnauthorizedActionException("Only the original reporter can accept or reject claims for this item.");
        }

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("This claim has already been marked as " + claim.getStatus());
        }

        claim.setStatus(decisionDto.getStatus());
        if (decisionDto.getResponseNote() != null) {
            claim.setResponseNote(decisionDto.getResponseNote().trim());
        }

        Claim updatedClaim = claimRepository.save(claim);

        if (decisionDto.getStatus() == ClaimStatus.ACCEPTED) {
            // Update item status according to item type
            if (item.getItemType() == ItemType.FOUND) {
                item.setStatus(ItemStatus.RETURNED);
            } else {
                item.setStatus(ItemStatus.RECOVERED);
            }
            itemRepository.save(item);

            // Reject any remaining pending claims on this item
            List<Claim> otherClaims = claimRepository.findByItemIdOrderByCreatedAtDesc(item.getId());
            for (Claim other : otherClaims) {
                if (!other.getId().equals(claim.getId()) && other.getStatus() == ClaimStatus.PENDING) {
                    other.setStatus(ClaimStatus.REJECTED);
                    other.setResponseNote("Another claim was accepted for this item.");
                    claimRepository.save(other);
                }
            }
        } else if (decisionDto.getStatus() == ClaimStatus.REJECTED) {
            // Check if there are other pending claims
            List<Claim> pendingOthers = claimRepository.findByItemIdOrderByCreatedAtDesc(item.getId())
                    .stream()
                    .filter(c -> !c.getId().equals(claim.getId()) && c.getStatus() == ClaimStatus.PENDING)
                    .toList();

            if (pendingOthers.isEmpty() && item.getStatus() == ItemStatus.CLAIM_PENDING) {
                item.setStatus(ItemStatus.ACTIVE);
                itemRepository.save(item);
            }
        }

        return new ClaimResponse(updatedClaim);
    }
}
