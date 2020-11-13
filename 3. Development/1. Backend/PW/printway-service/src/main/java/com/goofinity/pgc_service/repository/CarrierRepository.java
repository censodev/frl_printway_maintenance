package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.Carrier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CarrierRepository extends MongoRepository<Carrier, String> {
    List<Carrier> findAllByActiveIsTrue();

    List<Carrier> findAllByActiveIsTrue(Pageable pageable);

    Optional<Carrier> findByNameIgnoreCaseOrCodeIgnoreCase(String name, String code);

    Optional<Carrier> findByIdNotAndNameIgnoreCaseOrIdNotAndCodeIgnoreCase(String id, String name, String id2, String code);

    Page<Carrier> findAllByNameIgnoreCaseContainingOrCodeIgnoreCaseContaining(String keyword1, String keyword2, Pageable pageable);
}
