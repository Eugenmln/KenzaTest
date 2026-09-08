package com.kova.backend.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    @Query("select f from Favorite f join fetch f.product p where f.user.id = :userId order by f.createdAt desc")
    List<Favorite> findAllByUserId(@Param("userId") UUID userId);
    Optional<Favorite> findByUserIdAndProductId(UUID userId, UUID productId);
}
