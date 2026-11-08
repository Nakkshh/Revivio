package com.revivio.attachment;

import com.revivio.exception.StorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf"
    );
    private static final Map<AttachmentCategory, String> CATEGORY_DIRS = Map.of(
            AttachmentCategory.INVOICE,        "invoices",
            AttachmentCategory.REPAIR_IMAGE,   "repair-images",
            AttachmentCategory.SERVICE_REPORT, "service-reports",
            AttachmentCategory.OTHER,          "other"
    );
    private static final Map<String, String> EXTENSION_CONTENT_TYPES = Map.of(
            "jpg",  "image/jpeg",
            "jpeg", "image/jpeg",
            "png",  "image/png",
            "webp", "image/webp",
            "pdf",  "application/pdf"
    );

    private final Path rootLocation;

    public LocalStorageService(StorageProperties storageProperties) {
        this.rootLocation = Paths.get(storageProperties.getLocation());
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
            for (String subDir : CATEGORY_DIRS.values()) {
                Files.createDirectories(rootLocation.resolve(subDir));
            }
        } catch (IOException ex) {
            throw new StorageException("Could not initialize storage directories", ex);
        }
    }

    @Override
    public String store(MultipartFile file, AttachmentCategory category) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("Cannot store an empty file");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new StorageException(
                    "File type not allowed. Supported types: JPEG, PNG, WEBP, PDF");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new StorageException("File size exceeds maximum allowed size of 10 MB");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown");
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new StorageException("Invalid filename: path traversal detected in '" + originalFilename + "'");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex); // e.g., ".jpg"
        }

        String subDir = CATEGORY_DIRS.getOrDefault(category, "other");
        String storedFilename = subDir + "/" + UUID.randomUUID() + extension;

        Path destinationFile = rootLocation.resolve(storedFilename).normalize();
        if (!destinationFile.startsWith(rootLocation.normalize())) {
            throw new StorageException("Cannot store file outside configured storage directory");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new StorageException("Failed to store file: " + originalFilename, ex);
        }

        return storedFilename;
    }

    @Override
    public InputStream load(String storedFilename) {
        validateFilename(storedFilename);
        Path filePath = rootLocation.resolve(storedFilename).normalize();
        if (!filePath.startsWith(rootLocation.normalize())) {
            throw new StorageException("Path traversal detected in stored filename");
        }
        try {
            return Files.newInputStream(filePath);
        } catch (IOException ex) {
            throw new StorageException("Could not read file: " + storedFilename, ex);
        }
    }

    @Override
    public void delete(String storedFilename) {
        validateFilename(storedFilename);
        Path filePath = rootLocation.resolve(storedFilename).normalize();
        if (!filePath.startsWith(rootLocation.normalize())) {
            throw new StorageException("Path traversal detected in stored filename");
        }
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new StorageException("Could not delete file: " + storedFilename, ex);
        }
    }

    @Override
    public String getContentType(String storedFilename) {
        validateFilename(storedFilename);
        int dotIndex = storedFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            String ext = storedFilename.substring(dotIndex + 1).toLowerCase();
            return EXTENSION_CONTENT_TYPES.getOrDefault(ext, "application/octet-stream");
        }
        return "application/octet-stream";
    }

    // ── private helpers ────────────────────────────────────────────────────

    private void validateFilename(String storedFilename) {
        if (storedFilename == null || storedFilename.isBlank()) {
            throw new StorageException("Stored filename must not be empty");
        }
        // Only allow forward slashes (category/uuid.ext pattern)
        if (storedFilename.contains("..") || storedFilename.contains("\\")) {
            throw new StorageException("Invalid stored filename: path traversal detected");
        }
    }
}
