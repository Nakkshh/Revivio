package com.revivio.attachment;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface StorageService {
    String store(MultipartFile file, AttachmentCategory category);
    InputStream load(String storedFilename);
    void delete(String storedFilename);
    String getContentType(String storedFilename);
}
