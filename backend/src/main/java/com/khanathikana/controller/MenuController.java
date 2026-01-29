package com.khanathikana.controller;

import com.khanathikana.entity.Category;
import com.khanathikana.entity.MenuItem;
import com.khanathikana.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }
    
    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<MenuItem>> getItemsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(menuService.getItemsByCategory(categoryId));
    }
    
    @GetMapping("/items/favorites")
    public ResponseEntity<List<MenuItem>> getFavoriteItems() {
        return ResponseEntity.ok(menuService.getFavoriteItems());
    }
    
    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getItemById(id));
    }
}
