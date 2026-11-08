package com.revivio.auth;

import java.time.Instant;

public record AuthResponse(
        String token,
        Long userId,
        String email,
        String firstName,
        String lastName,
        String role,
        Instant issuedAt
) {}
