package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;

public interface NewsRepository extends MongoRepository<News, String> {
    Page<News> findAllByRolesContainsAndTypeAndCreatedDateAfter(List<String> roles, String type, Instant startDate, Pageable pageable);

    @Query("{$and: [\n" +
        "        {'roles': {$elemMatch: {$in: ?0}}},\n" +
        "        {'createdDate': {$gte: ?2}},\n" +
        "        {'createdDate': {$lte: ?3}},\n" +
        "        {'title': {$regex: '.*?1.*', '$options' : 'i'}}\n" +
        "    ]}")
    Page<News> findAllByForUser(List<String> roles,
                                String keyword,
                                Instant startDate,
                                Instant endDate,
                                Pageable pageable);

    Page<News> findAllByTitleIgnoreCaseContaining(String keyword, Pageable pageable);

    List<News> findAllByRolesContainsAndType(List<String> roles, String type);

    List<News> findAllByRolesContainsAndTypeAndCreatedDateAfter(List<String> roles, String type, Instant startDate);
}
