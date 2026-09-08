package com.kova.backend.cart;

import com.kova.backend.catalog.ProductVariant;
import com.kova.backend.catalog.ProductVariantRepository;
import com.kova.backend.security.CurrentUser;
import com.kova.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class CartService {
    private final CartItemRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    public CartService(CartItemRepository cartRepository, ProductVariantRepository variantRepository,
                       UserRepository userRepository, CurrentUser currentUser) {
        this.cartRepository = cartRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> list() {
        return cartRepository.findAllByUserId(currentUser.id()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public CartItemResponse add(UUID variantId, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be at least 1");
        UUID userId = currentUser.id();
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variant not found"));
        if (!variant.isActive() || variant.getStock() < quantity) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        CartItem item = cartRepository.findByUserIdAndVariantId(userId, variantId).orElseGet(() -> {
            CartItem created = new CartItem();
            created.setUser(userRepository.getReferenceById(userId));
            created.setVariant(variant);
            created.setQuantity(0);
            return created;
        });
        int newQuantity = item.getQuantity() + quantity;
        if (newQuantity > variant.getStock()) throw new IllegalArgumentException("Insufficient stock");
        item.setQuantity(newQuantity);
        return toResponse(cartRepository.save(item));
    }

    @Transactional
    public CartItemResponse update(UUID itemId, int quantity) {
        CartItem item = cartRepository.findById(itemId)
                .filter(i -> i.getUser().getId().equals(currentUser.id()))
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (quantity < 1 || quantity > item.getVariant().getStock()) {
            throw new IllegalArgumentException("Invalid quantity");
        }
        item.setQuantity(quantity);
        return toResponse(cartRepository.save(item));
    }

    @Transactional
    public void remove(UUID itemId) {
        CartItem item = cartRepository.findById(itemId)
                .filter(i -> i.getUser().getId().equals(currentUser.id()))
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        cartRepository.delete(item);
    }

    @Transactional
    public void clear() { cartRepository.deleteByUserId(currentUser.id()); }

    private CartItemResponse toResponse(CartItem item) {
        var variant = item.getVariant();
        var product = variant.getProduct();
        BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(item.getId(), product.getId(), product.getName(), product.getSlug(),
                variant.getId(), variant.getSize(), variant.getColor(), product.getPrice(), item.getQuantity(), subtotal);
    }

    public record CartItemResponse(UUID id, UUID productId, String productName, String productSlug,
                                   UUID variantId, String size, String color, BigDecimal unitPrice,
                                   Integer quantity, BigDecimal subtotal) {}
}
