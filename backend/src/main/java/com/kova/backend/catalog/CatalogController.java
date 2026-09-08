package com.kova.backend.catalog;

import com.kova.backend.catalog.ProductDtos.CategoryResponse;
import com.kova.backend.catalog.ProductDtos.ProductResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {
    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/products")
    public List<ProductResponse> products(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q
    ) {
        return catalogService.listProducts(category, q);
    }

    @GetMapping("/products/{slug}")
    public ProductResponse product(@PathVariable String slug) {
        return catalogService.getBySlug(slug);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return catalogService.listCategories();
    }
}
