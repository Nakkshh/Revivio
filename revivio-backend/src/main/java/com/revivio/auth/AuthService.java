package com.revivio.auth;

import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import com.revivio.security.CustomUserDetails;
import com.revivio.security.JwtService;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("An account with email " + request.email() + " already exists.");
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().toLowerCase().trim())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER) // Public registration always customer
                .phone(request.phone())
                .enabled(true)
                .build();

        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(
                userDetails,
                user.getId(),
                user.getRole().name(),
                user.getFirstName(),
                user.getLastName()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                Instant.now()
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().toLowerCase().trim(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.email()));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(
                userDetails,
                user.getId(),
                user.getRole().name(),
                user.getFirstName(),
                user.getLastName()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                Instant.now()
        );
    }

    public UserProfileResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}
