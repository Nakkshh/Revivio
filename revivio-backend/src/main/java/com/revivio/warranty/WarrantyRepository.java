package com.revivio.warranty;

import com.revivio.customerproduct.CustomerProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {

    Optional<Warranty> findByCustomerProduct(CustomerProduct customerProduct);

    boolean existsByCustomerProduct(CustomerProduct customerProduct);
}
