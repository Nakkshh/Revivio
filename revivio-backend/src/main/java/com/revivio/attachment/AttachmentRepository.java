package com.revivio.attachment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByReferenceIdAndReferenceType(Long referenceId, String referenceType);
    List<Attachment> findAllByReferenceIdAndReferenceType(Long referenceId, String referenceType);
}
