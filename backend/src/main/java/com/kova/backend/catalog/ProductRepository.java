package com.kova.backend.catalog;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findByVisibleTrueOrderByFeaturedDescCreatedAtDesc();

    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findByVisibleTrueAndCategorySlugOrderByFeaturedDescCreatedAtDesc(String categorySlug);

    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findByVisibleTrueAndNameContainingIgnoreCaseOrderByFeaturedDescCreatedAtDesc(String query);

    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findByVisibleTrueAndCategorySlugAndNameContainingIgnoreCaseOrderByFeaturedDescCreatedAtDesc(
            String categorySlug,
            String query
    );

    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"category", "variants"})
    Optional<Product> findBySlugAndVisibleTrue(String slug);
}
