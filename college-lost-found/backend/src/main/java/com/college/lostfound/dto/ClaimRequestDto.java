package com.college.lostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClaimRequestDto {

    @NotBlank(message = "Claim description is required")
    @Size(min = 10, max = 1500, message = "Description must provide sufficient detail (between 10 and 1500 characters)")
    private String claimDescription;

    public ClaimRequestDto() {}

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }
}
