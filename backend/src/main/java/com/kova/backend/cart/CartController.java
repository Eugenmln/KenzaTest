package com.kova.backend.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartService.CartItemResponse> list() {
        return cartService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartService.CartItemResponse add(@RequestBody CartRequest request) {
        return cartService.add(request.variantId(), request.quantity());
    }

    @PutMapping("/{itemId}")
    public CartService.CartItemResponse update(@PathVariable UUID itemId, @RequestBody QuantityRequest request) {
        return cartService.update(itemId, request.quantity());
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable UUID itemId) {
        cartService.remove(itemId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clear() {
        cartService.clear();
    }

    public record CartRequest(@NotNull UUID variantId, @Min(1) int quantity) {}
    public record QuantityRequest(@Min(1) int quantity) {}
}
