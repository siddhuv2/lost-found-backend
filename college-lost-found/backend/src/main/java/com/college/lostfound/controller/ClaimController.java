package com.college.lostfound.controller;

import com.college.lostfound.dto.ClaimDecisionDto;
import com.college.lostfound.dto.ClaimRequestDto;
import com.college.lostfound.dto.ClaimResponse;
import com.college.lostfound.model.User;
import com.college.lostfound.security.CustomUserDetails;
import com.college.lostfound.service.AuthService;
import com.college.lostfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ClaimController {

    private final ClaimService claimService;
    private final AuthService authService;

    @Autowired
    public ClaimController(ClaimService claimService, AuthService authService) {
        this.claimService = claimService;
        this.authService = authService;
    }

    @PostMapping("/items/{id}/claims")
    public ResponseEntity<ClaimResponse> submitClaim(
            @PathVariable Long id,
            @Valid @RequestBody ClaimRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        ClaimResponse claim = claimService.submitClaim(id, request, currentUser);
        return ResponseEntity.ok(claim);
    }

    @GetMapping("/items/{id}/claims")
    public ResponseEntity<List<ClaimResponse>> getClaimsForItem(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        List<ClaimResponse> claims = claimService.getClaimsForItem(id, currentUser);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/claims/received")
    public ResponseEntity<List<ClaimResponse>> getReceivedClaims(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        List<ClaimResponse> received = claimService.getReceivedClaims(currentUser);
        return ResponseEntity.ok(received);
    }

    @GetMapping("/claims/my-claims")
    public ResponseEntity<List<ClaimResponse>> getMyClaims(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        List<ClaimResponse> myClaims = claimService.getMyClaims(currentUser);
        return ResponseEntity.ok(myClaims);
    }

    @PatchMapping("/claims/{id}/decision")
    public ResponseEntity<ClaimResponse> decideClaim(
            @PathVariable Long id,
            @Valid @RequestBody ClaimDecisionDto decisionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        ClaimResponse response = claimService.processClaimDecision(id, decisionDto, currentUser);
        return ResponseEntity.ok(response);
    }
}
