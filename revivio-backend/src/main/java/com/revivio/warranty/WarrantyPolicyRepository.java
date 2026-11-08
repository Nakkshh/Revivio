package com.revivio.warranty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarrantyPolicyRepository extends JpaRepository<WarrantyPolicy, Long> {

    List<WarrantyPolicy> findByActiveTrue();
}
