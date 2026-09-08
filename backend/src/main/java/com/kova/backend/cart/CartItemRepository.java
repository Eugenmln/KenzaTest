package com.kova.backend.cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    @Query("select c from CartItem c join fetch c.variant v join fetch v.product p where c.user.id = :userId order by c.createdAt asc")
    List<CartItem> findAllByUserId(@Param("userId") UUID userId);

    Optional<CartItem> findByUserIdAndVariantId(UUID userId, UUID variantId);
    void deleteByUserId(UUID userId);
}
