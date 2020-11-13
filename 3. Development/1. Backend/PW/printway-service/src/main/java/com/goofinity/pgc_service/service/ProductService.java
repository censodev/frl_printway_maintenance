package com.goofinity.pgc_service.service;

import com.goofinity.pgc_service.domain.ProductPrintFileDetail;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductTypeGroup;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypeVariantDetail;
import com.goofinity.pgc_service.dto.woo.product.WooImage;
import com.goofinity.pgc_service.dto.woo.product.WooProduct;
import com.goofinity.pgc_service.enums.SiteTypeEnum;
import com.goofinity.pgc_service.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final WooService wooService;
    private final ShopifyService shopifyService;

    public ProductService(ProductRepository productRepository,
                          WooService wooService,
                          ShopifyService shopifyService) {
        this.productRepository = productRepository;
        this.wooService = wooService;
        this.shopifyService = shopifyService;
    }

    public Optional<ProductType> getProductTypeBySku(Product product, String sku) {
        ProductType productType = null;
        for (ProductTypeGroup pvg : product.getProductTypes()) {
            for (ProductVariantDetail item : pvg.getVariantDetails()) {
                if (sku.equals(item.getSku()) && item.isEnable()) {
                    productType = pvg.getProductType();
                    break;
                }
            }
        }
        return Optional.ofNullable(productType);
    }

    public Optional<ProductVariantDetail> getProductVariantDetailBySku(Product product, String sku) {
        ProductVariantDetail productVariantDetail = null;
        for (ProductTypeGroup pvg : product.getProductTypes()) {
            for (ProductVariantDetail item : pvg.getVariantDetails()) {
                if (sku.equals(item.getSku()) && item.isEnable()) {
                    productVariantDetail = item;
                    break;
                }
            }
        }
        return Optional.ofNullable(productVariantDetail);
    }

    public Optional<ProductTypeVariantDetail> getProductTypeVariantDetailBySku(ProductType productType, String sku) {
        return productType.getVariantDetails()
            .stream()
            .filter(productTypeVariantDetail -> productTypeVariantDetail.getSku().equals(sku))
            .findFirst();
    }

    public List<ProductPrintFileDetail> getProductPrintFile(Product product, String productTypeId) {
        return product.getProductTypes()
            .stream()
            .filter(productTypeGroup -> productTypeGroup.getProductType().getId().equals(productTypeId))
            .findFirst()
            .orElse(new ProductTypeGroup())
            .getPrintFileImages();
    }

    public int getNumberDesignMissing(String skuLineItem, Product product) {
        final int[] numberDesignMissing = {0};
        getProductTypeBySku(product, skuLineItem).ifPresent(productType -> {
            for (ProductTypeGroup pvg : product.getProductTypes()) {
                if (pvg.getProductType().getId().equals(productType.getId())) {
                    numberDesignMissing[0] = (int) pvg.getPrintFileImages()
                        .stream()
                        .filter(item -> item.getImage() == null || item.isCustom())
                        .count();
                    break;
                }
            }
        });

        return numberDesignMissing[0];
    }

    public void updateProduct(Product product) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        if (SiteTypeEnum.WOO.name().equals(product.getSite().getSiteType())) {
            wooService.updateAttributes(product.getSite().getUrl(), product.getSite().getConsumerKey(), product.getSite().getConsumerSecret(), product);
            wooService.updateVariant(product.getSite().getUrl(), product.getSite().getConsumerKey(), product.getSite().getConsumerSecret(),
                product.getProductId(), product, WooProduct.builder()
                    .images(product.getImages().stream()
                        .map(productImage -> WooImage.builder()
                            .id(productImage.getImageId())
                            .src(productImage.getImage().getThumbUrl())
                            .alt(productImage.getImage().getId())
                            .build())
                        .collect(Collectors.toList()))
                    .build(), product.getVariantIds());
            product.setSynced(true);
            product.setActivated(true);
            productRepository.save(product);
        } else if (SiteTypeEnum.SHOPIFY.name().equals(product.getSite().getSiteType())) {
            for (int i = 0; i < product.getImages().size(); i++) {
                product.getImages().get(i).setImagePosition(i + 1);
            }
            shopifyService.replaceOptionsAndVariants(product, product.getSite().getShopUrl(), product.getSite().getAccessKey());
            product.setSynced(true);
            product.setActivated(true);
            productRepository.save(product);
        }
    }
}
