package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.ProductStatisticDTO;
import com.goofinity.pgc_service.event.productStatistic.ProductStatisticBinding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding(ProductStatisticBinding.class)
@Service
public class ProductStatisticService {
    private final Logger log = LoggerFactory.getLogger(ProductStatisticService.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final MessageChannel messageChannel;

    public ProductStatisticService(final ProductStatisticBinding productStatisticBinding) {
        this.messageChannel = productStatisticBinding.publisher();
    }

    public void sendProductStatistic(boolean isProductType, String id) {
        try {
            messageChannel.send(MessageBuilder
                .withPayload(objectMapper.writeValueAsString(ProductStatisticDTO.builder()
                    .isProductType(isProductType)
                    .id(id)
                    .build()))
                .build());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
