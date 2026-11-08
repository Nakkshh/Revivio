# Stage 1: Build JAR using Maven and OpenJDK 17
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal JRE Runtime
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Create non-root system user for security
RUN addgroup -S revivio && adduser -S revivio -G revivio

# Create storage upload directory with permissions
RUN mkdir -p /app/uploads && chown -R revivio:revivio /app

COPY --from=builder /build/target/*.jar app.jar
RUN chown revivio:revivio app.jar

USER revivio

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
