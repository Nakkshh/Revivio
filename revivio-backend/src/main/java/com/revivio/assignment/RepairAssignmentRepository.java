package com.revivio.assignment;

import com.revivio.repair.RepairRequest;
import com.revivio.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepairAssignmentRepository extends JpaRepository<RepairAssignment, Long> {
    Optional<RepairAssignment> findByRepairRequestAndActiveTrue(RepairRequest repairRequest);
    Page<RepairAssignment> findByTechnicianAndActiveTrue(User technician, Pageable pageable);
    List<RepairAssignment> findByTechnicianAndActiveTrue(User technician);
    long countByTechnicianAndActiveTrue(User technician);
}
