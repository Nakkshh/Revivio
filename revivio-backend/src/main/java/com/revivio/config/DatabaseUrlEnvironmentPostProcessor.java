package com.revivio.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Normalizes PostgreSQL database URLs for cloud environments (Neon, Render, Railway, Heroku).
 * Converts URI formats like:
 *   postgres://user:pass@host:5432/db?sslmode=require
 *   postgresql://user:pass@host/db?sslmode=require
 *   jdbc:postgresql://user:pass@host/db?sslmode=require
 * into standard PostgreSQL JDBC format without embedded credentials,
 * extracting username and password into spring.datasource properties.
 */
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUrlEnvironmentPostProcessor.class);

    private static final Pattern DB_URL_PATTERN = Pattern.compile(
            "^(?:jdbc:)?postgres(?:ql)?://(?:([^:@]+)(?::([^@]*))?@)?([^/?#]+)(?:/([^?#]*))?(?:\\?(.*))?$"
    );

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String rawUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = environment.getProperty("DATABASE_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = environment.getProperty("spring.datasource.url");
        }

        if (rawUrl == null || rawUrl.isBlank()) {
            return;
        }

        Matcher matcher = DB_URL_PATTERN.matcher(rawUrl.trim());
        if (!matcher.matches()) {
            return;
        }

        String user = matcher.group(1);
        String pass = matcher.group(2);
        String hostPort = matcher.group(3);
        String dbName = matcher.group(4);
        String query = matcher.group(5);

        // If no credentials were in the URL and it already starts with jdbc:postgresql://, leave it as-is
        if (user == null && rawUrl.startsWith("jdbc:postgresql://")) {
            return;
        }

        StringBuilder cleanJdbcUrl = new StringBuilder("jdbc:postgresql://").append(hostPort);
        if (dbName != null && !dbName.isBlank()) {
            cleanJdbcUrl.append("/").append(dbName);
        }
        if (query != null && !query.isBlank()) {
            cleanJdbcUrl.append("?").append(query);
        }

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", cleanJdbcUrl.toString());

        if (user != null && !user.isBlank()) {
            props.put("spring.datasource.username", decode(user));
        }
        if (pass != null) {
            props.put("spring.datasource.password", decode(pass));
        }

        log.info("DatabaseUrlEnvironmentPostProcessor: Normalized cloud datasource URL for host '{}'", hostPort);

        PropertySource<?> propertySource = new MapPropertySource("cloudDatabaseUrlProperties", props);
        environment.getPropertySources().addFirst(propertySource);
    }

    private String decode(String value) {
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return value;
        }
    }
}
