package com.kova.backend.order;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public List<OrderService.OrderResponse> myOrders() {
        return orderService.listMine();
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderService.OrderResponse create(@Valid @RequestBody OrderService.CreateOrderRequest request) {
        return orderService.createFromCart(request);
    }

    @GetMapping("/admin/orders")
    public List<OrderService.OrderResponse> allOrders() {
        return orderService.listAll();
    }

    @PatchMapping("/admin/orders/{orderId}/status")
    public OrderService.OrderResponse updateStatus(@PathVariable UUID orderId,
                                                   @RequestBody OrderService.StatusRequest request) {
        return orderService.updateStatus(orderId, request.status());
    }
}
