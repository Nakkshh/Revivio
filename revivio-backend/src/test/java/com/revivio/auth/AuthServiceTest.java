package com.revivio.auth;

import com.revivio.exception.DuplicateResourceException;
import com.revivio.security.CustomUserDetails;
import com.revivio.security.JwtService;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(4L)
                .firstName("Alex")
                .lastName("Morgan")
                .email("alex@example.com")
                .password("$2a$10$hashedpassword")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new customer with BCrypt hash and JWT")
    void testSuccessfulRegistration() {
        RegisterRequest request = new RegisterRequest(
                "Alex", "Morgan", "alex@example.com", "SecurePassword123!", "+919876543210"
        );

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("$2a$10$hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken(any(CustomUserDetails.class), eq(4L), eq("CUSTOMER"), eq("Alex"), eq("Morgan")))
                .thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isEqualTo("mocked.jwt.token");
        assertThat(response.email()).isEqualTo("alex@example.com");
        assertThat(response.role()).isEqualTo("CUSTOMER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when registering existing email")
    void testDuplicateEmailRegistrationThrowsException() {
        RegisterRequest request = new RegisterRequest(
                "Alex", "Morgan", "alex@example.com", "SecurePassword123!", null
        );

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should authenticate and return JWT token on valid login credentials")
    void testSuccessfulLogin() {
        LoginRequest request = new LoginRequest("alex@example.com", "SecurePassword123!");

        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(sampleUser));
        when(jwtService.generateToken(any(CustomUserDetails.class), eq(4L), eq("CUSTOMER"), eq("Alex"), eq("Morgan")))
                .thenReturn("mocked.jwt.token");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("mocked.jwt.token");
        assertThat(response.userId()).isEqualTo(4L);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("Should propagate BadCredentialsException when login authentication fails")
    void testInvalidLoginCredentials() {
        LoginRequest request = new LoginRequest("alex@example.com", "WrongPassword");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
