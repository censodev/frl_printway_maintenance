package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.TransactionHistory;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TransactionHistoryRepository extends MongoRepository<TransactionHistory, String> {
    Optional<TransactionHistory> findByIdAndEmailIgnoreCase(String id, String email);

    Optional<TransactionHistory> findByTransactionIdAndIdNot(String transactionId, String id);

    Optional<TransactionHistory> findByTransactionId(String transactionId);

    Optional<TransactionHistory> findByIdAndStatusAndType(String id, String status, String type);

    Optional<TransactionHistory> findByOrderIdAndItemSkuAndType(String orderId, String sku, String type);

    List<TransactionHistory> findAllByTypeAndStatus(String type, String status);

    Optional<TransactionHistory> findByOrderIdAndItemSkuAndTypeAndStatus(String orderId, String itemSku, String type, String status);

    @Query("{$and: [\n" +
        "        {'email': ?0},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'type': {$in: [2]}}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'status': [3]}},\n" +
        "        {'createdDate': {$gte: ?4}},\n" +
        "        {'createdDate': {$lte: ?5}},\n" +
        "        {$or: [\n" +
        "           {'createdByFullName': {$regex: '.*?1.*', $options : 'i'}},\n" +
        "           {'transactionId': {$regex: '.*?1.*', $options : 'i'}},\n" +
        "           {'id': {$regex: '.*?1.*'}}\n" +
        "        ]}\n" +
        "    ]}")
    Page<TransactionHistory> findTransactionHistoryForUser(String email,
                                                           String keyword,
                                                           List<String> types,
                                                           String status,
                                                           Instant startDate,
                                                           Instant endDate,
                                                           Pageable pageable);

    @Query("{$and: [\n" +
        "        ?#{[4] == null ? {$where: 'true'} : {'email': [4]}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'site.$id': [3]}},\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'type': {$in: [1]}}},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'status': [2]}},\n" +
        "        {$or: [\n" +
        "           {'createdByFullName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'transactionId': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'id': {$regex: '.*?0.*'}}\n" +
        "        ]},\n" +
        "        {'lastChangeStatusDate': {$gte: ?5}},\n" +
        "        {'lastChangeStatusDate': {$lte: ?6}},\n" +
        "        {'type': {$ne: 'PAID_SUPPLIER'}}\n" +
        "        {'type': {$ne: 'DEPOSIT_SUPPLIER'}}\n" +
        "    ]}")
    Page<TransactionHistory> findAllForAdmin(String keyword,
                                             List<String> types,
                                             String status,
                                             ObjectId siteId,
                                             String email,
                                             Instant startDate,
                                             Instant endDate,
                                             Pageable pageable);

    @Query("{$and: [\n" +
        "        ?#{[0] == null ? {$where: 'true'} : {'email': [0]}},\n" +
        "        {'type': {$in: ?2}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'status': [3]}},\n" +
        "        {'createdDate': {$gte: ?4}},\n" +
        "        {'createdDate': {$lte: ?5}},\n" +
        "        {$or: [\n" +
        "           {'createdByFullName': {$regex: '.*?1.*', $options : 'i'}},\n" +
        "           {'id': {$regex: '.*?1.*'}}\n" +
        "        ]}\n" +
        "    ]}")
    Page<TransactionHistory> findTransactionHistoryForSupplier(String email,
                                                               String keyword,
                                                               List<String> types,
                                                               String status,
                                                               Instant startDate,
                                                               Instant endDate,
                                                               Pageable pageable);

    List<TransactionHistory> findAllByEmailIgnoreCaseAndStatus(String email, String status);

    List<TransactionHistory> findAllByEmailIgnoreCaseAndStatusAndType(String email, String status, String type);
}
