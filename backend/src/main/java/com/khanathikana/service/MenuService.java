package com.khanathikana.service;

import com.khanathikana.entity.Category;
import com.khanathikana.entity.MenuItem;
import com.khanathikana.repository.CategoryRepository;
import com.khanathikana.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<MenuItem> getItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryIdAndAvailableTrue(categoryId);
    }
    
    public List<MenuItem> getFavoriteItems() {
        return menuItemRepository.findByIsFavoriteTrueAndAvailableTrue();
    }
    
    public MenuItem getItemById(Long id) {
        return menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }
}
