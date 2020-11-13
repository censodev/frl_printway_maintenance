package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.ImageUpload;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;

public interface ImageUploadRepository extends MongoRepository<ImageUpload, String> {
    List<ImageUpload> findAllByIdIn(Set<String> ids);
}
