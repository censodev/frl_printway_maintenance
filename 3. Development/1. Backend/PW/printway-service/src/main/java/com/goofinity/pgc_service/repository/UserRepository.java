package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.User;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByIdOrEmailIgnoreCase(String id, String email);

    Optional<User> findByIdAndRolesContains(String email, String role);

    Optional<User> findByIdAndRolesContainsAndActivatedTrue(String email, String role);

    List<User> findAllByActivatedTrueAndRolesContains(String role);

    List<User> findAllByActivatedTrueAndRolesContains(String role, Pageable pageable);

    @Query("{$and: [" +
        "        {'activated': true}," +
        "        {'roles': {$elemMatch: {$in: ?0}}}" +
        "    ]}")
    List<User> findAllByListRoles(Set<String> roles, Pageable pageable);

    @Query("{$and: [" +
        "        ?#{[0] == null ? {$where: 'true'} : {'activated': [0]}}," +
        "        ?#{[1] == null ? {$where: 'true'} :  {'sellerLevel.$id': {$in: [1]}}}," +
        "        ?#{[2] == null ? {$where: 'true'} :  {'roles': {$elemMatch: {$in: [2]}}}}," +
        "        {'saleAmount': {$gt: ?3, $lt: ?4}}," +
        "        {'saleAmount': {$gt: ?5, $lt: ?6}}," +
        "        {$or: [" +
        "           {'email': {$regex: '.*?7.*', $options : 'i'}}," +
        "           {$expr: {$regexFind: {input: {$concat: ['$firstName', ' ', '$lastName']}, regex: '.*?7.*', options: 'i'}}}," +
        "           {'phone': {$regex: '.*?7.*', $options : 'i'}}" +
        "        ]}" +
        "    ]}")
    Page<User> findAllByFilter(Boolean activated,
                               List<ObjectId> sellerLevelIds,
                               List<String> roles,
                               int fromSaleAmount,
                               int toSaleAmount,
                               int fromNextLevelSaleAmount,
                               int toNextLevelSaleAmount,
                               String keyword,
                               Pageable pageable);
}
