package com.kova.backend.catalog;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public final class ProductDtos {
    private ProductDtos() {}

    public record VariantRequest(
            @NotBlank String size,
            @NotBlank String color,
            @NotNull @Min(0) Integer stock,
            boolean active
    ) {}

    public record ProductRequest(
            @NotBlank @Size(max = 140) String name,
            @NotBlank @Size(max = 140) String slug,
            @NotNull @DecimalMin("0.00") BigDecimal price,
            @Size(max = 240) String shortDescription,
            String description,
            @NotNull UUID categoryId,
            List<@NotBlank String> imageUrls,
            List<@Valid VariantRequest> variants,
            boolean featured,
            boolean isNew,
            boolean visible
    ) {}

    public record VariantResponse(UUID id, String size, String color, Integer stock, boolean active) {}

    public record ProductResponse(
            UUID id,
            String name,
            String slug,
            BigDecimal price,
            String shortDescription,
            String description,
            UUID categoryId,
            String category,
            String categorySlug,
            List<String> imageUrls,
            List<VariantResponse> variants,
            boolean featured,
            boolean isNew,
            boolean available
    ) {}

    public record CategoryRequest(
            @NotBlank @Size(max = 80) String name,
            @NotBlank @Size(max = 100) String slug,
            @NotNull @Min(0) Integer sortOrder,
            boolean visible
    ) {}

    public record CategoryResponse(UUID id, String name, String slug, Integer sortOrder, boolean visible) {}
}
