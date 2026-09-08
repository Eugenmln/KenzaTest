package com.kova.backend.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("""
        select distinct p from Product p
        left join fetch p.category
        left join fetch p.variants
        where p.visible = true
          and (:category is null or p.category.slug = :category)
          and (:q is null or lower(p.name) like lower(concat('%', :q, '%')))
        order by p.featured desc, p.createdAt desc
        """)
    List<Product> searchVisible(@Param("category") String category, @Param("q") String q);

    @Query("select distinct p from Product p left join fetch p.category left join fetch p.variants order by p.createdAt desc")
    List<Product> findAllForAdmin();

    @Query("select distinct p from Product p left join fetch p.category left join fetch p.variants where p.slug = :slug and p.visible = true")
    Optional<Product> findVisibleBySlug(@Param("slug") String slug);
}
