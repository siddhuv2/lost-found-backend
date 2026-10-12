package com.college.lostfound.service;

import com.college.lostfound.dto.DashboardSummaryDto;
import com.college.lostfound.dto.ItemRequest;
import com.college.lostfound.dto.ItemResponse;
import com.college.lostfound.exception.BadRequestException;
import com.college.lostfound.exception.ResourceNotFoundException;
import com.college.lostfound.exception.UnauthorizedActionException;
import com.college.lostfound.model.Item;
import com.college.lostfound.model.ItemStatus;
import com.college.lostfound.model.ItemType;
import com.college.lostfound.model.User;
import com.college.lostfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public ItemService(ItemRepository itemRepository, FileStorageService fileStorageService) {
        this.itemRepository = itemRepository;
        this.fileStorageService = fileStorageService;
    }

    public Page<ItemResponse> getItems(ItemType type, String category, String location, String search, Pageable pageable) {
        Page<Item> page = itemRepository.searchItems(type, category, location, search, pageable);
        return page.map(ItemResponse::new);
    }

    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return new ItemResponse(item);
    }

    @Transactional
    public ItemResponse createItem(ItemRequest request, MultipartFile image, User currentUser) {
        Item item = new Item();
        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory().trim());
        item.setItemType(request.getItemType());
        item.setLocation(request.getLocation().trim());
        item.setEventDate(request.getEventDate());
        item.setAdditionalDetails(request.getAdditionalDetails());
        item.setStatus(request.getStatus() != null ? request.getStatus() : ItemStatus.ACTIVE);
        item.setCreatedBy(currentUser);

        if (image != null && !image.isEmpty()) {
            String imagePath = fileStorageService.storeFile(image);
            item.setImagePath(imagePath);
        }

        Item savedItem = itemRepository.save(item);
        return new ItemResponse(savedItem);
    }

    @Transactional
    public ItemResponse updateItem(Long id, ItemRequest request, MultipartFile image, User currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (!item.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You are only authorized to edit your own reports");
        }

        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory().trim());
        item.setLocation(request.getLocation().trim());
        item.setEventDate(request.getEventDate());
        item.setAdditionalDetails(request.getAdditionalDetails());

        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }

        if (image != null && !image.isEmpty()) {
            String imagePath = fileStorageService.storeFile(image);
            item.setImagePath(imagePath);
        }

        Item updated = itemRepository.save(item);
        return new ItemResponse(updated);
    }

    @Transactional
    public void deleteItem(Long id, User currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (!item.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You are only authorized to delete your own reports");
        }

        itemRepository.delete(item);
    }

    public List<ItemResponse> getMyReports(User currentUser) {
        List<Item> items = itemRepository.findByCreatedByIdOrderByCreatedAtDesc(currentUser.getId());
        return items.stream().map(ItemResponse::new).collect(Collectors.toList());
    }

    public DashboardSummaryDto getDashboardSummary() {
        long activeLost = itemRepository.countByItemTypeAndStatus(ItemType.LOST, ItemStatus.ACTIVE);
        long activeFound = itemRepository.countByItemTypeAndStatus(ItemType.FOUND, ItemStatus.ACTIVE);
        long totalLost = itemRepository.countByItemType(ItemType.LOST);
        long totalFound = itemRepository.countByItemType(ItemType.FOUND);

        List<ItemResponse> recentItems = itemRepository.findTop6ByOrderByCreatedAtDesc()
                .stream()
                .map(ItemResponse::new)
                .collect(Collectors.toList());

        return new DashboardSummaryDto(activeLost, activeFound, totalLost, totalFound, recentItems);
    }

    public Item getItemEntity(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }
}
