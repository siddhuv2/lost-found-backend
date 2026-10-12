package com.college.lostfound.dto;

import com.college.lostfound.model.Claim;
import com.college.lostfound.model.ClaimStatus;

import java.time.LocalDateTime;

public class ClaimResponse {
    private Long id;
    private Long itemId;
    private String itemTitle;
    private String itemType;
    private Long claimantId;
    private String claimantName;
    private String claimantEmail;
    private String claimantDepartment;
    private String claimantCollegeId;
    private String claimDescription;
    private ClaimStatus status;
    private String responseNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ClaimResponse() {}

    public ClaimResponse(Claim claim) {
        this.id = claim.getId();
        if (claim.getItem() != null) {
            this.itemId = claim.getItem().getId();
            this.itemTitle = claim.getItem().getTitle();
            this.itemType = claim.getItem().getItemType().name();
        }
        if (claim.getClaimant() != null) {
            this.claimantId = claim.getClaimant().getId();
            this.claimantName = claim.getClaimant().getFullName();
            this.claimantEmail = claim.getClaimant().getEmail();
            this.claimantDepartment = claim.getClaimant().getDepartment();
            this.claimantCollegeId = claim.getClaimant().getCollegeId();
        }
        this.claimDescription = claim.getClaimDescription();
        this.status = claim.getStatus();
        this.responseNote = claim.getResponseNote();
        this.createdAt = claim.getCreatedAt();
        this.updatedAt = claim.getUpdatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }

    public String getClaimantDepartment() { return claimantDepartment; }
    public void setClaimantDepartment(String claimantDepartment) { this.claimantDepartment = claimantDepartment; }

    public String getClaimantCollegeId() { return claimantCollegeId; }
    public void setClaimantCollegeId(String claimantCollegeId) { this.claimantCollegeId = claimantCollegeId; }

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public String getResponseNote() { return responseNote; }
    public void setResponseNote(String responseNote) { this.responseNote = responseNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
