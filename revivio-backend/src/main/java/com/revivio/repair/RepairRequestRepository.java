package com.revivio.repair;

import com.revivio.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, Long>, JpaSpecificationExecutor<RepairRequest> {
    Page<RepairRequest> findByCustomer(User customer, Pageable pageable);
    List<RepairRequest> findByCustomerOrderByCreatedAtDesc(User customer);
    Optional<RepairRequest> findByReferenceNumber(String referenceNumber);
    long countByStatus(RepairStatus status);

    @Query("SELECT COUNT(r) FROM RepairRequest r WHERE r.status NOT IN :excludedStatuses")
    long countByStatusNotIn(@Param("excludedStatuses") List<RepairStatus> excludedStatuses);

    boolean existsByCustomerProductIdAndStatusNotIn(Long customerProductId, List<RepairStatus> statuses);

    @Query("SELECT MAX(r.referenceNumber) FROM RepairRequest r WHERE r.referenceNumber LIKE :prefix%")
    String findMaxReferenceNumberForYear(@Param("prefix") String prefix);
}
