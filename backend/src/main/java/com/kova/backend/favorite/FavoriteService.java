package com.kova.backend.favorite;

import com.kova.backend.catalog.ProductRepository;
import com.kova.backend.security.CurrentUser;
import com.kova.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    public FavoriteService(FavoriteRepository favoriteRepository, ProductRepository productRepository,
                           UserRepository userRepository, CurrentUser currentUser) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> list() {
        return favoriteRepository.findAllByUserId(currentUser.id()).stream()
                .map(f -> new FavoriteResponse(f.getId(), f.getProduct().getId(), f.getProduct().getName(), f.getProduct().getSlug()))
                .toList();
    }

    @Transactional
    public FavoriteResponse add(UUID productId) {
        UUID userId = currentUser.id();
        Favorite favorite = favoriteRepository.findByUserIdAndProductId(userId, productId).orElseGet(() -> {
            Favorite created = new Favorite();
            created.setUser(userRepository.getReferenceById(userId));
            created.setProduct(productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found")));
            return favoriteRepository.save(created);
        });
        return new FavoriteResponse(favorite.getId(), favorite.getProduct().getId(), favorite.getProduct().getName(), favorite.getProduct().getSlug());
    }

    @Transactional
    public void remove(UUID productId) {
        Favorite favorite = favoriteRepository.findByUserIdAndProductId(currentUser.id(), productId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    public record FavoriteResponse(UUID id, UUID productId, String productName, String productSlug) {}
}
