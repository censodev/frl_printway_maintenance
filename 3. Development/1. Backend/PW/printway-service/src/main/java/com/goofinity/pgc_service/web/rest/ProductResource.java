package com.goofinity.pgc_service.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.config.ApplicationProperties;
import com.goofinity.pgc_service.domain.ImageUpload;
import com.goofinity.pgc_service.domain.ProductPrintFileDetail;
import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductImage;
import com.goofinity.pgc_service.domain.product.ProductTypeGroup;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypePrintFileFormat;
import com.goofinity.pgc_service.domain.productType.ProductTypeVariantDetail;
import com.goofinity.pgc_service.dto.*;
import com.goofinity.pgc_service.dto.shopify.product.ShopifyCollectionDTO;
import com.goofinity.pgc_service.dto.shopify.product.ShopifyImageDTO;
import com.goofinity.pgc_service.dto.shopify.product.ShopifyProductDTO;
import com.goofinity.pgc_service.dto.shopify.product.ShopifyProductPage;
import com.goofinity.pgc_service.dto.woo.WooCategoryDTO;
import com.goofinity.pgc_service.dto.woo.product.WooImage;
import com.goofinity.pgc_service.dto.woo.product.WooProduct;
import com.goofinity.pgc_service.enums.ProduceStatusEnum;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.enums.SiteTypeEnum;
import com.goofinity.pgc_service.event.mappingProduct.MappingProductBinding;
import com.goofinity.pgc_service.repository.*;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.bson.types.ObjectId;
import org.hashids.Hashids;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@RestController
@RequestMapping("/api/product")
@EnableBinding(MappingProductBinding.class)
public class ProductResource {
    private final String SALT = "mKNYJUYMqBrHnFHNGC5w";
    private final int PAGE_SIZE = 200;
    private static final Logger log = LoggerFactory.getLogger(ProductResource.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final ApplicationProperties properties;
    private final ProductTypeRepository productTypeRepository;
    private final ProductRepository productRepository;
    private final ImageUploadRepository imageRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final LineItemStatisticService lineItemStatisticService;
    private final AmazonS3Service amazonS3Service;
    private final ShopifyService shopifyService;
    private final WooService wooService;
    private final ProductService productService;
    private final MessageChannel messageChannel;

    public ProductResource(final ApplicationProperties properties,
                           final ProductTypeRepository productTypeRepository,
                           final ProductRepository productRepository,
                           final ImageUploadRepository imageRepository,
                           final SiteRepository siteRepository,
                           final UserRepository userRepository,
                           final OrderRepository orderRepository,
                           final OrderService orderService,
                           final LineItemStatisticService lineItemStatisticService,
                           final ShopifyService shopifyService,
                           final WooService wooService,
                           final ProductService productService,
                           final AmazonS3Service amazonS3Service,
                           final MappingProductBinding mappingProductBinding) {
        this.properties = properties;
        this.productTypeRepository = productTypeRepository;
        this.productRepository = productRepository;
        this.imageRepository = imageRepository;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.lineItemStatisticService = lineItemStatisticService;
        this.shopifyService = shopifyService;
        this.wooService = wooService;
        this.productService = productService;
        this.amazonS3Service = amazonS3Service;
        this.messageChannel = mappingProductBinding.publisher();
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Product>> getProductWithPagination(Pageable pageable,
                                                                  @RequestParam Map<String, String> params) {
        log.debug("Get products with pagination: {}", pageable);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);

        String keyword = params.get("keyword") != null ? params.get("keyword") : "";
        String seller = user.getRoles().contains(RoleEnum.ROLE_ADMIN.name()) ? params.get("seller") : user.getEmail();
        ObjectId productTypeId = params.get("productTypeId") == null ? null : new ObjectId(params.get("productTypeId"));
        ObjectId siteId = params.get("siteId") == null ? null : new ObjectId(params.get("siteId"));
        Boolean isFullDesign = "false".equalsIgnoreCase(params.get("fullDesign")) ? Boolean.FALSE : null;
        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));

        return new ResponseEntity<>(productRepository.findAllWithPaging(keyword, seller, siteId, productTypeId, isFullDesign, startDate, endDate, pageable)
            .map(product -> {
                product.setFullName(product.getUser() != null ? product.getUser().getFullName() : "");
                return product;
            }), HttpStatus.OK);
    }

    @GetMapping("/shopify/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<ShopifyProductPage> getShopifyProducts(@RequestParam Map<String, String> params) throws IOException {
        log.debug("Get shopify products: {}", params);

        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        Site site = siteRepository.findByIdAndEmailIgnoreCase(params.get("siteId"), username)
            .orElseThrow(() -> new ObjectNotFoundException("site"));
        String collectionId = "allallall".equals(params.get("collectionId")) ? "" : StringUtils.defaultIfEmpty(params.get("collectionId"), "");
        String keyword = StringUtils.defaultString(params.get("keyword"), "");

        ShopifyProductPage productPage = shopifyService.getProducts(site.getShopUrl(), site.getAccessKey(), collectionId, keyword, params.get("pageInfo"));
        Map<Long, Product> productMap = getMappedProduct(productPage.getData().stream().map(ShopifyProductDTO::getId).collect(Collectors.toList()));
        productPage.getData().forEach(shopifyProductDTO -> {
            Product product = productMap.get(shopifyProductDTO.getId());
            shopifyProductDTO.setStatus(null);
            if (product != null) {
                shopifyProductDTO.setStatus(product.isSynced() ? "SUCCESS" : "PROCESSING");
            }
        });

        return new ResponseEntity<>(productPage, HttpStatus.OK);
    }

    @GetMapping("/woo/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<WooProduct>> getWooProducts(@RequestParam Map<String, String> params) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        log.debug("Get woo products: {}", params);

        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        Site site = siteRepository.findByIdAndEmailIgnoreCase(params.get("siteId"), username)
            .orElseThrow(() -> new ObjectNotFoundException("site"));
        int page = NumberUtils.toInt(params.get("page"), 1);
        String category = "allallall".equals(params.get("category")) ? "" : StringUtils.defaultIfEmpty(params.get("category"), "");
        String keyword = StringUtils.defaultString(params.get("keyword"), "");

        List<WooProduct> productDTOs = wooService.getProducts(site.getUrl(), site.getConsumerKey(), site.getConsumerSecret(), page, category, keyword);
        Map<Long, Product> productMap = getMappedProduct(productDTOs.stream().map(WooProduct::getId).collect(Collectors.toList()));
        productDTOs.forEach(shopifyProductDTO -> {
            Product product = productMap.get(shopifyProductDTO.getId());
            shopifyProductDTO.setStatus(null);
            if (product != null) {
                shopifyProductDTO.setStatus(product.isSynced() ? "SUCCESS" : "PROCESSING");
            }
        });

        return new ResponseEntity<>(productDTOs, HttpStatus.OK);
    }

    private Map<Long, Product> getMappedProduct(List<Long> productIds) {
        Map<Long, Product> productMap = new HashMap<>();
        productRepository.findAllByProductIdIn(productIds)
            .forEach(product -> {
                productMap.put(product.getProductId(), product);
            });
        return productMap;
    }

    @PostMapping("/mapping")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void mappingProduct(@RequestBody MappingProductDTO mappingProductDTO) throws JsonProcessingException {
        log.debug("Mapping product: {}", mappingProductDTO);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new)).orElseThrow(SecurityException::new);
        Site site = siteRepository.findById(mappingProductDTO.getSite().getId())
            .orElseThrow(() -> new ObjectNotFoundException("site"));

        if ((mappingProductDTO.getShopifyProducts() != null && SiteTypeEnum.WOO.name().equals(site.getSiteType()))
            && (mappingProductDTO.getWooProducts() != null && SiteTypeEnum.SHOPIFY.name().equals(site.getSiteType()))) {
            throw new InvalidDataException("site_type");
        }

        //Get all image from variant
        Set<String> imageIds = new HashSet<>();
        mappingProductDTO.getProductTypes().forEach(productTypeGroup -> {
            imageIds.addAll(productTypeGroup.getVariantDetails()
                .stream()
                .map(ProductVariantDetail::getImageId)
                .collect(Collectors.toList()));
        });

        List<ProductImage> productImages = imageRepository.findAllByIdIn(imageIds)
            .stream()
            .map(imageUpload -> ProductImage.builder()
                .image(imageUpload)
                .build())
            .collect(Collectors.toList());
        //End

        String rawProductTypes = objectMapper.writeValueAsString(mappingProductDTO.getProductTypes());
        if (mappingProductDTO.getWooProducts() != null || mappingProductDTO.getShopifyProducts() != null) {
            List<Product> products = mappingProductDTO.getProducts()
                .stream()
                .filter(distinctByKey(siteProduct -> siteProduct instanceof ShopifyProductDTO ? ((ShopifyProductDTO) siteProduct).getId() : ((WooProduct) siteProduct).getId()))
                .map(siteProduct -> {
                    long siteProductId = siteProduct instanceof ShopifyProductDTO ? ((ShopifyProductDTO) siteProduct).getId() : ((WooProduct) siteProduct).getId();
                    if (productRepository.countAllByProductIdAndSite(siteProductId, site) > 0) {
                        return null;
                    }

                    Product product = mapProduct(siteProduct, site, user);
                    product.getImages().addAll(productImages);
                    try {
                        product.setProductTypes(objectMapper.readValue(rawProductTypes, new TypeReference<List<ProductTypeGroup>>() {
                        }));
                    } catch (JsonProcessingException e) {
                        log.error("Error when mapping product: {}", siteProduct);
                    }
                    validateNewProduct(product, site, user, true, true);

                    if (siteProduct instanceof WooProduct) {
                        product.setVariantIds(((WooProduct) siteProduct).getVariations());
                    }

                    return product;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            productRepository.saveAll(products);
            products.forEach(product -> {
                try {
                    messageChannel.send(MessageBuilder
                        .withPayload(objectMapper.writeValueAsString(product))
                        .build());
                } catch (JsonProcessingException e) {
                    log.error("Error when mapping product: {}", product);
                }
            });
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        log.debug("Create product: {}", product);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);
        Site site = siteRepository.findByIdAndEmailIgnoreCase(product.getSite().getId(), user.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("site"));

        if (site.isDeleted() || !site.isActive()) {
            throw new InvalidDataException("site_in_active");
        }

        validateNewProduct(product, site, user, true, true);
        product.setUser(user);
        product = productRepository.save(product);
        syncNewProduct(product, site);

        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/sync")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Product> syncProduct(@RequestParam String id) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        log.debug("Sync product to site: {}", id);

        Product product = productRepository.findByIdAndEmail(id, SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("product"));
        if (product.getSite().isVirtual() || product.isSynced()) {
            throw new InvalidDataException("not_sync");
        }

        prepareImageUpload(product);
        if (product.getProductId() > 0) {
            try {
                messageChannel.send(MessageBuilder
                    .withPayload(objectMapper.writeValueAsString(product))
                    .build());
            } catch (JsonProcessingException e) {
                log.error("Error when mapping product: {}", product);
            }
        } else {
            if (product.getSite().getSiteType().equals(SiteTypeEnum.SHOPIFY.name())) {
                shopifyService.createProduct(product, product.getSite().getShopUrl(), product.getSite().getAccessKey());
            } else {
                wooService.createProduct(product, product.getSite().getUrl(), product.getSite().getConsumerKey(), product.getSite().getConsumerSecret());
            }
        }
        product.setSynced(true);
        productRepository.save(product);

        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Product> updateProduct(@Valid @RequestBody Product product) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        log.debug("Update product: {}", product);

        Product existProduct = productRepository.findByIdAndEmail(product.getId(),
            SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("product"));
        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);
        Site site = siteRepository.findByIdAndEmailIgnoreCase(product.getSite().getId(), user.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("site"));

        if (existProduct.isSynced()) {
            validatePrintFile(product, false);
            updateProductTypeDetail(existProduct, product, false, true);

            if (!existProduct.equalForUpdate(product)) {
                existProduct.setTitle(product.getTitle());
                existProduct.setTags(product.getTags());
                existProduct.setCategories(product.getCategories());
                existProduct.setImages(product.getImages());
                for (ProductImage image : existProduct.getImages()) {
                    image.setImage(imageRepository.findById(image.getImage().getId())
                        .orElseThrow(() -> new ObjectNotFoundException("image")));
                }

                product.setUniqueKey(existProduct.getUniqueKey());
                validateVariant(product, false);
                updateProductTypeDetail(existProduct, product, true, false);

                try {
                    prepareImageUpload(existProduct);
                    existProduct.setVariantIds(new ArrayList<>());
                    for (ProductTypeGroup productType : existProduct.getProductTypes()) {
                        existProduct.getVariantIds().addAll(productType.getVariantDetails()
                            .stream()
                            .map(ProductVariantDetail::getId)
                            .filter(id -> id > 0).collect(Collectors.toList()));
                    }
                    productService.updateProduct(existProduct);
                } catch (Exception e) {
                    e.printStackTrace();
                    log.error("Error when update variant mapping product: {}", product);
                }
            }
            productRepository.save(existProduct);
        } else {
            validateNewProduct(product, site, user, existProduct.isActivated(), false);
            product.setId(existProduct.getId());
            productRepository.save(product);
            syncNewProduct(product, site);
        }
        return new ResponseEntity<>(existProduct, HttpStatus.OK);
    }

    @GetMapping("/collection/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<CollectionDTO>> getCollections(@RequestParam String siteId) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        log.debug("Get collections of site: {}", siteId);

        Site site = siteRepository.findByIdAndEmailIgnoreCase(siteId,
            SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("site"));
        if (!site.isActive()) {
            throw new InvalidDataException("site_not_validate");
        }
        List<CollectionDTO> collections = new ArrayList<>();
        if (site.getSiteType().equalsIgnoreCase(SiteTypeEnum.SHOPIFY.toString())) {
            shopifyService.getSmartCollections(site.getShopUrl(), site.getAccessKey())
                .forEach(dto -> collections.add(CollectionDTO.builder()
                    .id(dto.getId())
                    .name(dto.getTitle())
                    .build()));
            shopifyService.getCustomCollections(site.getShopUrl(), site.getAccessKey())
                .forEach(dto -> collections.add(CollectionDTO.builder()
                    .id(dto.getId())
                    .name(dto.getTitle())
                    .build()));
        } else {
            wooService.getCollections(site.getUrl(), site.getConsumerKey(), site.getConsumerSecret())
                .forEach(dto -> collections.add(CollectionDTO.builder()
                    .id(dto.getId() + "")
                    .name(dto.getName())
                    .build()));
        }

        return new ResponseEntity<>(collections, HttpStatus.OK);
    }

    @PostMapping("/collection")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<CollectionDTO> createCollection(@RequestParam String siteId,
                                                          @RequestBody CollectionDTO dto) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        log.debug("Create shopify collection: {}", dto);

        Site site = siteRepository.findById(siteId).orElseThrow(() -> new ObjectNotFoundException("site"));
        if (!site.isActive()) {
            throw new InvalidDataException("site_not_validate");
        }
        CollectionDTO collectionDTO;
        if (site.getSiteType().equalsIgnoreCase(SiteTypeEnum.SHOPIFY.toString())) {
            ShopifyCollectionDTO shopifyCollectionDTO = shopifyService.createCollection(ShopifyCollectionDTO.builder()
                .title(dto.getName())
                .build(), site.getShopUrl(), site.getAccessKey());
            collectionDTO = CollectionDTO.builder()
                .id(shopifyCollectionDTO.getId())
                .name(shopifyCollectionDTO.getTitle())
                .build();
        } else {
            WooCategoryDTO wooCategoryDTO = wooService.createCollection(dto, site.getUrl(), site.getConsumerKey(), site.getConsumerSecret());
            collectionDTO = CollectionDTO.builder()
                .id(wooCategoryDTO.getId() + "")
                .name(wooCategoryDTO.getName())
                .build();
        }

        return new ResponseEntity<>(collectionDTO, HttpStatus.OK);
    }

    @PutMapping("/design")
    @ResponseStatus(HttpStatus.OK)
    public void updateMissingDesign(@Valid @RequestBody UpdateProductDesignDTO dto) {
        log.debug("Update missing design for product: {}", dto);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);

        Product existProduct;
        if (user.getRoles().contains(RoleEnum.ROLE_ADMIN_CONSTANT) || user.getRoles().contains(RoleEnum.ROLE_LISTING_CONSTANT)) {
            existProduct = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ObjectNotFoundException("product"));
        } else {
            existProduct = productRepository.findByIdAndEmail(dto.getProductId(), user.getEmail())
                .orElseThrow(() -> new ObjectNotFoundException("product"));
        }

        dto.getProductTypeUpdates().forEach(itemUpdate -> {
            existProduct.getProductTypes()
                .stream()
                .filter(item -> item.getProductType().getId().equals(itemUpdate.getProductTypeId()))
                .findFirst()
                .ifPresent(productType -> {
                    for (DesignUpdate designUpdate : itemUpdate.getDesignUpdates()) {
                        for (ProductPrintFileDetail productImage : productType.getPrintFileImages()) {
                            if (designUpdate.getUniqueKey().equals(productImage.getUniqueKey()) && !productImage.isCustom()) {
                                ImageUpload imageUpload = imageRepository.findById(designUpdate.getImageId())
                                    .orElseThrow(() -> new ObjectNotFoundException("image_upload"));
                                productImage.setImage(imageUpload);

                                int page = 0;
                                while (true) {
                                    List<Order> orders = orderRepository.findAllForUpdateDesign(itemUpdate.getProductTypeId(),
                                        existProduct.getUniqueKey(), designUpdate.getUniqueKey(), ProduceStatusEnum.getUpdateDesignStatuses(), PageRequest.of(page++, PAGE_SIZE));

                                    if (orders.isEmpty()) {
                                        break;
                                    }

                                    List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
                                    for (Order order : orders) {
                                        order.getLineItems().forEach(lineItem -> {
                                            if (itemUpdate.getProductTypeId().equals(lineItem.getProductTypeId())
                                                && lineItem.getSku().contains(existProduct.getUniqueKey())
                                                && ProduceStatusEnum.getUpdateDesignStatuses().contains(lineItem.getStatus())) {
                                                lineItem.getPrintFileImages()
                                                    .stream()
                                                    .filter(printFileImage -> printFileImage.getUniqueKey().equals(designUpdate.getUniqueKey()))
                                                    .findFirst()
                                                    .ifPresent(file -> {
                                                        file.setImage(imageUpload);
                                                    });

                                                orderService.updateDesignStatistic(user, statisticDTOList, order, lineItem, imageUpload.getThumbUrl());
                                            }
                                        });
                                    }
                                    orderRepository.saveAll(orders);

                                    // Update statistic
                                    statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

                                    orderService.checkCoolingOffToPay(orders);
                                }
                                break;
                            }
                        }
                    }

                    productType.setFullDesign(productType.getPrintFileImages()
                        .stream().noneMatch(design -> design.getImage() == null && !design.isCustom()));
                });
        });
        productRepository.save(existProduct);
    }

    @GetMapping("/active")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void updateActivatedProduct(@RequestParam String id, @RequestParam String activated) {
        log.debug("Update activated status for product: {} with: {}", id, activated);

        Product existProduct = productRepository.findByIdAndEmail(id, SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("product"));

        existProduct.setActivated(Boolean.parseBoolean(activated));
        productRepository.save(existProduct);
    }

    @GetMapping("/duplicate")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity duplicateProduct(@RequestParam String id) {
        log.debug("Duplicate product: {}", id);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);

        Product existProduct = productRepository.findByIdAndEmail(id, user.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("product"));

        existProduct.setParentId(existProduct.getId());
        existProduct.setId(null);
        existProduct.setEmail(user.getEmail());
        existProduct.setProductId(0);
        existProduct.setActivated(true);
        existProduct.setSynced(false);
        existProduct.setUniqueKey(RandomStringUtils.random(7, 0, 0, true, true, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray()));
        existProduct.getProductTypes().forEach(productType -> {
            productType.getVariantDetails().forEach(productVariantDetail -> {
                productVariantDetail.setId(0);
                productVariantDetail.setImageId(null);
            });
        });
        validateVariant(existProduct, true);
        productRepository.save(existProduct);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void syncNewProduct(Product product, Site site) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        if (!product.isDraft() && !site.isVirtual()) {
            prepareImageUpload(product);
            if (site.getSiteType().equals(SiteTypeEnum.SHOPIFY.name())) {
                shopifyService.createProduct(product, site.getShopUrl(), site.getAccessKey());
            } else {
                wooService.createProduct(product, site.getUrl(), site.getConsumerKey(), site.getConsumerSecret());
            }
            product.setSynced(true);
        } else if (site.isVirtual()) {
            product.setSynced(true);
        }

        productRepository.save(product);
    }

    private void validateNewProduct(Product product, Site site, User user, boolean active, boolean isNewProduct) {
        product.setUniqueKey(RandomStringUtils.random(7, 0, 0, true, true, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray()));

        validateVariant(product, true);
        validatePrintFile(product, isNewProduct);

        for (int i = 0; i < product.getImages().size(); i++) {
            product.getImages().get(i).setImage(imageRepository.findById(StringUtils.defaultString(product.getImages().get(i).getImage().getId(), ""))
                .orElseThrow(() -> new ObjectNotFoundException("image")));
        }
        product.getProductTypes().forEach(productTypeGroup -> {
            productTypeGroup.setFullDesign(productTypeGroup.getPrintFileImages()
                .stream().noneMatch(design -> design.getImage() == null || design.isCustom()));

            String sku = productTypeGroup.getProductType().getSku() + "-" + RandomStringUtils.random(4, 0, 0, true, true, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray());
            productTypeGroup.getPrintFileImages().forEach(design -> {
                design.setSku(sku);
                design.setUniqueKey(UUID.randomUUID().toString());
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (design.isCustom()) {
                    design.setImage(null);
                }
            });
        });

        product.setEmail(user.getEmail());
        product.setSynced(false);
        product.setActivated(active);
        product.setSite(site);
        product.setTotalOrder(0);
    }

    private void validateVariant(Product product, boolean isCreate) {
        for (ProductTypeGroup ptg : product.getProductTypes()) {
            ProductType productType = productTypeRepository.findById(ptg.getProductType().getId())
                .orElseThrow(() -> new ObjectNotFoundException("product_type"));

            if (isCreate && !productType.isActive()) {
                throw new InvalidDataException("product_type_inactive");
            }

            ptg.setProductType(productType);

            Set<String> skus = productType.getVariantDetails()
                .stream()
                .filter(ProductTypeVariantDetail::isEnable)
                .map(ProductTypeVariantDetail::getSku)
                .collect(Collectors.toSet());

            ptg.setVariantDetails(ptg.getVariantDetails()
                .stream()
                .filter(variantDetail -> {
                    variantDetail.setSku(variantDetail.getBaseSku() + properties.getSkuJoinSymbol() + product.getUniqueKey());
                    return skus.contains(variantDetail.getBaseSku());
                })
                .collect(Collectors.toList()));
        }
    }

    private void validatePrintFile(Product product, boolean isNew) {
        product.getProductTypes().forEach(ptg -> {
            List<String> skus = productTypeRepository.findById(ptg.getProductType().getId())
                .orElseThrow(() -> new ObjectNotFoundException("product_type"))
                .getPrintFileFormats()
                .stream()
                .map(ProductTypePrintFileFormat::getSku)
                .collect(Collectors.toList());
            ptg.getPrintFileImages().forEach(printFileDetail -> {
                if (!skus.contains(isNew ? printFileDetail.getSku() : printFileDetail.getProductTypeSku())) {
                    throw new ObjectNotFoundException("print_file");
                }

                if (printFileDetail.getImage() != null) {
                    imageRepository.findById(StringUtils.defaultString(printFileDetail.getImage().getId(), ""))
                        .orElseThrow(() -> new ObjectNotFoundException("image"));
                }
            });
        });
    }

    private void updateProductTypeDetail(Product existProduct, Product product, boolean isUpdateVariant, boolean isUpdatePrintFile) {
        for (ProductTypeGroup ePtg : existProduct.getProductTypes()) {
            for (ProductTypeGroup ptg : product.getProductTypes()) {
                if (ePtg.getProductType().getId().equals(ptg.getProductType().getId())) {
                    if (isUpdateVariant) {
                        for (ProductVariantDetail variantDetail : ePtg.getVariantDetails()) {
                            ptg.getVariantDetails().stream()
                                .filter(pvd -> pvd.getSku().equals(variantDetail.getSku()))
                                .findFirst()
                                .ifPresent(pvd -> {
                                    variantDetail.setRegularPrice(pvd.getRegularPrice());
                                    variantDetail.setSalePrice(pvd.getSalePrice());
                                    variantDetail.setEnable(pvd.isEnable());
                                    variantDetail.setImageId(pvd.getImageId());
                                    variantDetail.setImagePosition(pvd.getImagePosition());
                                });
                        }
                    }

                    if (isUpdatePrintFile) {
                        for (ProductPrintFileDetail printFileDetail : ePtg.getPrintFileImages()) {
                            ptg.getPrintFileImages().stream()
                                .filter(pVD -> pVD.getUniqueKey().equals(printFileDetail.getUniqueKey()))
                                .findFirst()
                                .ifPresent(pVD -> {
                                    printFileDetail.setImage(pVD.isCustom() ? null : pVD.getImage());
                                    printFileDetail.setCustom(pVD.isCustom());
                                });
                        }
                        ptg.setFullDesign(ptg.getPrintFileImages()
                            .stream().noneMatch(design -> design.getImage() == null && !design.isCustom()));
                    }
                }
            }
        }
    }

    private void prepareImageUpload(Product product) {
        List<ProductImage> productImages = new ArrayList<>(product.getImages());

        //Add image from variant to list
        for (ProductTypeGroup productType : product.getProductTypes()) {
            for (ProductVariantDetail variantDetail : productType.getVariantDetails()) {
                if (!StringUtils.isEmpty(variantDetail.getImageId())) {
                    productImages.add(ProductImage.builder()
                        .image(imageRepository.findById(variantDetail.getImageId())
                            .orElseThrow(() -> new ObjectNotFoundException("image")))
                        .build());
                }
            }
        }

        //Filter list and add image position
        productImages = productImages.stream()
            .filter(distinctByKey(productImage -> productImage.getImage().getId()))
            .collect(Collectors.toList());
        for (int i = 0; i < productImages.size(); i++) {
            productImages.get(i).setImagePosition(i + 1);
        }

        product.setImages(productImages);
    }

    private <T> Predicate<T> distinctByKey(
        Function<? super T, ?> keyExtractor) {
        Map<Object, Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    private Product mapProduct(Object siteProduct, Site site, User user) {
        boolean isShopify = siteProduct instanceof ShopifyProductDTO;
        List<ProductImage> images = new ArrayList<>();
        if (isShopify && ((ShopifyProductDTO) siteProduct).getImages() != null) {
            int i = 1;
            for (ShopifyImageDTO shopifyImageDTO : ((ShopifyProductDTO) siteProduct).getImages()) {
                ImageUpload imageUpload = ImageUpload.builder()
                    .fileName("mockup-" + i++)
                    .thumbUrl(shopifyImageDTO.getSrc())
                    .imageUrl(shopifyImageDTO.getSrc())
                    .build();

                //Try to upload image from url
                try {
                    ImageUploadDTO dto = amazonS3Service.uploadFromUrl(shopifyImageDTO.getSrc());
                    imageUpload = ImageUpload.builder()
                        .fileName(dto.getFileName())
                        .imageUrl(dto.getImageUrl())
                        .thumbUrl(dto.getThumbUrl())
                        .build();
                } catch (Exception ex) {
                    log.error("Upload failure mapping image: {}", shopifyImageDTO.getSrc());
                }

                images.add(ProductImage.builder()
                    .image(imageRepository.save(imageUpload))
                    .imageId(shopifyImageDTO.getId())
                    .imagePosition(shopifyImageDTO.getPosition())
                    .build());
            }
        } else if (!isShopify && ((WooProduct) siteProduct).getImages() != null) {
            int i = 1;
            for (WooImage wooImage : ((WooProduct) siteProduct).getImages()) {
                ImageUpload imageUpload = ImageUpload.builder()
                    .fileName("mockup-" + i++)
                    .thumbUrl(wooImage.getSrc())
                    .imageUrl(wooImage.getSrc())
                    .build();

                //Try to upload image from url
                try {
                    ImageUploadDTO dto = amazonS3Service.uploadFromUrl(wooImage.getSrc());
                    imageUpload = ImageUpload.builder()
                        .fileName(dto.getFileName())
                        .imageUrl(dto.getImageUrl())
                        .thumbUrl(dto.getThumbUrl())
                        .build();
                } catch (Exception ex) {
                    log.error("Upload failure mapping image: {}", wooImage.getSrc());
                }

                images.add(ProductImage.builder()
                    .image(imageRepository.save(imageUpload))
                    .imageId(wooImage.getId())
                    .build());
            }
        }

        return Product.builder()
            .productId(isShopify ? ((ShopifyProductDTO) siteProduct).getId() : ((WooProduct) siteProduct).getId())
            .title(isShopify ? ((ShopifyProductDTO) siteProduct).getTitle() : ((WooProduct) siteProduct).getName())
            .description(isShopify ? ((ShopifyProductDTO) siteProduct).getBodyHtml() : ((WooProduct) siteProduct).getDescription())
            .email(user.getEmail())
            .user(user)
            .site(site)
            .images(images)
            .url(isShopify
                ? site.getUrl() + "/products/" + ((ShopifyProductDTO) siteProduct).getHandle()
                : ((WooProduct) siteProduct).getPermalink())
            .build();
    }
}
