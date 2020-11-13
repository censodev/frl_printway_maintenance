package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.productType.ProductType;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    @Query("{$and: [\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'email': [1]}},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'site.$id': [2]}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'productTypes.productType.$id': [3]}},\n" +
        "        ?#{[4] == null ? {$where: 'true'} : {'productTypes.fullDesign': [4]}},\n" +
        "        {$or: [\n" +
        "           {'productTypes.printFileImages': {$elemMatch: {'sku': {$regex: '.*?0.*'}} }},\n" +
        "           {'title': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "        ]},\n" +
        "        {'lastModifiedDate': {$gte: ?5}},\n" +
        "        {'lastModifiedDate': {$lte: ?6}}\n" +
        "    ]}")
    Page<Product> findAllWithPaging(String keyword,
                                    String seller,
                                    ObjectId siteId,
                                    ObjectId productTypeId,
                                    Boolean isFullDesign,
                                    Instant startDate,
                                    Instant endDate,
                                    Pageable pageable);

    @Query("{$and: [\n" +
        "        {'productTypes.variantDetails.sku': ?0},\n" +
        "        {'productTypes.variantDetails.enable': true}" +
        "    ]}")
    Optional<Product> findBySku(String sku);

    List<Product> findAllByProductTypes_ProductType(ProductType productType, Pageable pageable);

    @Query("{$and: [\n" +
        "        {'productTypes.variantDetails.sku': ?0},\n" +
        "        {'productTypes.variantDetails.enable': true},\n" +
        "        {'activated': true}" +
        "    ]}")
    Optional<Product> findBySkuAndActivated(String sku);

    @Query("{$and: [\n" +
        "        {'email': ?1},\n" +
        "        {'activated': true}," +
        "        {'productTypes.variantDetails.sku': ?0},\n" +
        "        {'productTypes.variantDetails.enable': true}" +
        "    ]}")
    Optional<Product> findBySkuAndEmail(String sku, String email);

    @Query("{$and: [\n" +
        "        {'productTypes.variantDetails.sku': ?0},\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'site.$id': [1]}}" +
        "    ]}")
    Optional<Product> findByItemSkuAndSite(String itemSku, ObjectId siteId);

    Optional<Product> findByIdAndEmail(String id, String email);

    @Query("{$and: [\n" +
        "        {'id': ?0},\n" +
        "        {'productTypes.printFileImages.sku': ?1}" +
        "    ]}")
    Optional<Product> findByIdAndPrintFileSku(ObjectId id, String sku);

    long countAllByProductTypes_ProductTypeId(String id);

    @Query("{}")
    List<Product> findTopProduct(Pageable pageable);

    List<Product> findAllByEmail(String email, Pageable pageable);

    List<Product> findAllByProductIdIn(List<Long> productIds);

    long countAllByProductIdAndSite(long productId, Site site);
}
