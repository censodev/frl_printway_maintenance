package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.UserBalance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserBalanceRepository extends MongoRepository<UserBalance, String> {
    Optional<UserBalance> findByEmailIgnoreCase(String email);

    Optional<UserBalance> findByIdOrEmailIgnoreCase(String id, String email);

    Page<UserBalance> findAllByEmailContaining(String email, Pageable pageable);

    List<UserBalance> findAllByEmailIn(List<String> emails);
}
