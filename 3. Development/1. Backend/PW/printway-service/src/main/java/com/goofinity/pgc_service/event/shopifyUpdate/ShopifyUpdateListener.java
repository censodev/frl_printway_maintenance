package com.goofinity.pgc_service.event.shopifyUpdate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.shopify.ShopifyUpdateDTO;
import com.goofinity.pgc_service.service.ShopifyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import java.io.IOException;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({ShopifyUpdateBinding.class})
public class ShopifyUpdateListener {
    private static final Logger log = LoggerFactory.getLogger(ShopifyUpdateListener.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final ShopifyService shopifyService;

    public ShopifyUpdateListener(final ShopifyService shopifyService) {
        this.shopifyService = shopifyService;
    }

    @StreamListener(ShopifyUpdateBinding.SHOPIFY_UPDATE_RECEIVER_CHANNEL)
    public void processTrackingBalance(String rawData) throws JsonProcessingException {
        ShopifyUpdateDTO dto = objectMapper.readValue(rawData, ShopifyUpdateDTO.class);

        if (dto.getAssignCatalogDTO() != null) {
            try {
                shopifyService.addProductToCollection(dto.getAssignCatalogDTO().getProductId(),
                    dto.getAssignCatalogDTO().getCollectionId(),
                    dto.getAssignCatalogDTO().getUrl(),
                    dto.getAssignCatalogDTO().getAccessToken());
            } catch (IOException e) {
                log.error("Error occur when add product to catalog: {}", rawData);
            }
        }

        if (dto.getUpdateVariantImageDTO() != null) {
            try {
                shopifyService.updateImageForVariant(dto.getUpdateVariantImageDTO().getVariantId(),
                    dto.getUpdateVariantImageDTO().getImageId(),
                    dto.getUpdateVariantImageDTO().getUrl(),
                    dto.getUpdateVariantImageDTO().getAccessToken());
            } catch (IOException e) {
                log.error("Error occur when update update variant image: {}", rawData);
            }
        }
    }
}
