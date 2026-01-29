package com.khanathikana.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "table_number", unique = true, nullable = false)
    private String tableNumber;
    
    @Column(nullable = false)
    private String section;
    
    @Column(nullable = false)
    private Integer capacity = 4;
    
    @Column(nullable = false)
    private String status = "BLANK";
}
