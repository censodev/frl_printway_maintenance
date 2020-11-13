package com.goofinity.pgc_service.event.mappingProduct;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({MappingProductBinding.class})
public class MappingProductListener {
    private static final Logger log = LoggerFactory.getLogger(MappingProductListener.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final ProductService productService;

    public MappingProductListener(final ProductService productService) {
        this.productService = productService;
    }

    @StreamListener(MappingProductBinding.MAPPING_PRODUCT_RECEIVER_CHANNEL)
    public void processMappingProduct(String rawData) {
        try {
            Product product = objectMapper.readValue(rawData, Product.class);
            productService.updateProduct(product);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Error when update variant mapping product: {}", rawData);
        }
    }
}
