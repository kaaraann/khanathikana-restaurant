package com.khanathikana.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "table_id")
    private RestaurantTable table;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "order_type", nullable = false)
    private String orderType = "DINE_IN";
    
    @Column(nullable = false)
    private String status = "PENDING";
    
    @Column(nullable = false)
    private Double subtotal = 0.0;
    
    @Column(nullable = false)
    private Double tax = 0.0;
    
    @Column(nullable = false)
    private Double discount = 0.0;
    
    @Column(nullable = false)
    private Double total = 0.0;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid = false;
    
    @Column(name = "is_loyalty")
    private Boolean isLoyalty = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();
}
