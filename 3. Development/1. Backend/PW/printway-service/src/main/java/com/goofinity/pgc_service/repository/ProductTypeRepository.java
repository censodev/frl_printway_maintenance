package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.productType.ProductType;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductTypeRepository extends MongoRepository<ProductType, String> {
    Optional<ProductType> findBySku(String sku);

    @Query("{$and: [\n" +
        "        ?#{[0] == null ? {$where: 'true'} : {'category.$id': [0]}},\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'suppliers.$id': [1]}},\n" +
        "        {$or: [\n" +
        "           {'title': {$regex: '.*?2.*', $options : 'i'}},\n" +
        "           {'sku': {$regex: '.*?2.*', $options : 'i'}}\n" +
        "        ]}\n" +
        "    ]}")
    Page<ProductType> findAllWithPagination(ObjectId categoryId,
                                            ObjectId supplierId,
                                            String keyword,
                                            Pageable pageable);

    List<ProductType> findAllByCategoryId(String categoryId);

    @Query("{}")
    List<ProductType> findTopProductType(Pageable pageable);
}
