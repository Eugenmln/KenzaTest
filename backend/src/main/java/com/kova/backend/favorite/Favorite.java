package com.kova.backend.favorite;

import com.kova.backend.catalog.Product;
import com.kova.backend.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
public class Favorite {
    @Id @GeneratedValue private UUID id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "product_id") private Product product;
    @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
