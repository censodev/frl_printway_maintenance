package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.ExportOrderHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.Optional;

public interface ExportOrderHistoryRepository extends MongoRepository<ExportOrderHistory, String> {
    @Query("{$and: [\n" +
        "        ?#{[0] == null ? {$where: 'true'} : {'supplierId': [0]}},\n" +
        "        {'createdDate': {$gte: ?1}},\n" +
        "        {'createdDate': {$lte: ?2}}\n" +
        "    ]}")
    Page<ExportOrderHistory> findAllBySupplierIdAndCreatedDate(String supplierId,
                                                               Instant startDate,
                                                               Instant endDate,
                                                               Pageable pageable);

    Optional<ExportOrderHistory> findByIdAndSupplierId(String id, String supplierId);
}
