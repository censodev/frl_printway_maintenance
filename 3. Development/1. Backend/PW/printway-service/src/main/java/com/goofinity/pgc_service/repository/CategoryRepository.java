package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findByNameIgnoreCase(String title);

    Optional<Category> findByIdNotAndNameIgnoreCase(String id, String title);

    Page<Category> findAllByNameIgnoreCaseContaining(String keyword, Pageable pageable);
}
