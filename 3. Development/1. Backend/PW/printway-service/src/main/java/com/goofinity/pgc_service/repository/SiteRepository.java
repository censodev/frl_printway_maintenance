package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SiteRepository extends MongoRepository<Site, String> {
    List<Site> findAllByActiveIsTrueAndSiteTypeNotContaining(String excludeSiteType, Pageable pageable);

    Optional<Site> findBySiteTypeAndUrl(String siteType, String url);

    Optional<Site> findBySiteTypeAndShopUrlContainingAndDeletedIsFalseAndActiveIsTrue(String siteType, String url);

    Optional<Site> findBySiteTypeAndUrlContainingAndDeletedIsFalseAndActiveIsTrue(String siteType, String url);

    long countAllBySiteTypeAndUrlContainingAndDeletedIsFalse(String siteType, String url);

    long countAllBySiteTypeAndShopUrlContainingAndDeletedIsFalse(String siteType, String shopUrl);

    Optional<Site> findByIdAndEmailIgnoreCase(String id, String email);

    Optional<Site> findByUrl(String url);

    @Query("{$and: [\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'email': [1]}},\n" +
        "        ?#{[4] == null ? {$where: 'true'} : {'active': [4]}},\n" +
        "        ?#{[5] == null ? {$where: 'true'} : {'deleted': [5]}},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'connectDate': {$gte: [2]}}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'connectDate': {$lte: [3]}}},\n" +
        "        {'title': {$regex: '.*?0.*', '$options' : 'i'}}\n" +
        "    ]}")
    Page<Site> findAllForAdmin(String keyword, String email, Instant startDate, Instant endDate, Boolean isActive, Boolean isRemove, Pageable pageable);

    @Query("{$and: [\n" +
        "        ?#{[0] == null ? {$where: 'true'} : {'email': [0]}},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'active': [2]}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'deleted': [3]}},\n" +
        "        {'title': {$regex: '.*?1.*', '$options' : 'i'}},\n" +
        "        {'deleted': false}\n" +
        "    ]}")
    Page<Site> findAllForSeller(String email, String keyword, Boolean isActive, Boolean isRemove, Pageable pageable);

    List<Site> findAllByEmail(String email);

    long countAllByEmailAndVirtualIsTrue(String email);
}
