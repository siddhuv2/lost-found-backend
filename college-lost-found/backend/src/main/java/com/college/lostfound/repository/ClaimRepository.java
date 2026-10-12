package com.college.lostfound.repository;

import com.college.lostfound.model.Claim;
import com.college.lostfound.model.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);

    @Query("SELECT c FROM Claim c JOIN c.item i WHERE i.createdBy.id = :reporterId ORDER BY c.createdAt DESC")
    List<Claim> findReceivedClaimsForReporter(@Param("reporterId") Long reporterId);

    List<Claim> findByItemIdOrderByCreatedAtDesc(Long itemId);

    boolean existsByItemIdAndClaimantIdAndStatus(Long itemId, Long claimantId, ClaimStatus status);

    boolean existsByItemIdAndClaimantId(Long itemId, Long claimantId);

    Optional<Claim> findByItemIdAndClaimantId(Long itemId, Long claimantId);
}
