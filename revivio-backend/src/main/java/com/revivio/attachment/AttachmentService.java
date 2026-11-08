package com.revivio.attachment;

import com.revivio.exception.ResourceNotFoundException;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;

    @Transactional
    public AttachmentResponse upload(MultipartFile file, AttachmentCategory category, Long refId, String refType, Long userId) {
        String storedFilename = storageService.store(file, category);
        User uploader = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Attachment attachment = Attachment.builder()
                .originalFilename(file.getOriginalFilename())
                .storedFilename(storedFilename)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .category(category)
                .referenceId(refId)
                .referenceType(refType)
                .uploadedBy(uploader)
                .storagePath(storedFilename)
                .build();

        Attachment saved = attachmentRepository.save(attachment);
        return AttachmentResponse.from(saved, "/api/v1/attachments/" + saved.getId() + "/download");
    }

    public List<AttachmentResponse> getByReference(String referenceType, Long referenceId) {
        return attachmentRepository.findByReferenceIdAndReferenceType(referenceId, referenceType)
                .stream()
                .map(a -> AttachmentResponse.from(a, "/api/v1/attachments/" + a.getId() + "/download"))
                .toList();
    }

    public Resource download(Long id) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", id));

        InputStream stream = storageService.load(attachment.getStoredFilename());
        return new InputStreamResource(stream);
    }

    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", id));
    }
}
