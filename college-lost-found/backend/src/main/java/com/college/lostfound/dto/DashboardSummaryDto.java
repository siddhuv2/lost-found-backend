package com.college.lostfound.dto;

import java.util.List;

public class DashboardSummaryDto {
    private long activeLostCount;
    private long activeFoundCount;
    private long totalLostCount;
    private long totalFoundCount;
    private List<ItemResponse> recentItems;

    public DashboardSummaryDto() {}

    public DashboardSummaryDto(long activeLostCount, long activeFoundCount, long totalLostCount, long totalFoundCount, List<ItemResponse> recentItems) {
        this.activeLostCount = activeLostCount;
        this.activeFoundCount = activeFoundCount;
        this.totalLostCount = totalLostCount;
        this.totalFoundCount = totalFoundCount;
        this.recentItems = recentItems;
    }

    public long getActiveLostCount() { return activeLostCount; }
    public void setActiveLostCount(long activeLostCount) { this.activeLostCount = activeLostCount; }

    public long getActiveFoundCount() { return activeFoundCount; }
    public void setActiveFoundCount(long activeFoundCount) { this.activeFoundCount = activeFoundCount; }

    public long getTotalLostCount() { return totalLostCount; }
    public void setTotalLostCount(long totalLostCount) { this.totalLostCount = totalLostCount; }

    public long getTotalFoundCount() { return totalFoundCount; }
    public void setTotalFoundCount(long totalFoundCount) { this.totalFoundCount = totalFoundCount; }

    public List<ItemResponse> getRecentItems() { return recentItems; }
    public void setRecentItems(List<ItemResponse> recentItems) { this.recentItems = recentItems; }
}
