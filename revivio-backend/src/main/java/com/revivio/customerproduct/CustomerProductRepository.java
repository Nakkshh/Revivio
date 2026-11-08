package com.revivio.customerproduct;

import com.revivio.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerProductRepository extends JpaRepository<CustomerProduct, Long> {

    boolean existsBySerialNumber(String serialNumber);

    Page<CustomerProduct> findByCustomer(User customer, Pageable pageable);

    List<CustomerProduct> findByCustomer(User customer);

    Optional<CustomerProduct> findByIdAndCustomer(Long id, User customer);
}
