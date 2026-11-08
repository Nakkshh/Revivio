package com.revivio.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {
    private String secret = "revivio-super-secure-production-jwt-token-secret-key-min-256-bits";
    private long expiration = 86400000L; // 24 hours
}
