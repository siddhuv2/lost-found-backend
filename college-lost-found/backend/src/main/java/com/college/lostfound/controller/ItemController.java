package com.college.lostfound.controller;

import com.college.lostfound.dto.DashboardSummaryDto;
import com.college.lostfound.dto.ItemRequest;
import com.college.lostfound.dto.ItemResponse;
import com.college.lostfound.model.ItemType;
import com.college.lostfound.model.User;
import com.college.lostfound.security.CustomUserDetails;
import com.college.lostfound.service.AuthService;
import com.college.lostfound.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final AuthService authService;

    @Autowired
    public ItemController(ItemService itemService, AuthService authService) {
        this.itemService = itemService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ItemResponse> items = itemService.getItems(type, category, location, search, pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        ItemResponse item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        DashboardSummaryDto summary = itemService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ItemResponse> createItem(
            @Valid @ModelAttribute ItemRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        ItemResponse created = itemService.createItem(request, image, currentUser);
        return ResponseEntity.ok(created);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable Long id,
            @Valid @ModelAttribute ItemRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        ItemResponse updated = itemService.updateItem(id, request, image, currentUser);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        itemService.deleteItem(id, currentUser);
        return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<ItemResponse>> getMyReports(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = authService.getCurrentUserEntity(userDetails.getUsername());
        List<ItemResponse> myReports = itemService.getMyReports(currentUser);
        return ResponseEntity.ok(myReports);
    }
}
