package com.kova.backend.config;

import com.kova.backend.user.Role;
import com.kova.backend.user.User;
import com.kova.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public AdminBootstrap(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${ADMIN_EMAIL:}") String adminEmail,
                          @Value("${ADMIN_PASSWORD:}") String adminPassword,
                          @Value("${ADMIN_NAME:KOVA Admin}") String adminName) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) return;
        userRepository.findByEmailIgnoreCase(adminEmail).orElseGet(() -> {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail.trim().toLowerCase());
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            return userRepository.save(admin);
        });
    }
}
