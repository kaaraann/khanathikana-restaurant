package com.khanathikana.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long tableId;
    private Long userId;
    private String orderType;
    private List<OrderItemRequest> items;
    private Double discount;
    private String paymentMethod;
    private Boolean isLoyalty;
}
