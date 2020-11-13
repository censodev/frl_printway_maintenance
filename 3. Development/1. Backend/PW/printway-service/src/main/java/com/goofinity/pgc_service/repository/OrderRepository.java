package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.domain.order.Order;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findAllByOrderIdAndSiteOrderByCreatedDateAsc(String orderId, Site site);

    @Query("{$and: [\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'sellerEmail': [1]}},\n" +
        "        ?#{[8] == null ? {$where: 'true'} : {'site.$id': [8]}},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'lineItems': {$elemMatch: {'supplierId': [2]}}}},\n" +
        "        ?#{[6] == null ? {$where: 'true'} : {'lineItems': {$elemMatch: {'productTypeId': [6]}}}},\n" +
        "        ?#{[3] == null ? {$where: 'true'} : {'lineItems': {$elemMatch: {'status': {$in: [3]}}}}},\n" +
        "        {$or: [\n" +
        "           {'lineItems': {$elemMatch: {'name': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'lineItems': {$elemMatch: {'sku': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'lineItems': {$elemMatch: {'productTypeTitle': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'billingAddress.fullName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'sellerEmail': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderNumber': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderId': {$regex: '.*?0.*', $options : 'i'}}\n" +
        "        ]},\n" +
        "        {'lastModifiedDate': {$gte: ?4}},\n" +
        "        {'lastModifiedDate': {$lte: ?5}}\n" +
        "        {'coolingOffExp': {$gte: ?7}}" +
        "    ]}")
    Page<Order> findAllForAdmin(String keyword,
                                String seller,
                                String supplierId,
                                List<String> statuses,
                                Instant startDate,
                                Instant endDate,
                                String productTypeId,
                                Instant coolingOffDate,
                                ObjectId siteId,
                                Pageable pageable);

    @Query("{$and: [\n" +
        "        {'sellerEmail': ?1},\n" +
        "        ?#{[7] == null ? {$where: 'true'} : {'site.$id': [7]}},\n" +
        "        ?#{[5] == null ? {$where: 'true'} : {'lineItems': {$elemMatch: {'productTypeId': [5]}}}},\n" +
        "        ?#{[2] == null ? {$where: 'true'} : {'lineItems': {$elemMatch: {'status': {$in: [2]}}}}},\n" +
        "        {'coolingOffExp': {$gte: ?6}}," +
        "        {$or: [\n" +
        "           {'lineItems': {$elemMatch: {'name': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'lineItems': {$elemMatch: {'sku': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'lineItems': {$elemMatch: {'productTypeTitle': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'billingAddress.firstName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'billingAddress.lastName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'sellerEmail': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderNumber': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderId': {$regex: '.*?0.*', $options : 'i'}}\n" +
        "        ]},\n" +
        "        {'lastModifiedDate': {$gte: ?3}},\n" +
        "        {'lastModifiedDate': {$lte: ?4}}\n" +
        "    ]}")
    Page<Order> findAllForSeller(String keyword,
                                 String seller,
                                 List<String> statuses,
                                 Instant startDate,
                                 Instant endDate,
                                 String productTypeId,
                                 Instant coolingOffDate,
                                 ObjectId siteId,
                                 Pageable pageable);

    @Query("{$and: [\n" +
        "        {'lineItems':  {$elemMatch: {$and: [{'supplierId': ?1}, {'status': {$in: ?5}}]}}},\n" +
        "        ?#{[4] == null ? {$where: 'true'} : {'lineItems': {$elemMatch: {'productTypeId': [4]} }}},\n" +
        "        {$or: [\n" +
        "           {'lineItems': {$elemMatch: {'name': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'lineItems': {$elemMatch: {'sku': {$regex: '.*?0.*', $options : 'i'}} }},\n" +
        "           {'orderName': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderNumber': {$regex: '.*?0.*', $options : 'i'}},\n" +
        "           {'orderId': {$regex: '.*?0.*', $options : 'i'}}\n" +
        "        ]},\n" +
        "        {'createdDate': {$gte: ?2}},\n" +
        "        {'createdDate': {$lte: ?3}}\n" +
        "    ]}")
    Page<Order> findAllBySupplier(String keyword,
                                  String supplierId,
                                  Instant startDate,
                                  Instant endDate,
                                  String productTypeId,
                                  List<String> statuses,
                                  Pageable pageable);

    @Query("{$and: [\n" +
        "        {'lineItems.exportOrderId': ?0},\n" +
        "        {'lineItems.supplierId': ?1},\n" +
        "    ]}")
    List<Order> findOrderForSupplierExport(String exportOrderId,
                                           String supplierId,
                                           Pageable pageable);

    @Query("{$and: [\n" +
        "        {'lineItems': {$elemMatch: {'supplierId': ?0}}},\n" +
        "        {'lineItems': {$elemMatch: {'exportOrderId': {$exists: false}}}},\n" +
        "        {'lineItems': {$elemMatch: {'status': 'PROCESSING'}}}\n" +
        "    ]}")
    List<Order> findAllForSupplierExport(String supplierId, Pageable pageable);

    @Query("{$and: [\n" +
        "        {'id': {$in: ?1}},\n" +
        "        {'lineItems': {$elemMatch: {'supplierId': ?0}}},\n" +
        "        {'lineItems': {$elemMatch: {'exportOrderId': {$exists: false}}}},\n" +
        "        {'lineItems': {$elemMatch: {'status': 'PROCESSING'}}}\n" +
        "    ]}")
    List<Order> findAllByOrderIdForSupplierExport(String supplierId, Set<String> orderId);

    List<Order> findAllByCoolingOffExpBeforeAndLineItems_Status(Instant time, String status, Pageable pageable);

    @Query("{$and: [\n" +
        "        {'lineItems.trackingNumber': ?0},\n" +
        "        {'lineItems.carrierCode': ?1}\n" +
        "    ]}")
    List<Order> findByLineItemTrackingNumber(String trackingNumber, String carrierCode);

    List<Order> findAllByIdIn(Set<String> orderIds);

    List<Order> findAllByIdInAndSellerEmail(Set<String> orderIds, String email);

    List<Order> findAllByIdIn(List<String> orderIds);

    Optional<Order> findByOrderIdAndSite(String orderId, Site site);

    Optional<Order> findByIdAndSellerEmail(String orderId, String sellerEmail);

    List<Order> findAllByLineItems_StatusIn(List<String> statuses, Pageable pageable);

    List<Order> findAllByIdInAndLineItems_SupplierId(Set<String> orderIds, String supplierId);

    @Query("{$and: [\n" +
        "        {'lineItems': {$elemMatch: {$and: [{'productTypeId': ?0}, {'status': {$in: ?3}}]}}},\n" +
        "        {'lineItems.sku': {$regex: '.*?1.*'}},\n" +
        "        {'lineItems.printFileImages': {$elemMatch: {'uniqueKey': ?2}}},\n" +
        "        {'lineItems.printFileImages': {$elemMatch: {'custom': false}}}\n" +
        "    ]}")
    List<Order> findAllForUpdateDesign(String productTypeId,
                                       String productUniqueKey,
                                       String uniqueKey,
                                       List<String> statuses,
                                       Pageable pageable);
}
