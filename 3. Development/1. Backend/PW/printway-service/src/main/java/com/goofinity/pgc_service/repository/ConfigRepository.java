package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.Config;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConfigRepository extends MongoRepository<Config, String> {
    Optional<Config> findByKey(String key);

    List<Config> findAllByKeyIn(List<String> keys);
}
