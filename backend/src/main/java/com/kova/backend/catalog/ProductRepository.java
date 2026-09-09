package com.kova.backend.catalog;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @EntityGraph(attributePaths = {"category", "variants"})
    @Query("""
        select p from Product p
        where p.visible = true
          and (:category is null or p.category.slug = :category)
          and (:q is null or lower(p.name) like lower(concat('%', :q, '%')))
        order by p.featured desc, p.createdAt desc
        """)
    List<Product> searchVisible(@Param("category") String category, @Param("q") String q);

    @EntityGraph(attributePaths = {"category", "variants"})
    @Query("select p from Product p order by p.createdAt desc")
    List<Product> findAllForAdmin();

    @EntityGraph(attributePaths = {"category", "variants"})
    @Query("select p from Product p where p.slug = :slug and p.visible = true")
    Optional<Product> findVisibleBySlug(@Param("slug") String slug);
}
