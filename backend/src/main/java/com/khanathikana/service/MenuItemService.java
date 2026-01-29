package com.khanathikana.service;

import com.khanathikana.entity.MenuItem;
import com.khanathikana.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuItemService {
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }
    
    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }
    
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }
    
    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        MenuItem menuItem = getMenuItemById(id);
        if (menuItemDetails.getName() != null) {
            menuItem.setName(menuItemDetails.getName());
        }
        if (menuItemDetails.getDescription() != null) {
            menuItem.setDescription(menuItemDetails.getDescription());
        }
        if (menuItemDetails.getPrice() != null) {
            menuItem.setPrice(menuItemDetails.getPrice());
        }
        if (menuItemDetails.getCategory() != null) {
            menuItem.setCategory(menuItemDetails.getCategory());
        }
        if (menuItemDetails.getAvailable() != null) {
            menuItem.setAvailable(menuItemDetails.getAvailable());
        }
        if (menuItemDetails.getIsFavorite() != null) {
            menuItem.setIsFavorite(menuItemDetails.getIsFavorite());
        }
        if (menuItemDetails.getImageUrl() != null) {
            menuItem.setImageUrl(menuItemDetails.getImageUrl());
        }
        return menuItemRepository.save(menuItem);
    }
    
    public void deleteMenuItem(Long id) {
        MenuItem menuItem = getMenuItemById(id);
        menuItemRepository.delete(menuItem);
    }
}
