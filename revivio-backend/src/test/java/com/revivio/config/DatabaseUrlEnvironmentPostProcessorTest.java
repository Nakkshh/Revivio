package com.revivio.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DatabaseUrlEnvironmentPostProcessorTest {

    private final DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();

    @Test
    void testNeonEmbeddedJdbcUrlNormalized() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("SPRING_DATASOURCE_URL", "jdbc:postgresql://mock_user:mock_pass_123@ep-sample-pooler.aws.neon.tech/neondb?sslmode=require");

        processor.postProcessEnvironment(env, null);

        assertEquals("jdbc:postgresql://ep-sample-pooler.aws.neon.tech/neondb?sslmode=require", env.getProperty("spring.datasource.url"));
        assertEquals("mock_user", env.getProperty("spring.datasource.username"));
        assertEquals("mock_pass_123", env.getProperty("spring.datasource.password"));
    }

    @Test
    void testStandardPostgresUriNormalized() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("DATABASE_URL", "postgres://testuser:testpass@dbhost:5432/reviviodb?sslmode=require");

        processor.postProcessEnvironment(env, null);

        assertEquals("jdbc:postgresql://dbhost:5432/reviviodb?sslmode=require", env.getProperty("spring.datasource.url"));
        assertEquals("testuser", env.getProperty("spring.datasource.username"));
        assertEquals("testpass", env.getProperty("spring.datasource.password"));
    }

    @Test
    void testCleanJdbcUrlLeftUnchanged() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5432/revivio_db");

        processor.postProcessEnvironment(env, null);

        // Not overridden by the processor
        assertEquals("jdbc:postgresql://localhost:5432/revivio_db", env.getProperty("SPRING_DATASOURCE_URL"));
    }
}
