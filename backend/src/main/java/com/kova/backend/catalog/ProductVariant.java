package com.kova.backend.catalog;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "product_variants", uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "size", "color"}))
public class ProductVariant {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 40)
    private String size;

    @Column(nullable = false, length = 60)
    private String color;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(nullable = false)
    private boolean active = true;

    public UUID getId() { return id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
