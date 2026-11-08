package com.revivio.auth;

import com.revivio.user.Role;
import java.time.Instant;

public record UserProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        Role role,
        String phone,
        String address,
        boolean enabled,
        Instant createdAt
) {}
