package com.college.lostfound.dto;

import com.college.lostfound.model.Item;
import com.college.lostfound.model.ItemStatus;
import com.college.lostfound.model.ItemType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ItemResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private ItemType itemType;
    private String location;
    private LocalDate eventDate;
    private String imagePath;
    private ItemStatus status;
    private String additionalDetails;
    private Long createdById;
    private String createdByName;
    private String createdByDepartment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ItemResponse() {}

    public ItemResponse(Item item) {
        this.id = item.getId();
        this.title = item.getTitle();
        this.description = item.getDescription();
        this.category = item.getCategory();
        this.itemType = item.getItemType();
        this.location = item.getLocation();
        this.eventDate = item.getEventDate();
        this.imagePath = item.getImagePath();
        this.status = item.getStatus();
        this.additionalDetails = item.getAdditionalDetails();
        if (item.getCreatedBy() != null) {
            this.createdById = item.getCreatedBy().getId();
            this.createdByName = item.getCreatedBy().getFullName();
            this.createdByDepartment = item.getCreatedBy().getDepartment();
        }
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ItemType getItemType() { return itemType; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }

    public String getAdditionalDetails() { return additionalDetails; }
    public void setAdditionalDetails(String additionalDetails) { this.additionalDetails = additionalDetails; }

    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public String getCreatedByDepartment() { return createdByDepartment; }
    public void setCreatedByDepartment(String createdByDepartment) { this.createdByDepartment = createdByDepartment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
