package com.pulse.service;

import com.pulse.dto.AuthRequestDTO;
import com.pulse.dto.AuthResponseDTO;
import com.pulse.model.User;
import com.pulse.repository.UserRepository;
import com.pulse.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(AuthRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        // 1. Explicitly set the role here so Lombok doesn't leave it null
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER") // <-- ADDED THIS
                .build();
        userRepository.save(user);

        // 2. Pass the newly assigned role into the token generator
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole()); // <-- UPDATED THIS
        return new AuthResponseDTO(token, user.getEmail());
    }

    public AuthResponseDTO login(AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        // 1. Fetch the user from the database to get their true clearance level
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        
        // 2. Pass the database-verified role into the token generator
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole()); // <-- UPDATED THIS
        
        return new AuthResponseDTO(token, request.getEmail());
    }
}