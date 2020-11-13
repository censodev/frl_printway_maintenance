package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.SellerLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SellerLevelRepository extends MongoRepository<SellerLevel, String> {
    Optional<SellerLevel> findByNameIgnoreCaseOrTotalOrder(String name, int totalOrder);

    Optional<SellerLevel> findByIdNotAndNameIgnoreCaseOrIdNotAndTotalOrder(String id1, String name, String id2, int totalOrder);

    Page<SellerLevel> findAllByNameIgnoreCaseContaining(String name, Pageable pageable);
}
