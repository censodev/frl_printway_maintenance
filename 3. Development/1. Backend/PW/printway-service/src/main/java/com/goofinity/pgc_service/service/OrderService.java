package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.*;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypeCarrier;
import com.goofinity.pgc_service.domain.productType.ProductTypeVariantDetail;
import com.goofinity.pgc_service.dto.*;
import com.goofinity.pgc_service.dto.shopify.ShopifyItem;
import com.goofinity.pgc_service.dto.shopify.ShopifyOrder;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceDTO;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceOrderDTO;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreDTO;
import com.goofinity.pgc_service.dto.woo.WooAddress;
import com.goofinity.pgc_service.dto.woo.WooLine;
import com.goofinity.pgc_service.dto.woo.WooOrder;
import com.goofinity.pgc_service.enums.*;
import com.goofinity.pgc_service.event.balance.BalanceTrackingBinding;
import com.goofinity.pgc_service.event.supplierBalance.SupplierBalanceBinding;
import com.goofinity.pgc_service.event.syncTracking.SyncTrackingBinding;
import com.goofinity.pgc_service.event.trackingMore.TrackingMoreBinding;
import com.goofinity.pgc_service.repository.*;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.security.error.ValidatorException;
import com.neovisionaries.i18n.CountryCode;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.Stream;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@EnableBinding({BalanceTrackingBinding.class, TrackingMoreBinding.class, SupplierBalanceBinding.class, SyncTrackingBinding.class})
@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final int PAGE_SIZE = 200;
    private final ObjectMapper objectMapper = getObjectMapper();
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ImageUploadRepository imageUploadRepository;
    private final SiteRepository siteRepository;
    private final ProductService productService;
    private final DailyStatisticService dailyStatisticService;
    private final LineItemStatisticService lineItemStatisticService;
    private final ProductStatisticService productStatisticService;
    private final AmazonSESService amazonSESService;
    private final MessageChannel balanceMessageChannel;
    private final MessageChannel trackingMoreMessageChannel;
    private final MessageChannel supplierBalanceMessageChannel;
    private final MessageChannel shopifySyncTrackingMessageChannel;
    private final MongoTemplate mongoTemplate;

    public OrderService(final OrderRepository orderRepository,
                        final ProductRepository productRepository,
                        final UserRepository userRepository,
                        final ImageUploadRepository imageUploadRepository,
                        final SiteRepository siteRepository,
                        final ProductService productService,
                        final DailyStatisticService dailyStatisticService,
                        final LineItemStatisticService lineItemStatisticService,
                        final ProductStatisticService productStatisticService,
                        final AmazonSESService amazonSESService,
                        final BalanceTrackingBinding balanceTrackingBinding,
                        final TrackingMoreBinding trackingMoreBinding,
                        final SupplierBalanceBinding supplierBalanceBinding,
                        final SyncTrackingBinding syncTrackingBinding,
                        final MongoTemplate mongoTemplate) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.imageUploadRepository = imageUploadRepository;
        this.siteRepository = siteRepository;
        this.productService = productService;
        this.dailyStatisticService = dailyStatisticService;
        this.lineItemStatisticService = lineItemStatisticService;
        this.productStatisticService = productStatisticService;
        this.amazonSESService = amazonSESService;
        this.balanceMessageChannel = balanceTrackingBinding.publisher();
        this.trackingMoreMessageChannel = trackingMoreBinding.publisher();
        this.supplierBalanceMessageChannel = supplierBalanceBinding.publisher();
        this.shopifySyncTrackingMessageChannel = syncTrackingBinding.publisher();
        this.mongoTemplate = mongoTemplate;
    }

    public void saveOrderShopify(ShopifyOrder dto,
                                 Site site) throws JsonProcessingException {
        //Check site deleted or inactive
        if (site.isDeleted() || !site.isActive()) {
            return;
        }

        //Check order exist
        if (!orderRepository.findAllByOrderIdAndSiteOrderByCreatedDateAsc(dto.getId(), site).isEmpty()) {
            return;
        }

        User user = userRepository.findByEmailIgnoreCase(site.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("user"));

        if (!user.isActivated()) {
            return;
        }

        Order order = new Order();
        order.setOrderName(site.getNumber() + "-" + dto.getOrderNumber());
        order.setOrderId(dto.getId());
        order.setOrderNumber(dto.getOrderNumber().toString());
        order.setSource(OrderSourceEnum.SITE.name());
        order.setSiteType(site.getSiteType());
        order.setSite(site);
        order.setSellerEmail(site.getEmail());
        order.setSeller(user);
        order.setCurrency(dto.getCurrency());
        order.setCoolingOff(site.getOrderHoldingHour() > 0);
        order.setCoolingOffExp(Instant.now().plus(site.getOrderHoldingHour(), ChronoUnit.HOURS));
        order.addOrderLog(null, OrderLogTypeEnum.ORDER_CREATED.name(), null);
        order.addOrderLog(null, OrderLogTypeEnum.COOLING_OFF.name(), Instant.now().plus(site.getOrderHoldingHour(), ChronoUnit.HOURS).toString());
        order.setDiscount(user.getSellerLevel() != null ? user.getSellerLevel().getDiscountInUsd() : 0);
        List<LineItem> lineItems = new ArrayList<>();
        Set<String> productIds = new HashSet<>();
        Set<String> productTypeIds = new HashSet<>();
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        for (ShopifyItem shopifyItem : dto.getLineItems()) {
            // Check sku exist to save line item
            productRepository.findBySkuAndActivated(shopifyItem.getSku()).ifPresent(product -> {
                if (product.isActivated()) {
                    ProductType productType = productService.getProductTypeBySku(product, shopifyItem.getSku())
                        .orElseThrow(() -> new ObjectNotFoundException("product_type"));
                    ProductVariantDetail productVariantDetail = productService.getProductVariantDetailBySku(product, shopifyItem.getSku())
                        .orElseThrow(() -> new ObjectNotFoundException("product_variant_detail"));
                    if (productVariantDetail.isEnable()) {
                        List<ProductPrintFileDetail> printFileImages = productService.getProductPrintFile(product, productType.getId());
                        printFileImages.forEach(productPrintFileDetail -> {
                            if (productPrintFileDetail.isCustom()) {
                                productPrintFileDetail.setImage(null);
                            }
                        });

                        int numberDesignMissing = productService.getNumberDesignMissing(shopifyItem.getSku(), product);
                        boolean isValidShippingCountry = isValidShippingCountry(dto.getShippingAddress() == null
                            ? "" : dto.getShippingAddress().getCountry(), productType.getCountries(), productType.isInclude());
                        LineItem lineItem = LineItem.builder()
                            .id(shopifyItem.getId())
                            .productId(shopifyItem.getProductId())
                            .variantId(shopifyItem.getVariantId())
                            .name(shopifyItem.getName())
                            .sku(shopifyItem.getSku())
                            .baseSku(productVariantDetail.getBaseSku())
                            .price(shopifyItem.getPrice())
                            .quantity(shopifyItem.getQuantity())
                            .lastStatusDate(Instant.now())
                            .productTypeId(productType.getId())
                            .productTypeTitle(productType.getTitle())
                            .imageId(productVariantDetail.getImageId())
                            .printFileImages(printFileImages)
                            .numberDesignMissing(numberDesignMissing)
                            .lastSentNotification(Instant.now())
                            .lastSentSpreadHour(0)
                            .build();
                        setCostForLineItem(lineItem, productType);

                        //Set status for line item
                        String status = getLineItemStatus(numberDesignMissing, StringUtils.isEmpty(lineItem.getSupplierId()));
                        lineItem.setStatus(isValidShippingCountry ? status : ProduceStatusEnum.ACTION_REQUIRED.name());
                        lineItem.setPreStatus(isValidShippingCountry ? null : status);
                        lineItem.setStatusNote(isValidShippingCountry ? null : OrderLogTypeEnum.INVALID_SHIPPING_COUNTRY.name());
                        //End

                        lineItems.add(lineItem);
                        addLogForLineItem(status, isValidShippingCountry, shopifyItem.getSku(), order);

                        //Add set id
                        productIds.add(product.getId());
                        productTypeIds.add(productType.getId());

                        // Request update statistic for line item status
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.ALL.name(), null);
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), null);

                        if (order.getCoolingOffExp().isAfter(Instant.now())) {
                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                ProduceStatusEnum.COOLING_OFF.name(), null);
                        }

                        if (isValidShippingCountry) {
                            amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                        }
                    }
                }
            });
        }

        if (lineItems.isEmpty()) {
            return;
        }

        productStatistic(true, productTypeIds);
        productStatistic(false, productIds);

        order.setTotal(lineItems.stream()
            .flatMapToDouble(lineItem -> DoubleStream.of(lineItem.getQuantity() * (NumberUtils.toDouble(lineItem.getPrice(), 0) - order.getDiscount() + lineItem.getCarrierCost())))
            .sum());

        order.setTotalBaseCost(lineItems.stream()
            .flatMapToDouble(lineItem -> DoubleStream.of(lineItem.getQuantity() * (lineItem.getBaseCost() - order.getDiscount() + lineItem.getCarrierCost())))
            .sum());

        order.setLineItems(lineItems);
        if (dto.getBillingAddress() != null) {
            order.setBillingAddress(Address.builder()
                .firstName(dto.getBillingAddress().getFirstName())
                .lastName(dto.getBillingAddress().getLastName())
                .fullName(dto.getBillingAddress().getFirstName() + " " + dto.getBillingAddress().getLastName())
                .company(dto.getBillingAddress().getCompany())
                .address1(dto.getBillingAddress().getAddress1())
                .address2(dto.getBillingAddress().getAddress2())
                .city(dto.getBillingAddress().getCity())
                .province(dto.getBillingAddress().getProvince())
                .country(dto.getBillingAddress().getCountry())
                .postcode(dto.getBillingAddress().getZip())
                .phone(dto.getBillingAddress().getPhone())
                .email(dto.getCustomer() != null ? dto.getCustomer().getEmail() : "")
                .build());
        }
        if (dto.getShippingAddress() != null) {
            order.setShippingAddress(Address.builder()
                .firstName(dto.getShippingAddress().getFirstName())
                .lastName(dto.getShippingAddress().getLastName())
                .fullName(dto.getShippingAddress().getFirstName() + " " + dto.getShippingAddress().getLastName())
                .company(dto.getShippingAddress().getCompany())
                .address1(dto.getShippingAddress().getAddress1())
                .address2(dto.getShippingAddress().getAddress2())
                .city(dto.getShippingAddress().getCity())
                .province(dto.getShippingAddress().getProvince())
                .provinceCode(dto.getShippingAddress().getProvinceCode())
                .country(dto.getShippingAddress().getCountry())
                .countryCode(dto.getShippingAddress().getCountryCode())
                .postcode(dto.getShippingAddress().getZip())
                .phone(dto.getShippingAddress().getPhone())
                .email(dto.getCustomer() != null ? dto.getCustomer().getEmail() : "")
                .build());
        }
        orderRepository.save(order);

        //Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

        if (order.getCoolingOffExp().isBefore(Instant.now())) {
            paidForOrder(order);
        }

        sendOrderStatistic(site);

        amazonSESService.sendEmailAfterNewOrderForSeller(order);
    }

    public void saveOrderWoo(WooOrder dto,
                             Site site) throws JsonProcessingException {
        //Check site deleted or inactive
        if (site.isDeleted() || !site.isActive()) {
            return;
        }

        //Check order exist
        if (!orderRepository.findAllByOrderIdAndSiteOrderByCreatedDateAsc(dto.getId(), site).isEmpty()) {
            return;
        }
        User user = userRepository.findByEmailIgnoreCase(site.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("user"));

        if (!user.isActivated()) {
            return;
        }

        Order order = new Order();
        order.setOrderId(dto.getId());
        order.setOrderName(site.getNumber() + "-" + dto.getNumber());
        order.setOrderNumber(dto.getNumber());
        order.setSource(OrderSourceEnum.SITE.name());
        order.setSiteType(site.getSiteType());
        order.setSite(site);
        order.setSellerEmail(site.getEmail());
        order.setSeller(user);
        order.setCurrency(dto.getCurrency());
        order.setCoolingOff(site.getOrderHoldingHour() > 0);
        order.setCoolingOffExp(Instant.now().plus(site.getOrderHoldingHour(), ChronoUnit.HOURS));
        order.addOrderLog(null, OrderLogTypeEnum.ORDER_CREATED.name(), null);
        order.addOrderLog(null, OrderLogTypeEnum.COOLING_OFF.name(), Instant.now().plus(site.getOrderHoldingHour(), ChronoUnit.HOURS).toString());
        order.setDiscount(user.getSellerLevel() != null ? user.getSellerLevel().getDiscountInUsd() : 0);
        List<LineItem> lineItems = new ArrayList<>();
        Set<String> productIds = new HashSet<>();
        Set<String> productTypeIds = new HashSet<>();
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        for (WooLine wooItem : dto.getLineItems()) {
            // Check sku exist to save line item
            productRepository.findBySkuAndActivated(wooItem.getSku()).ifPresent(product -> {
                if (product.isActivated()) {
                    ProductType productType = productService.getProductTypeBySku(product, wooItem.getSku())
                        .orElseThrow(() -> new ObjectNotFoundException("product_type"));
                    ProductVariantDetail productVariantDetail = productService.getProductVariantDetailBySku(product, wooItem.getSku())
                        .orElseThrow(() -> new ObjectNotFoundException("product_variant_detail"));

                    if (productVariantDetail.isEnable()) {
                        List<ProductPrintFileDetail> printFileImages = productService.getProductPrintFile(product, productType.getId());
                        int numberDesignMissing = productService.getNumberDesignMissing(wooItem.getSku(), product);
                        boolean isValidShippingCountry = isValidShippingCountry(getCountryByCode(dto.getShipping() == null ? "" : dto.getShipping().getCountry()),
                            productType.getCountries(), productType.isInclude());
                        LineItem lineItem = LineItem.builder()
                            .id(wooItem.getId())
                            .productId(wooItem.getProductId())
                            .variantId(wooItem.getVariationId())
                            .name(wooItem.getName())
                            .sku(wooItem.getSku())
                            .baseSku(productVariantDetail.getBaseSku())
                            .price(wooItem.getPrice())
                            .quantity(wooItem.getQuantity())
                            .lastStatusDate(Instant.now())
                            .productTypeId(productType.getId())
                            .productTypeTitle(productType.getTitle())
                            .imageId(productVariantDetail.getImageId())
                            .printFileImages(printFileImages)
                            .numberDesignMissing(numberDesignMissing)
                            .lastSentNotification(Instant.now())
                            .lastSentSpreadHour(0)
                            .build();
                        setCostForLineItem(lineItem, productType);

                        //Set status for line item
                        String status = getLineItemStatus(numberDesignMissing, StringUtils.isEmpty(lineItem.getSupplierId()));
                        lineItem.setStatus(isValidShippingCountry ? status : ProduceStatusEnum.ACTION_REQUIRED.name());
                        lineItem.setPreStatus(isValidShippingCountry ? null : status);
                        lineItem.setStatusNote(isValidShippingCountry ? null : OrderLogTypeEnum.INVALID_SHIPPING_COUNTRY.name());
                        //End

                        lineItems.add(lineItem);
                        addLogForLineItem(status, isValidShippingCountry, wooItem.getSku(), order);

                        //Add set id
                        productIds.add(product.getId());
                        productTypeIds.add(productType.getId());

                        // Request update statistic for line item status
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.ALL.name(), null);
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), null);

                        if (order.getCoolingOffExp().isAfter(Instant.now())) {
                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                ProduceStatusEnum.COOLING_OFF.name(), null);
                        }

                        if (isValidShippingCountry) {
                            amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                        }
                    }
                }
            });
        }

        if (lineItems.isEmpty()) {
            return;
        }

        productStatistic(true, productTypeIds);
        productStatistic(false, productIds);

        order.setTotal(lineItems.stream()
            .flatMapToDouble(lineItem -> DoubleStream.of(lineItem.getQuantity() * (NumberUtils.toDouble(lineItem.getPrice(), 0) - order.getDiscount() + lineItem.getCarrierCost())))
            .sum());

        order.setTotalBaseCost(lineItems.stream()
            .flatMapToDouble(lineItem -> DoubleStream.of(lineItem.getQuantity() * (lineItem.getBaseCost() - order.getDiscount() + lineItem.getCarrierCost())))
            .sum());

        order.setLineItems(lineItems);
        if (dto.getBilling() != null) {
            order.setBillingAddress(Address.builder()
                .firstName(dto.getBilling().getFirstName())
                .lastName(dto.getBilling().getLastName())
                .fullName(dto.getBilling().getFirstName() + " " + dto.getBilling().getLastName())
                .company(dto.getBilling().getCompany())
                .address1(dto.getBilling().getAddress1())
                .address2(dto.getBilling().getAddress2())
                .city(dto.getBilling().getCity())
                .province(getWooProvince(dto.getBilling()))
                .country(getCountryByCode(dto.getBilling().getCountry()))
                .postcode(dto.getBilling().getPostcode())
                .phone(dto.getBilling().getPhone())
                .email(dto.getBilling().getEmail())
                .build());
        }
        if (dto.getShipping() != null) {
            order.setShippingAddress(Address.builder()
                .firstName(dto.getShipping().getFirstName())
                .lastName(dto.getShipping().getLastName())
                .fullName(dto.getShipping().getFirstName() + " " + dto.getShipping().getLastName())
                .company(dto.getShipping().getCompany())
                .address1(dto.getShipping().getAddress1())
                .address2(dto.getShipping().getAddress2())
                .city(dto.getShipping().getCity())
                .province(getWooProvince(dto.getShipping()))
                .provinceCode(dto.getShipping().getState())
                .country(getCountryByCode(dto.getShipping().getCountry()))
                .countryCode(dto.getShipping().getCountry())
                .postcode(dto.getShipping().getPostcode())
                .phone(dto.getShipping().getPhone())
                .email(dto.getShipping().getEmail())
                .build());
        }
        orderRepository.save(order);

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

        if (order.getCoolingOffExp().isBefore(Instant.now())) {
            paidForOrder(order);
        }

        sendOrderStatistic(site);

        amazonSESService.sendEmailAfterNewOrderForSeller(order);
    }

    public String getLineItemStatus(int numberDesignMissing, boolean chooseSupplier) {
        if (numberDesignMissing > 0) {
            return ProduceStatusEnum.PENDING_DESIGN.name();
        }

        if (chooseSupplier) {
            return ProduceStatusEnum.CHOOSE_SUPPLIER.name();
        }

        return ProduceStatusEnum.NEED_PAY.name();
    }

    public void addLogForLineItem(String status, boolean isValidShippingCountry, String sku, Order order) {
        String orderLogType = null;
        if (!isValidShippingCountry) {
            orderLogType = OrderLogTypeEnum.INVALID_SHIPPING_COUNTRY.name();
        } else {
            switch (ProduceStatusEnum.valueOf(status)) {
                case PENDING_DESIGN:
                    orderLogType = OrderLogTypeEnum.PENDING_DESIGN.name();
                    break;
                case NEED_PAY:
                    orderLogType = OrderLogTypeEnum.NEED_PAY_COOLING_OFF.name();
                    break;
                case CHOOSE_SUPPLIER:
                    orderLogType = OrderLogTypeEnum.CHOOSE_SUPPLIER.name();
                    break;
            }
        }
        order.addOrderLog(sku, orderLogType, null);
    }

    public boolean isValidShippingCountry(String country, List<String> countries, boolean isInclude) {
        return isInclude
            ? countries.stream().anyMatch(s -> s.equalsIgnoreCase(getCountryName(country)))
            : countries.stream().noneMatch(s -> s.equalsIgnoreCase(getCountryName(country)));
    }

    private String getCountryName(String country) {
        CountryCode countryName = CountryCode.getByCode(country, false);
        return countryName == null ? country : countryName.getName();
    }

    public void updateMissingDesign(User user, MissingDesignDTO dto) {
        Order existOrder = (user.getRoles().contains(RoleEnum.ROLE_ADMIN.name())
            ? orderRepository.findById(dto.getOrderId())
            : orderRepository.findByIdAndSellerEmail(dto.getOrderId(), user.getEmail())).orElseThrow(() -> new ObjectNotFoundException("order"));
        Site site = siteRepository.findById(existOrder.getSite().getId())
            .orElseThrow(() -> new ObjectNotFoundException("site"));

        LineItem existLineItem = existOrder.getLineItems().stream()
            .filter(lineItem -> lineItem.getSku().equals(dto.getLineItemSku())).findFirst()
            .orElseThrow(() -> new ObjectNotFoundException("line_item"));

        Product existProduct = productRepository.findByItemSkuAndSite(existLineItem.getSku(), site.isVirtual() ? null : new ObjectId(site.getId()))
            .orElseThrow(() -> new ObjectNotFoundException("product"));

        // Update missing design for Order
        List<ProductPrintFileDetail> imagesForProduct = new ArrayList<>();
        for (DesignUpdate designUpdate : dto.getDesignUpdates()) {
            if (!StringUtils.isEmpty(designUpdate.getImageId())) {
                ImageUpload imageUpload = imageUploadRepository.findById(designUpdate.getImageId())
                    .orElseThrow(() -> new ObjectNotFoundException("image_upload"));
                if (!designUpdate.isCustom()) {
                    int page = 0;
                    while (true) {
                        List<Order> orders = orderRepository.findAllForUpdateDesign(dto.getProductTypeId(), existProduct.getUniqueKey(),
                            designUpdate.getUniqueKey(), ProduceStatusEnum.getUpdateDesignStatuses(), PageRequest.of(page++, PAGE_SIZE));

                        if (orders.isEmpty()) {
                            break;
                        }

                        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
                        for (Order order : orders) {
                            order.getLineItems().forEach(lineItem -> {
                                if (dto.getProductTypeId().equals(lineItem.getProductTypeId())
                                    && lineItem.getSku().contains(existProduct.getUniqueKey())
                                    && ProduceStatusEnum.getUpdateDesignStatuses().contains(lineItem.getStatus())) {
                                    lineItem.getPrintFileImages()
                                        .stream()
                                        .filter(printFileImage -> printFileImage.getUniqueKey().equals(designUpdate.getUniqueKey()))
                                        .findFirst()
                                        .ifPresent(file -> {
                                            file.setImage(imageUpload);
                                        });

                                    updateDesignStatistic(user, statisticDTOList, order, lineItem, imageUpload.getThumbUrl());
                                }
                            });
                        }
                        orderRepository.saveAll(orders);

                        // Update statistic
                        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

                        checkCoolingOffToPay(orders);
                    }

                    imagesForProduct.add(ProductPrintFileDetail.builder()
                        .uniqueKey(designUpdate.getUniqueKey())
                        .image(imageUpload)
                        .build());
                } else {
                    List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
                    List<ProductPrintFileDetail> printFileDetails = existLineItem.getPrintFileImages();
                    printFileDetails
                        .stream()
                        .filter(design -> design.getUniqueKey().equals(designUpdate.getUniqueKey()))
                        .findFirst()
                        .ifPresent(design -> {
                            if (design.isCustom()) {
                                design.setImage(imageUpload);

                                updateDesignStatistic(user, statisticDTOList, existOrder, existLineItem, imageUpload.getThumbUrl());

                                orderRepository.save(existOrder);

                                // Update statistic
                                statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

                                checkCoolingOffToPay(Collections.singletonList(existOrder));
                            }
                        });
                }
            }

        }

        // Update missing design for Product (only for not custom)
        if (!imagesForProduct.isEmpty()) {
            existProduct.getProductTypes()
                .stream()
                .filter(item -> item.getProductType().getId().equals(existLineItem.getProductTypeId()))
                .findFirst()
                .ifPresent(productType -> {
                    for (ProductPrintFileDetail image : imagesForProduct) {
                        for (ProductPrintFileDetail productImage : productType.getPrintFileImages()) {
                            if (image.getUniqueKey().equals(productImage.getUniqueKey())) {
                                productImage.setImage(image.getImage());
                                break;
                            }
                        }
                    }
                    productType.setFullDesign(productType.getPrintFileImages()
                        .stream().noneMatch(design -> design.getImage() == null || design.isCustom()));
                    productRepository.save(existProduct);
                });
        }
    }

    public void updateDesignStatistic(User user, List<LineItemStatisticDTO> statisticDTOList, Order order, LineItem lineItem, String imageUrl) {
        int numberMissingDesign = getNumberMissingDesign(lineItem);
        if (ProduceStatusEnum.PENDING_DESIGN.name().equals(lineItem.getStatus()) && numberMissingDesign == 0) {
            if (StringUtils.isEmpty(lineItem.getSupplierId())) {
                lineItem.setStatus(ProduceStatusEnum.CHOOSE_SUPPLIER.name());

                amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
            } else {
                lineItem.setStatus(ProduceStatusEnum.NEED_PAY.name());
            }

            // Request update statistic for line item status
            statisticDTOList.add(LineItemStatisticDTO.builder()
                .userEmail(order.getSellerEmail())
                .status(lineItem.getStatus())
                .preStatus(ProduceStatusEnum.PENDING_DESIGN.name())
                .build());
        }
        lineItem.setNumberDesignMissing(numberMissingDesign);
        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.UPDATE_DESIGN.name(), null, user.getFullName());

        //Send mail to supplier after update design at "In Production"
        if (ProduceStatusEnum.IN_PRODUCTION.name().equals(lineItem.getStatus())) {
            amazonSESService.sendMailAfterUpdateDesignForSupplier(order, lineItem, imageUrl);
        }
    }

    private String getCountryByCode(String countryCode) {
        for (CountryCode code : CountryCode.values()) {
            if (code.name().equals(countryCode)) {
                return code.getName();
            }
        }

        return null;
    }

    private String getWooProvince(WooAddress wooAddress) {
        if (CountryCode.US.name().equals(wooAddress.getCountry())) {
            return StateEnum.findByAbbreviation(wooAddress.getState()).getName();
        }

        return wooAddress.getState();
    }

    public int getNumberMissingDesign(LineItem lineItem) {
        return (int) lineItem.getPrintFileImages().stream()
            .filter(design -> design.getImage() == null)
            .count();
    }

    public List<OrderImportLineErrorDTO> importOrder(XSSFWorkbook wb, User user, Site site) throws JsonProcessingException {
        XSSFSheet sheet = wb.getSheetAt(0);
        Map<String, Order> orderMap = new HashMap<>();
        List<OrderImportLineErrorDTO> orderErrors = new ArrayList<>();
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        int i = 0;
        for (Row row : sheet) {
            if (i++ > 0) {
                if (!isEmptyRow(row, ImportOrderCellEnum.SHIPPING_METHOD.getIndex())) {
                    try {
                        String orderId = getDataOfCell(row, ImportOrderCellEnum.ORDER_ID.getIndex());
                        Order order = orderMap.computeIfAbsent(orderId, s -> {
                            if (orderRepository.findByOrderIdAndSite(orderId, site).isPresent()) {
                                throw new DuplicateDataException("order_id");
                            }

                            Address address = Address.builder()
                                .firstName(getDataOfCell(row, ImportOrderCellEnum.FIRST_NAME.getIndex()))
                                .lastName(getDataOfCell(row, ImportOrderCellEnum.LAST_NAME.getIndex()))
                                .fullName(getDataOfCell(row, ImportOrderCellEnum.FIRST_NAME.getIndex())
                                    + " " + getDataOfCell(row, ImportOrderCellEnum.LAST_NAME.getIndex()))
                                .company(getDataOfCell(row, ImportOrderCellEnum.COMPANY.getIndex()))
                                .address1(getDataOfCell(row, ImportOrderCellEnum.ADDRESS_1.getIndex()))
                                .address2(getDataOfCell(row, ImportOrderCellEnum.ADDRESS_2.getIndex()))
                                .city(getDataOfCell(row, ImportOrderCellEnum.CITY.getIndex()))
                                .province(getDataOfCell(row, ImportOrderCellEnum.PROVINCE.getIndex()))
                                .country(getDataOfCell(row, ImportOrderCellEnum.COUNTRY.getIndex()))
                                .postcode(getDataOfCell(row, ImportOrderCellEnum.POSTCODE.getIndex()))
                                .phone(getDataOfCell(row, ImportOrderCellEnum.PHONE.getIndex()))
                                .build();

                            Order tempOrder = Order.builder()
                                .source(OrderSourceEnum.IMPORT.name())
                                .orderId(orderId)
                                .orderNumber(orderId)
                                .orderName(site.getNumber() + "-" + orderId)
                                .shippingAddress(address)
                                .billingAddress(address)
                                .lineItems(new ArrayList<>())
                                .orderLogs(new ArrayList<>())
                                .sellerEmail(user.getEmail())
                                .seller(user)
                                .site(site)
                                .siteType(site.getSiteType())
                                .discount(user.getSellerLevel() != null ? user.getSellerLevel().getDiscountInUsd() : 0)
                                .importOrder(true)
                                .coolingOff(site.getOrderHoldingHour() > 0)
                                .coolingOffExp(Instant.now().plus(site.getOrderHoldingHour(), ChronoUnit.HOURS))
                                .build();
                            tempOrder.addOrderLog(null, OrderLogTypeEnum.ORDER_CREATED.name(), null);
                            tempOrder.addOrderLog(null, OrderLogTypeEnum.COOLING_OFF.name(), Instant.now().plus(site.getOrderHoldingHour(), ChronoUnit.HOURS).toString());
                            return tempOrder;
                        });

                        LineItem lineItem = LineItem.builder()
                            .sku(getDataOfCell(row, ImportOrderCellEnum.ITEM_SKU.getIndex()))
                            .quantity(Integer.parseInt(getDataOfCell(row, ImportOrderCellEnum.ITEM_QUANTITY.getIndex())))
                            .build();

                        String price = getDataOfCell(row, ImportOrderCellEnum.ITEM_PRICE.getIndex());
                        if (!StringUtils.isEmpty(price) && NumberUtils.toDouble(price, -1) <= 0) {
                            throw new InvalidDataException("price");
                        }
                        validateLineItemForImport(order, lineItem, user.getEmail(), NumberUtils.toDouble(price, -1), statisticDTOList);
                        order.getLineItems().add(lineItem);
                        order.setTotalBaseCost(order.getTotalBaseCost() + (lineItem.getBaseCost() - order.getDiscount() + lineItem.getCarrierCost()) * lineItem.getQuantity());
                        order.setTotal(order.getTotal() + (NumberUtils.toDouble(lineItem.getPrice(), 0) - order.getDiscount() + lineItem.getCarrierCost()) * lineItem.getQuantity());
                    } catch (Exception ex) {
                        orderErrors.add(OrderImportLineErrorDTO.builder()
                            .orderId(getDataOfCell(row, ImportOrderCellEnum.ORDER_ID.getIndex()))
                            .firstName(getDataOfCell(row, ImportOrderCellEnum.FIRST_NAME.getIndex()))
                            .lastName(getDataOfCell(row, ImportOrderCellEnum.LAST_NAME.getIndex()))
                            .company(getDataOfCell(row, ImportOrderCellEnum.COMPANY.getIndex()))
                            .address1(getDataOfCell(row, ImportOrderCellEnum.ADDRESS_1.getIndex()))
                            .address2(getDataOfCell(row, ImportOrderCellEnum.ADDRESS_2.getIndex()))
                            .city(getDataOfCell(row, ImportOrderCellEnum.CITY.getIndex()))
                            .province(getDataOfCell(row, ImportOrderCellEnum.PROVINCE.getIndex()))
                            .country(getDataOfCell(row, ImportOrderCellEnum.COUNTRY.getIndex()))
                            .postcode(getDataOfCell(row, ImportOrderCellEnum.POSTCODE.getIndex()))
                            .phone(getDataOfCell(row, ImportOrderCellEnum.PHONE.getIndex()))
                            .itemSku(getDataOfCell(row, ImportOrderCellEnum.ITEM_SKU.getIndex()))
                            .itemQuantity(getDataOfCell(row, ImportOrderCellEnum.ITEM_QUANTITY.getIndex()))
                            .itemPrice(getDataOfCell(row, ImportOrderCellEnum.ITEM_PRICE.getIndex()))
                            .shippingMethod(getDataOfCell(row, ImportOrderCellEnum.SHIPPING_METHOD.getIndex()))
                            .error(ex.getMessage() + (ex instanceof ValidatorException ? ("-" + ((ValidatorException) ex).getFieldName()) : ""))
                            .build());
                    }
                }
            }
        }

        List<Order> newOrders = orderMap.values().stream().filter(order -> !order.getLineItems().isEmpty()).collect(Collectors.toList());
        for (Order newOrder : newOrders) {
            newOrder.setTotal(newOrder.getLineItems().stream().mapToDouble(value -> Double.parseDouble(value.getPrice())).sum());
            newOrder.setTotalBaseCost(newOrder.getLineItems().stream().mapToDouble(LineItem::getBaseCost).sum());
        }
        orderRepository.saveAll(newOrders);

        //Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

        for (Order order : newOrders) {
            //Statistic order
            sendOrderStatistic(site);

            //Check paid order
            if (order.getCoolingOffExp().isBefore(Instant.now())) {
                paidForOrder(order);
            }

            amazonSESService.sendEmailAfterNewOrderForSeller(order);
        }

        return orderErrors;
    }

    public List<ImportTrackingErrorDTO> importTracking(XSSFWorkbook wb) {
        XSSFSheet sheet = wb.getSheetAt(0);
        Map<String, Order> orderMap = new HashMap<>();
        Map<String, SyncTrackingDTO> syncTrackingMap = new HashMap<>();
        Map<String, TrackingMoreDTO> trackingMap = new HashMap<>();
        List<ImportTrackingErrorDTO> errors = new ArrayList<>();
        Map<String, SupplierBalanceDTO> supplierBalanceMap = new HashMap<>();
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();

        int i = 1;
        for (Row row : sheet) {
            if (i++ > 1) {
                if (!isEmptyRow(row, ImportTrackingCellEnum.TRACKING_NUMBER.getIndex())) {
                    String trackingNumber = getDataOfCell(row, ImportTrackingCellEnum.TRACKING_NUMBER.getIndex());
                    String trackingUrl = getDataOfCell(row, ImportTrackingCellEnum.TRACKING_URL.getIndex());

                    if (!StringUtils.isEmpty(trackingNumber)) {
                        try {
                            String orderId = getDataOfCell(row, ImportTrackingCellEnum.ORDER_ID.getIndex());
                            String sku = getDataOfCell(row, ImportTrackingCellEnum.SKU.getIndex());
                            Order order = orderMap.computeIfAbsent(orderId, s -> orderRepository.findById(orderId)
                                .orElseThrow(() -> new ObjectNotFoundException("order")));
                            SyncTrackingDTO syncTrackingDTO = syncTrackingMap.computeIfAbsent(orderId, s -> SyncTrackingDTO.builder()
                                .siteId(order.getSite().getId())
                                .originalOrderId(order.getId())
                                .orderId(order.getOrderId())
                                .lineItems(new ArrayList<>())
                                .build());

                            LineItem lineItem = getLineItemInOrderBySku(order, sku).orElseThrow(() -> new ObjectNotFoundException("line_item"));
                            if (!ProduceStatusEnum.IN_PRODUCTION.name().equals(lineItem.getStatus())
                                && !ProduceStatusEnum.SHIPPED.name().equals(lineItem.getStatus())) {
                                throw new InvalidDataException("can_not_update_tracking");
                            }
                            String lastTrackingNumber = lineItem.getTrackingNumber();
                            String lastTrackingUrl = lineItem.getTrackingUrl();
                            lineItem.setTrackingNumber(trackingNumber);
                            lineItem.setTrackingUrl(StringUtils.isEmpty(trackingUrl)
                                ? "https://www.trackingmore.com/en/" + trackingNumber : trackingUrl);

                            trackingMap.computeIfAbsent(trackingNumber, s -> TrackingMoreDTO.builder()
                                .carrierCode(lineItem.getCarrierCode())
                                .trackingNumber(trackingNumber)
                                .orderId(order.getOrderNumber())
                                .comment(order.getId())
                                .title(order.getOrderName())
                                .build());

                            if (ProduceStatusEnum.IN_PRODUCTION.name().equals(lineItem.getStatus())) {
                                lineItem.setStatus(ProduceStatusEnum.SHIPPED.name());
                                order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.SHIPPED.name(), null);

                                supplierBalanceMap.computeIfAbsent(lineItem.getSupplierId(), s -> SupplierBalanceDTO.builder()
                                    .supplierEmail("")
                                    .supplierId(lineItem.getSupplierId())
                                    .isPaid(false)
                                    .author("System")
                                    .orders(new ArrayList<>())
                                    .build())
                                    .getOrders()
                                    .add(SupplierBalanceOrderDTO.builder()
                                        .orderId(orderId)
                                        .itemSku(lineItem.getSku())
                                        .amount(lineItem.getSupplierCost() * lineItem.getQuantity())
                                        .build());

                                lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                    lineItem.getStatus(), ProduceStatusEnum.IN_PRODUCTION.name());
                                lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                                    lineItem.getStatus(), ProduceStatusEnum.IN_PRODUCTION.name());

                                amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                                amazonSESService.sendEmailAfterChangeStatusForSupplier(order, lineItem);
                            } else {
                                order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.UPDATED_TRACKING.name(), lineItem.getTrackingNumber());
                            }

                            if (!Objects.equals(lineItem.getTrackingNumber(), lastTrackingNumber)
                                || !Objects.equals(lineItem.getTrackingUrl(), lastTrackingUrl)) {
                                syncTrackingDTO.getLineItems().add(SyncTrackingLineItemDTO.builder()
                                    .lineItemSku(lineItem.getSku())
                                    .trackingNumber(lineItem.getTrackingNumber())
                                    .trackingUrl(lineItem.getTrackingUrl())
                                    .build());
                            }
                        } catch (Exception ex) {
                            errors.add(ImportTrackingErrorDTO.builder()
                                .lineNumber(i)
                                .orderId(getDataOfCell(row, ImportTrackingCellEnum.ORDER_ID.getIndex()))
                                .orderName(getDataOfCell(row, ImportTrackingCellEnum.ORDER_NAME.getIndex()))
                                .sku(getDataOfCell(row, ImportTrackingCellEnum.SKU.getIndex()))
                                .error(ex.getMessage() + (ex instanceof ValidatorException ? ((ValidatorException) ex).getFieldName() : ""))
                                .build());
                        }
                    }
                }
            }
        }
        orderRepository.saveAll(orderMap.values().stream().filter(order -> !order.getLineItems().isEmpty()).collect(Collectors.toList()));

        //Sync tracking
        for (Map.Entry<String, SyncTrackingDTO> entry : syncTrackingMap.entrySet()) {
            if (!entry.getValue().getLineItems().isEmpty()) {
                sendShopifySyncTrackingMessages(entry.getValue());
            }
        }

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

        sendTrackingMoreMessages(trackingMap);
        sendSupplierBalanceMessages(supplierBalanceMap);

        return errors;
    }

    public void sendTrackingMoreMessages(Map<String, TrackingMoreDTO> trackingMap) {
        try {
            if (!trackingMap.values().isEmpty()) {
                trackingMoreMessageChannel.send(MessageBuilder.withPayload(objectMapper.writeValueAsString(trackingMap.values())).build());
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    public void sendSupplierBalanceMessages(Map<String, SupplierBalanceDTO> supplierBalanceMap) {
        for (SupplierBalanceDTO value : supplierBalanceMap.values()) {
            try {
                supplierBalanceMessageChannel.send(MessageBuilder.withPayload(objectMapper.writeValueAsString(value)).build());
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
    }

    public void sendShopifySyncTrackingMessages(SyncTrackingDTO dto) {
        try {
            shopifySyncTrackingMessageChannel.send(MessageBuilder.withPayload(objectMapper.writeValueAsString(dto)).build());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    public void filterLineItemWithStatus(Stream<Order> orders, List<String> statuses, String supplierId) {
        if (statuses != null && !statuses.contains(ProduceStatusEnum.COOLING_OFF.name())) {
            orders.forEach(order -> {
                order.getLineItems().removeIf(lineItem -> !statuses.contains(lineItem.getStatus()));
                if (!StringUtils.isEmpty(supplierId)) {
                    order.getLineItems().removeIf(lineItem -> !supplierId.equalsIgnoreCase(lineItem.getSupplierId()));
                }
            });
        }
    }

    private String getDataOfCell(Row row, int index) {
        return new DataFormatter().formatCellValue(row.getCell(index)).replaceAll("[\uFEFF-\uFFFF]", "");
    }

    private void validateLineItemForImport(Order order, LineItem lineItem, String userEmail, double price, List<LineItemStatisticDTO> statisticDTOList) {
        if (order.getLineItems().stream().anyMatch(lineItem1 -> lineItem1.getSku().equals(lineItem.getSku()))) {
            throw new DuplicateDataException("order_line_item");
        }
        Product product = productRepository.findBySkuAndEmail(lineItem.getSku(), userEmail)
            .orElseThrow(() -> new ObjectNotFoundException("product"));
        ProductVariantDetail productVariantDetail = productService.getProductVariantDetailBySku(product, lineItem.getSku())
            .orElseThrow(() -> new ObjectNotFoundException("product_variant"));

        if (!product.isActivated() || !productVariantDetail.isEnable()) {
            throw new InvalidDataException("product_or_variant_inactive");
        }

        ProductType productType = productService.getProductTypeBySku(product, lineItem.getSku())
            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

        ProductTypeCarrier productTypeCarrier = productType.getCarriers()
            .stream()
            .filter(ptc -> ptc.getCarrier().getCode().equalsIgnoreCase(productType.getDefaultCarrier().getCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidDataException("shipping_method"));
        lineItem.setCarrierId(productTypeCarrier.getCarrier().getId());
        lineItem.setCarrierCode(productTypeCarrier.getCarrier().getCode());
        lineItem.setCarrier(productTypeCarrier.getCarrier().getName());
        lineItem.setCarrierCost(productTypeCarrier.getCost());

        List<ProductPrintFileDetail> printFileImages = productService.getProductPrintFile(product, productType.getId());
        printFileImages.forEach(productPrintFileDetail -> {
            if (productPrintFileDetail.isCustom()) {
                productPrintFileDetail.setImage(null);
            }
        });

        int numberDesignMissing = productService.getNumberDesignMissing(lineItem.getSku(), product);
        boolean isValidShippingCountry = isValidShippingCountry(order.getShippingAddress() == null ? "" : order.getShippingAddress().getCountry(),
            productType.getCountries(), productType.isInclude());
        lineItem.setPrice((price <= 0 ? productVariantDetail.getSalePrice() : price) + "");
        lineItem.setName(product.getTitle());
        lineItem.setProductId(product.getProductId());
        lineItem.setProductTypeId(productType.getId());
        lineItem.setProductTypeTitle(productType.getTitle());
        lineItem.setImageId(productVariantDetail.getImageId());
        lineItem.setBaseSku(productVariantDetail.getBaseSku());
        lineItem.setPrintFileImages(printFileImages);
        lineItem.setNumberDesignMissing(numberDesignMissing);
        lineItem.setLastSentNotification(Instant.now());
        lineItem.setLastSentSpreadHour(0);
        setCostForLineItem(lineItem, productType);

        //Set status for line item
        String status = getLineItemStatus(numberDesignMissing, StringUtils.isEmpty(lineItem.getSupplierId()));
        lineItem.setStatus(isValidShippingCountry ? status : ProduceStatusEnum.ACTION_REQUIRED.name());
        lineItem.setPreStatus(isValidShippingCountry ? null : status);
        lineItem.setStatusNote(isValidShippingCountry ? null : OrderLogTypeEnum.INVALID_SHIPPING_COUNTRY.name());
        //End

        addLogForLineItem(status, isValidShippingCountry, lineItem.getSku(), order);

        // Request update statistic for line item status
        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
            lineItem.getStatus(), null);
        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
            ProduceStatusEnum.ALL.name(), null);

        if (order.getCoolingOffExp().isAfter(Instant.now())) {
            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                ProduceStatusEnum.COOLING_OFF.name(), null);
        }

        if (isValidShippingCountry) {
            amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
        }
    }

    public void setCostForLineItem(LineItem lineItem, ProductType productType) {
        lineItem.setBaseCost(productType.getVariantDetails().stream()
            .filter(variantDetail -> variantDetail.getSku().equals(lineItem.getBaseSku()))
            .findFirst().orElse(new ProductTypeVariantDetail()).getBaseCost());
        lineItem.setCarrierId(productType.getDefaultCarrier().getId());
        lineItem.setCarrierCode(productType.getDefaultCarrier().getCode());
        lineItem.setCarrier(productType.getDefaultCarrier().getName());
        lineItem.setCarrierCost(productType.getCarriers()
            .stream()
            .filter(productTypeCarrier -> productTypeCarrier.getCarrier().getId().equals(productType.getDefaultCarrier().getId()))
            .findFirst().orElse(new ProductTypeCarrier()).getCost());

        productService.getProductTypeVariantDetailBySku(productType, lineItem.getBaseSku())
            .ifPresent(ptvd -> {
                if (ptvd.getSupplierCosts().size() == 1) {
                    lineItem.setSupplierId(ptvd.getSupplierCosts().get(0).getSupplier().getId());
                    lineItem.setSupplier(ptvd.getSupplierCosts().get(0).getSupplier().getFirstName()
                        + " " + ptvd.getSupplierCosts().get(0).getSupplier().getLastName());
                    lineItem.setSupplierCost(ptvd.getSupplierCosts().get(0).getCost());
                }
            });
    }

    private void productStatistic(boolean isProductType, Set<String> ids) {
        for (String id : ids) {
            productStatisticService.sendProductStatistic(isProductType, id);
        }
    }

    public Optional<LineItem> getLineItemInOrderBySku(Order order, String sku) {
        return order.getLineItems()
            .stream()
            .filter(lI -> lI.getSku().equals(sku))
            .findFirst();
    }

    public void paidForOrder(Order order) {
        try {
            balanceMessageChannel.send(MessageBuilder
                .withPayload(objectMapper.writeValueAsString(order))
                .build());
        } catch (Exception e) {
            log.error("Error occur when paid order: {}", e.getMessage());
        }
    }

    public void checkCoolingOffToPay(List<Order> orders) {
        for (Order order : orders) {
            if (order.getCoolingOffExp().isBefore(Instant.now())) {
                paidForOrder(order);
            }
        }
    }

    private boolean isEmptyRow(Row row, int length) {
        for (int i = 0; i < length; i++) {
            if (!StringUtils.isEmpty(getDataOfCell(row, i))) {
                return false;
            }
        }
        return true;
    }

    public double countAllForAdmin() {
        Aggregation aggregation = newAggregation(
            unwind("lineItems"),
            group().count().as("total")
        );
        AggregationResults<Order> results = mongoTemplate.aggregate(aggregation,
            Order.class, Order.class);
        return results.getMappedResults().size() > 0 ? results.getMappedResults().get(0).getTotal() : 0;
    }

    public double countForAdminByStatus(String status) {
        Aggregation aggregation;
        if (ProduceStatusEnum.COOLING_OFF.name().equals(status)) {
            Instant now = Instant.now();
            aggregation = newAggregation(
                unwind("lineItems"),
                match(Criteria.where("coolingOffExp").gt(now)),
                group().count().as("total")
            );
        } else {
            aggregation = newAggregation(
                unwind("lineItems"),
                match(Criteria.where("lineItems.status").is(status)),
                group().count().as("total")
            );
        }
        AggregationResults<Order> results = mongoTemplate.aggregate(aggregation,
            Order.class, Order.class);
        return results.getMappedResults().size() > 0 ? results.getMappedResults().get(0).getTotal() : 0;
    }

    public double countAllForSeller(String email) {
        Aggregation aggregation = newAggregation(
            unwind("lineItems"),
            match(Criteria.where("sellerEmail").is(email)),
            group().count().as("total")
        );
        AggregationResults<Order> results = mongoTemplate.aggregate(aggregation,
            Order.class, Order.class);
        return results.getMappedResults().size() > 0 ? results.getMappedResults().get(0).getTotal() : 0;
    }

    public double countForSellerByStatus(String email, String status) {
        Aggregation aggregation;
        if (ProduceStatusEnum.COOLING_OFF.name().equals(status)) {
            Instant now = Instant.now();
            aggregation = newAggregation(
                unwind("lineItems"),
                match(Criteria.where("sellerEmail").is(email)),
                match(Criteria.where("coolingOffExp").gt(now)),
                group().count().as("total")
            );
        } else {
            aggregation = newAggregation(
                unwind("lineItems"),
                match(Criteria.where("sellerEmail").is(email)),
                match(Criteria.where("lineItems.status").is(status)),
                group().count().as("total")
            );
        }
        AggregationResults<Order> results = mongoTemplate.aggregate(aggregation,
            Order.class, Order.class);
        return results.getMappedResults().size() > 0 ? results.getMappedResults().get(0).getTotal() : 0;
    }

    public double countAllForSupplier(String supplierId) {
        Aggregation aggregation = newAggregation(
            unwind("lineItems"),
            match(Criteria.where("lineItems.supplierId").is(supplierId)),
            match(Criteria.where("lineItems.status").in(ProduceStatusEnum.getSupplierStatuses())),
            group().count().as("total")
        );
        AggregationResults<Order> results = mongoTemplate.aggregate(aggregation,
            Order.class, Order.class);
        return results.getMappedResults().size() > 0 ? results.getMappedResults().get(0).getTotal() : 0;
    }

    public double countForSupplierByStatus(String supplierId, String status) {
        Aggregation aggregation = newAggregation(
            unwind("lineItems"),
            match(Criteria.where("lineItems.supplierId").is(supplierId)),
            match(Criteria.where("lineItems.status").is(status)),
            group().count().as("total")
        );
        AggregationResults<Order> results = mongoTemplate.aggregate(aggregation,
            Order.class, Order.class);
        return results.getMappedResults().size() > 0 ? results.getMappedResults().get(0).getTotal() : 0;
    }

    public void sendOrderStatistic(Site site) throws JsonProcessingException {
        //Statistic for admin
        dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.ORDER.name());

        //Statistic for seller and site
        dailyStatisticService.sendStatistic(site.getEmail(), null, StatisticFieldEnum.ORDER.name());
        dailyStatisticService.sendStatistic(null, site.getId(), StatisticFieldEnum.ORDER.name());
    }
}
