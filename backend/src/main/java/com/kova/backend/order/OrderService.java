package com.kova.backend.order;

import com.kova.backend.cart.CartItemRepository;
import com.kova.backend.catalog.ProductVariantRepository;
import com.kova.backend.security.CurrentUser;
import com.kova.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartItemRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartRepository,
                        ProductVariantRepository variantRepository, UserRepository userRepository,
                        CurrentUser currentUser) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listMine() {
        return orderRepository.findAllByUserId(currentUser.id()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listAll() {
        return orderRepository.findAllWithItems().stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse createFromCart(CreateOrderRequest request) {
        UUID userId = currentUser.id();
        var cart = cartRepository.findAllByUserId(userId);
        if (cart.isEmpty()) throw new IllegalArgumentException("Cart is empty");

        Order order = new Order();
        order.setUser(userRepository.getReferenceById(userId));
        order.setCustomerName(request.customerName());
        order.setCustomerPhone(request.customerPhone());

        BigDecimal total = BigDecimal.ZERO;
        for (var cartItem : cart) {
            var variant = variantRepository.findByIdForUpdate(cartItem.getVariant().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Variant not found"));

            if (!variant.isActive() || variant.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for " + variant.getProduct().getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(variant.getProduct().getId());
            item.setVariantId(variant.getId());
            item.setProductName(variant.getProduct().getName());
            item.setSize(variant.getSize());
            item.setColor(variant.getColor());
            item.setUnitPrice(variant.getProduct().getPrice());
            item.setQuantity(cartItem.getQuantity());
            order.getItems().add(item);

            total = total.add(variant.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            variant.setStock(variant.getStock() - cartItem.getQuantity());
        }

        order.setTotal(total);
        Order saved = orderRepository.save(order);
        cartRepository.deleteByUserId(userId);
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse updateStatus(UUID orderId, OrderStatus status) {
        if (status == null) throw new IllegalArgumentException("Status is required");
        Order order = orderRepository.findWithItemsById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(), order.getStatus(), order.getTotal(), order.getCustomerName(), order.getCustomerPhone(),
                order.getCreatedAt(),
                order.getItems().stream().map(i -> new OrderItemResponse(
                        i.getId(), i.getProductId(), i.getVariantId(), i.getProductName(), i.getSize(), i.getColor(),
                        i.getUnitPrice(), i.getQuantity()
                )).toList()
        );
    }

    public record CreateOrderRequest(String customerName, String customerPhone) {}
    public record StatusRequest(OrderStatus status) {}
    public record OrderItemResponse(UUID id, UUID productId, UUID variantId, String productName,
                                    String size, String color, BigDecimal unitPrice, Integer quantity) {}
    public record OrderResponse(UUID id, OrderStatus status, BigDecimal total, String customerName,
                                String customerPhone, java.time.Instant createdAt, List<OrderItemResponse> items) {}
}
