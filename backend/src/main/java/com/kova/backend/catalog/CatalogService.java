package com.kova.backend.catalog;

import com.kova.backend.catalog.ProductDtos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CatalogService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public CatalogService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listProducts(String category, String q) {
        String normalizedCategory = blankToNull(category);
        String normalizedQuery = blankToNull(q);
        return productRepository.searchVisible(normalizedCategory, normalizedQuery).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listAllProductsForAdmin() {
        return productRepository.findAllForAdmin().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getBySlug(String slug) {
        return productRepository.findVisibleBySlug(slug).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listCategories() {
        return categoryRepository.findByVisibleTrueOrderBySortOrderAscNameAsc().stream().map(this::toCategoryResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAllCategoriesForAdmin() {
        return categoryRepository.findAll().stream().map(this::toCategoryResponse).toList();
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        apply(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        apply(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setVisible(false);
        productRepository.save(product);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        applyCategory(category, request);
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        applyCategory(category, request);
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        category.setVisible(false);
        categoryRepository.save(category);
    }

    private void apply(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        product.setName(request.name().trim());
        product.setSlug(request.slug().trim().toLowerCase());
        product.setPrice(request.price());
        product.setShortDescription(request.shortDescription());
        product.setDescription(request.description());
        product.setCategory(category);
        product.setFeatured(request.featured());
        product.setNew(request.isNew());
        product.setVisible(request.visible());

        product.getImageUrls().clear();
        if (request.imageUrls() != null) product.getImageUrls().addAll(request.imageUrls());

        product.getVariants().clear();
        if (request.variants() != null) {
            request.variants().forEach(item -> {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                variant.setSize(item.size().trim());
                variant.setColor(item.color().trim());
                variant.setStock(item.stock());
                variant.setActive(item.active());
                product.getVariants().add(variant);
            });
        }
    }

    private void applyCategory(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        category.setSlug(request.slug().trim().toLowerCase());
        category.setSortOrder(request.sortOrder());
        category.setVisible(request.visible());
    }

    private ProductResponse toResponse(Product product) {
        List<VariantResponse> variants = product.getVariants().stream()
                .map(v -> new VariantResponse(v.getId(), v.getSize(), v.getColor(), v.getStock(), v.isActive()))
                .toList();
        boolean available = variants.stream().anyMatch(v -> v.active() && v.stock() > 0);
        return new ProductResponse(
                product.getId(), product.getName(), product.getSlug(), product.getPrice(),
                product.getShortDescription(), product.getDescription(), product.getCategory().getId(),
                product.getCategory().getName(), product.getCategory().getSlug(), List.copyOf(product.getImageUrls()),
                variants, product.isFeatured(), product.isNew(), available
        );
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getSlug(), category.getSortOrder(), category.isVisible());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
