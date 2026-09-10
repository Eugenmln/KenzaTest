package com.kova.backend.user;

import com.kova.backend.security.CurrentUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    public ProfileController(UserRepository userRepository, CurrentUser currentUser) {
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ProfileResponse get() {
        return toResponse(userRepository.findById(currentUser.id())
                .orElseThrow(() -> new IllegalArgumentException("User not found")));
    }

    @PutMapping
    public ProfileResponse update(@Valid @RequestBody ProfileUpdateRequest request) {
        User user = userRepository.findById(currentUser.id())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone());
        return toResponse(userRepository.save(user));
    }

    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole());
    }

    public record ProfileUpdateRequest(
            @NotBlank @Size(max = 120) String fullName,
            @Size(max = 40) String phone
    ) {}

    public record ProfileResponse(UUID id, String fullName, String email, String phone, Role role) {}
}
