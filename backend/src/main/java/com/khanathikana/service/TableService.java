package com.khanathikana.service;

import com.khanathikana.entity.RestaurantTable;
import com.khanathikana.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TableService {
    
    @Autowired
    private TableRepository tableRepository;
    
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }
    
    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Table not found"));
    }
    
    public List<RestaurantTable> getTablesBySection(String section) {
        return tableRepository.findBySection(section);
    }
    
    public RestaurantTable createTable(RestaurantTable table) {
        if (tableRepository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Table number already exists");
        }
        return tableRepository.save(table);
    }
    
    public RestaurantTable updateTableStatus(Long id, String status) {
        RestaurantTable table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }
    
    public RestaurantTable updateTable(Long id, RestaurantTable tableDetails) {
        RestaurantTable table = getTableById(id);
        table.setTableNumber(tableDetails.getTableNumber());
        table.setSection(tableDetails.getSection());
        table.setCapacity(tableDetails.getCapacity());
        table.setStatus(tableDetails.getStatus());
        return tableRepository.save(table);
    }
    
    public void deleteTable(Long id) {
        RestaurantTable table = getTableById(id);
        tableRepository.delete(table);
    }
}
