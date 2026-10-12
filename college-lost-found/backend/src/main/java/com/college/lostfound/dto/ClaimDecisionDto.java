package com.college.lostfound.dto;

import com.college.lostfound.model.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public class ClaimDecisionDto {

    @NotNull(message = "Decision status is required")
    private ClaimStatus status;

    private String responseNote;

    public ClaimDecisionDto() {}

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public String getResponseNote() { return responseNote; }
    public void setResponseNote(String responseNote) { this.responseNote = responseNote; }
}
