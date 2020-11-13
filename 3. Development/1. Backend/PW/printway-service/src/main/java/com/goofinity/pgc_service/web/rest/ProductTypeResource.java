package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.config.ApplicationProperties;
import com.goofinity.pgc_service.domain.Category;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.domain.Variant;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypePrintFileFormat;
import com.goofinity.pgc_service.domain.productType.ProductTypeVariantDetail;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.*;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.neovisionaries.i18n.CountryCode;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.hashids.Hashids;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/product-type")
public class ProductTypeResource {
    private static final Logger log = LoggerFactory.getLogger(ProductTypeResource.class);
    private final ApplicationProperties properties;
    private final ProductTypeRepository productTypeRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CarrierRepository carrierRepository;
    private final ImageUploadRepository imageUploadRepository;

    public ProductTypeResource(final ApplicationProperties properties,
                               final ProductTypeRepository productTypeRepository,
                               final ProductRepository productRepository,
                               final CategoryRepository categoryRepository,
                               final UserRepository userRepository,
                               final CarrierRepository carrierRepository,
                               final ImageUploadRepository imageUploadRepository) {
        this.properties = properties;
        this.productTypeRepository = productTypeRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.carrierRepository = carrierRepository;
        this.imageUploadRepository = imageUploadRepository;
    }

    @GetMapping("/country")
    public ResponseEntity<List<String>> getCountries() {
        log.debug("Get countries");
        List<String> countries = Stream.of(CountryCode.values()).map(CountryCode::getName).collect(Collectors.toList());
        countries.remove(0);
        return new ResponseEntity<>(countries, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductType> getProductTypeById(@PathVariable String id) {
        log.debug("Get product type by id: {}", id);
        return new ResponseEntity<>(productTypeRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("product_type")), HttpStatus.OK);
    }

    @GetMapping("/list/{categoryId}")
    public ResponseEntity<List<ProductType>> getProductTypeWithPagination(@PathVariable String categoryId) {
        log.debug("Get product types by category id: {}", categoryId);
        categoryRepository.findById(categoryId).orElseThrow(() -> new ObjectNotFoundException("category"));
        return new ResponseEntity<>(productTypeRepository.findAllByCategoryId(categoryId), HttpStatus.OK);
    }

    @GetMapping("/list/category")
    public ResponseEntity<List<Category>> getProductTypeGroupByCategory() {
        log.debug("Get product types group by category");
        return new ResponseEntity<>(categoryRepository.findAll()
            .stream()
            .peek(category -> category.setProductTypes(productTypeRepository.findAllByCategoryId(category.getId())
                .stream().filter(ProductType::isActive).collect(Collectors.toList())))
            .filter(category -> !category.getProductTypes().isEmpty())
            .sorted(Comparator.comparingInt(Category::getPriority))
            .collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<ProductType>> getProductTypeWithPagination(Pageable pageable,
                                                                          @RequestParam Map<String, String> params) {
        log.debug("Get product type with pagination: {}", params);

        ObjectId categoryId = params.get("categoryId") != null ? new ObjectId(params.get("categoryId")) : null;
        ObjectId supplierId = params.get("supplierId") != null ? new ObjectId(params.get("supplierId")) : null;
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");

        return new ResponseEntity<>(productTypeRepository.findAllWithPagination(categoryId, supplierId, keyword, pageable), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProductType>> getProductTypeWithoutPagination() {
        log.debug("Get product type without pagination");

        return new ResponseEntity<>(productTypeRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<ProductType> createProductType(@Valid @RequestBody ProductType productType) {
        log.debug("Create product type: {}", productType);

        productTypeRepository.findBySku(productType.getSku()).ifPresent(p -> {
            throw new DuplicateDataException("sku");
        });
        validateProductType(productType, true);

        categoryRepository.findById(productType.getCategory().getId()).ifPresent(category -> {
            category.setTotalProductType(category.getTotalProductType() + 1);
            categoryRepository.save(category);
        });
        productType.setActive(true);
        productType.setTotalOrder(0);
        return new ResponseEntity<>(productTypeRepository.save(productType), HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<ProductType> updateProductType(@Valid @RequestBody ProductType productType) {
        log.debug("Update product type: {}", productType);

        validateProductType(productType, false);
        ProductType existProductType = productTypeRepository.findById(productType.getId())
            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

        existProductType.setTitle(productType.getTitle());
        existProductType.setDescription(productType.getDescription());
        existProductType.setSuppliers(productType.getSuppliers());
        existProductType.setCarriers(productType.getCarriers());
        existProductType.setDefaultCarrier(productType.getDefaultCarrier());
        existProductType.setCategory(productType.getCategory());
        existProductType.setImages(productType.getImages());
        existProductType.setPrintFileFormats(productType.getPrintFileFormats());
        for (ProductTypePrintFileFormat printFileFormat : existProductType.getPrintFileFormats()) {
            printFileFormat.setSku(existProductType.getSku());
        }
        existProductType.setVariants(productType.getVariants());
        existProductType.setVariantDetails(productType.getVariantDetails());
        existProductType.setCountries(productType.getCountries());
        existProductType.setInclude(productType.isInclude());

        //Map variant of product types
        Map<String, ProductTypeVariantDetail> productTypeVariantMap = new HashMap<>();
        for (ProductTypeVariantDetail variantDetail : productType.getVariantDetails()) {
            productTypeVariantMap.put(variantDetail.getSku(), variantDetail);
        }

        //Update base cost of product
        int page = 0;
        while (true) {
            List<Product> products = productRepository.findAllByProductTypes_ProductType(productType, PageRequest.of(page++, 200));
            if (products.isEmpty()) {
                break;
            }

            for (Product product : products) {
                product.getProductTypes()
                    .stream()
                    .filter(productTypeGroup -> productTypeGroup.getProductType().getId().equalsIgnoreCase(existProductType.getId()))
                    .findFirst()
                    .ifPresent(productTypeGroup -> {
                        for (ProductVariantDetail variantDetail : productTypeGroup.getVariantDetails()) {
                            ProductTypeVariantDetail newVariant = productTypeVariantMap.get(variantDetail.getBaseSku());
                            if (newVariant != null) {
                                variantDetail.setBaseCost(newVariant.getBaseCost());
                            }
                        }
                    });
            }
            productRepository.saveAll(products);
        }

        return new ResponseEntity<>(productTypeRepository.save(existProductType), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void deleteProductType(@PathVariable String id) {
        log.debug("Delete product type: {}", id);

        if (productRepository.countAllByProductTypes_ProductTypeId(id) > 0) {
            throw new InvalidDataException("product_type_constrain");
        }
        ProductType productType = productTypeRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("productType"));
        productTypeRepository.delete(productType);
        categoryRepository.findById(productType.getCategory().getId()).ifPresent(category -> {
            category.setTotalProductType(category.getTotalProductType() - 1);
            categoryRepository.save(category);
        });
    }

    @PutMapping("/active")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void activeProductType(@RequestParam String id,
                                  @RequestParam String active) {
        log.debug("Active/Deactivate product type: {}", id);

        ProductType productType = productTypeRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("product"));
        productType.setActive(Boolean.parseBoolean(active));
        productTypeRepository.save(productType);
    }

    private void validateProductType(ProductType productType, boolean isNew) {
        productType.setSku(StringUtils.trim(productType.getSku().toUpperCase()).replace(" ", "-"));
        categoryRepository.findById(productType.getCategory().getId())
            .orElseThrow(() -> new ObjectNotFoundException("category"));

        //Check country
        if (productType.getCountries() != null) {
            for (String excludeCountry : productType.getCountries()) {
                if (CountryCode.findByName(excludeCountry).isEmpty()) {
                    throw new InvalidDataException("country");
                }
            }
        }

        //Check supplier is valid
        productType.getSuppliers().forEach(supplier -> {
            userRepository.findByIdAndRolesContains(supplier.getId(), RoleEnum.ROLE_SUPPLIER.name())
                .orElseThrow(() -> new ObjectNotFoundException("supplier." + supplier.getId()));
        });

        //Check default carrier exist in list carries
        productType.getCarriers()
            .stream()
            .filter(carrier -> {
                carrierRepository.findById(carrier.getCarrier().getId())
                    .orElseThrow(() -> new ObjectNotFoundException("carrier." + carrier.getCarrier().getId()));
                return carrier.getCarrier().getId().equals(productType.getDefaultCarrier().getId());
            })
            .findFirst()
            .orElseThrow(() -> new InvalidDataException("default_carrier"));

        //Validate image
        if (productType.getImages() != null) {
            productType.getImages().forEach(imageUpload -> {
                imageUploadRepository.findById(imageUpload.getId())
                    .orElseThrow(() -> new ObjectNotFoundException("image." + imageUpload.getId()));
            });
        }

        //Validate variant
        if (productType.getVariants().size() > 2) {
            throw new InvalidDataException("variant_max_size");
        }

        productType.getVariants().forEach(variant -> variant.setName(StringUtils.capitalize(variant.getName())));
        if (productType.getVariants().stream().map(Variant::getName).collect(Collectors.toSet()).size() != productType.getVariants().size()) {
            throw new DuplicateDataException("variant");
        }

        //Validate variant detail
        List<ProductTypeVariantDetail> variantDetails = generateVariantNames(productType.getSku(), productType.getVariants());
        if (variantDetails.stream().map(ProductTypeVariantDetail::getSku).collect(Collectors.toSet()).size() != variantDetails.size()) {
            throw new DuplicateDataException("variant_sku");
        }

        variantDetails.forEach(variantDetail -> {
            productType.getVariantDetails()
                .stream()
                .filter(vd -> (vd.getOption1() + vd.getOption2()).equalsIgnoreCase(variantDetail.getOption1() + variantDetail.getOption2()))
                .findFirst()
                .ifPresent(vd -> {
                    variantDetail.setBaseCost(vd.getBaseCost());
                    variantDetail.setRetailCost(vd.getRetailCost());
                    variantDetail.setSaleCost(vd.getSaleCost());
                    variantDetail.setSupplierCosts(vd.getSupplierCosts());
                    variantDetail.setEnable(vd.isEnable());
                });
        });

        //If supplier of variant detail not exist in list supplier -> throw error
        List<String> supplierIds = productType.getSuppliers().stream().map(User::getId).collect(Collectors.toList());
        productType.getVariantDetails().forEach(variantDetail -> {
            variantDetail.getSupplierCosts().forEach(variantSupplierCost -> {
                if (!supplierIds.contains(variantSupplierCost.getSupplier().getId())) {
                    throw new InvalidDataException("variant_detail.supplier." + variantSupplierCost.getSupplier().getId());
                }
            });
        });
        productType.setVariantDetails(variantDetails);

        //Design sku
        if (isNew) {
            productType.getPrintFileFormats().forEach(printFileFormat -> {
                printFileFormat.setSku(productType.getSku());
            });
        }
    }

    private List<ProductTypeVariantDetail> generateVariantNames(String parentSku, List<Variant> variants) {
        List<ProductTypeVariantDetail> variantOptions = variants.get(0).getOptions()
            .stream()
            .map(option -> ProductTypeVariantDetail
                .builder()
                .option1(StringUtils.capitalize(option))
                .sku(parentSku + properties.getSkuJoinSymbol() + StringUtils.capitalize(option))
                .build())
            .collect(Collectors.toList());

        for (int i = 1; i < variants.size(); i++) {
            List<ProductTypeVariantDetail> tempList = new ArrayList<>();
            for (String option : variants.get(i).getOptions()) {
                for (ProductTypeVariantDetail variantOption : variantOptions) {
                    String option2 = StringUtils.capitalize(option);
                    tempList.add(ProductTypeVariantDetail
                        .builder()
                        .option1(variantOption.getOption1())
                        .option2(option2)
                        .sku(variantOption.getSku() + properties.getSkuJoinSymbol() + option2)
                        .build());
                }
            }
            variantOptions = tempList;
        }
        return variantOptions;
    }
}
