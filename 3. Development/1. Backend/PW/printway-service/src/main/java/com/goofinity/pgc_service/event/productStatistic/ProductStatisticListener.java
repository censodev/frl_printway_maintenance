package com.goofinity.pgc_service.event.productStatistic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.ProductStatisticDTO;
import com.goofinity.pgc_service.repository.ProductRepository;
import com.goofinity.pgc_service.repository.ProductTypeRepository;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({ProductStatisticBinding.class})
public class ProductStatisticListener {
    private final ObjectMapper objectMapper = getObjectMapper();

    final ProductTypeRepository productTypeRepository;
    final ProductRepository productRepository;

    public ProductStatisticListener(final ProductTypeRepository productTypeRepository,
                                    final ProductRepository productRepository) {
        this.productTypeRepository = productTypeRepository;
        this.productRepository = productRepository;
    }

    @StreamListener(ProductStatisticBinding.PRODUCT_STATISTIC_RECEIVER_CHANNEL)
    public void processStatistic(String rawData) throws JsonProcessingException {
        ProductStatisticDTO dto = objectMapper.readValue(rawData, ProductStatisticDTO.class);
        if (dto.isProductType()) {
            productTypeRepository.findById(dto.getId()).ifPresent(productType -> {
                productType.setTotalOrder(productType.getTotalOrder() + 1);
                productTypeRepository.save(productType);
            });
        } else {
            productRepository.findById(dto.getId()).ifPresent(product -> {
                product.setTotalOrder(product.getTotalOrder() + 1);
                productRepository.save(product);
            });
        }
    }
}
