package com.khanathikana.repository;

import com.khanathikana.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);
    List<MenuItem> findByIsFavoriteTrueAndAvailableTrue();
    List<MenuItem> findByAvailableTrue();
}
