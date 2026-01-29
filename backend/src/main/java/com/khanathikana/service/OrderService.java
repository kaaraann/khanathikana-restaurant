package com.khanathikana.service;

import com.khanathikana.dto.OrderItemRequest;
import com.khanathikana.dto.OrderRequest;
import com.khanathikana.entity.*;
import com.khanathikana.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private TableRepository tableRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        
        if (request.getTableId() != null) {
            RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));
            order.setTable(table);
        }
        
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);
        
        order.setOrderType(request.getOrderType() != null ? request.getOrderType() : "DINE_IN");
        order.setStatus("PENDING");
        order.setDiscount(request.getDiscount() != null ? request.getDiscount() : 0.0);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setIsLoyalty(request.getIsLoyalty() != null ? request.getIsLoyalty() : false);
        order.setCreatedAt(LocalDateTime.now());
        
        double subtotal = 0.0;
        
        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setTotal(menuItem.getPrice() * itemReq.getQuantity());
            orderItem.setNotes(itemReq.getNotes());
            
            order.getItems().add(orderItem);
            subtotal += orderItem.getTotal();
        }
        
        order.setSubtotal(subtotal);
        double tax = subtotal * 0.05;
        order.setTax(tax);
        order.setTotal(subtotal + tax - order.getDiscount());
        
        if (request.getPaymentMethod() != null) {
            order.setIsPaid(true);
            order.setStatus("COMPLETED");
            if (order.getTable() != null) {
                order.getTable().setStatus("AVAILABLE");
                tableRepository.save(order.getTable());
            }
        } else {
            if (order.getTable() != null) {
                order.getTable().setStatus("AVAILABLE");
                tableRepository.save(order.getTable());
            }
        }
        
        return orderRepository.save(order);
    }
    
    public List<Order> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableId(tableId);
    }
    
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        if (order.getTable() != null) {
            if ("COMPLETED".equals(status) || "PAID".equals(status)) {
                order.getTable().setStatus("PAID");
            } else if ("PRINTED".equals(status)) {
                order.getTable().setStatus("PRINTED");
            } else if ("KOT".equals(status)) {
                order.getTable().setStatus("RUNNING_KOT");
            }
            tableRepository.save(order.getTable());
        }
        
        return orderRepository.save(order);
    }
}
