package com.kova.backend.favorite;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<FavoriteService.FavoriteResponse> list() {
        return favoriteService.list();
    }

    @PostMapping("/{productId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteService.FavoriteResponse add(@PathVariable UUID productId) {
        return favoriteService.add(productId);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable UUID productId) {
        favoriteService.remove(productId);
    }
}
