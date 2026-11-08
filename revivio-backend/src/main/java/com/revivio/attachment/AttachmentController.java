package com.revivio.attachment;

import com.revivio.common.ApiResponse;
import com.revivio.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AttachmentResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") AttachmentCategory category,
            @RequestParam(value = "referenceId", required = false) Long referenceId,
            @RequestParam(value = "referenceType", required = false) String referenceType,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        AttachmentResponse response = attachmentService.upload(file, category, referenceId, referenceType, userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("File uploaded successfully", response));
    }

    @GetMapping("/reference/{referenceType}/{referenceId}")
    public ResponseEntity<ApiResponse<List<AttachmentResponse>>> getByReference(
            @PathVariable String referenceType,
            @PathVariable Long referenceId
    ) {
        return ResponseEntity.ok(ApiResponse.success(attachmentService.getByReference(referenceType, referenceId)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Attachment attachment = attachmentService.getAttachment(id);
        Resource resource = attachmentService.download(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + attachment.getOriginalFilename() + "\"")
                .body(resource);
    }
}
