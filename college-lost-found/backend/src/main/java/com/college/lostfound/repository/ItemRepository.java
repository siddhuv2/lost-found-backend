package com.college.lostfound.repository;

import com.college.lostfound.model.Item;
import com.college.lostfound.model.ItemStatus;
import com.college.lostfound.model.ItemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("SELECT i FROM Item i WHERE " +
           "(:type IS NULL OR i.itemType = :type) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(i.category) = LOWER(:category)) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "  LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "  LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "  LOWER(i.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Item> searchItems(
            @Param("type") ItemType type,
            @Param("category") String category,
            @Param("location") String location,
            @Param("search") String search,
            Pageable pageable
    );

    Page<Item> findByCreatedByIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Item> findByCreatedByIdOrderByCreatedAtDesc(Long userId);

    List<Item> findTop6ByOrderByCreatedAtDesc();

    long countByItemTypeAndStatus(ItemType itemType, ItemStatus status);

    long countByItemType(ItemType itemType);
}
