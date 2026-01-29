package com.khanathikana.repository;

import com.khanathikana.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByTableId(Long tableId);
    List<Order> findByTableIdAndIsPaidFalse(Long tableId);
    List<Order> findByUserId(Long userId);
}
