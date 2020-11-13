package com.goofinity.pgc_service.event.syncTracking;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.dto.SyncTrackingDTO;
import com.goofinity.pgc_service.dto.SyncTrackingLineItemDTO;
import com.goofinity.pgc_service.enums.SiteTypeEnum;
import com.goofinity.pgc_service.repository.OrderRepository;
import com.goofinity.pgc_service.repository.SiteRepository;
import com.goofinity.pgc_service.service.ShopifyService;
import com.goofinity.pgc_service.service.WooService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import java.util.Map;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({SyncTrackingBinding.class})
public class SyncTrackingListener {
    private static final Logger log = LoggerFactory.getLogger(SyncTrackingListener.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final SiteRepository siteRepository;
    private final OrderRepository orderRepository;
    private final ShopifyService shopifyService;
    private final WooService wooService;

    public SyncTrackingListener(final SiteRepository siteRepository,
                                final OrderRepository orderRepository,
                                final ShopifyService shopifyService,
                                final WooService wooService) {
        this.siteRepository = siteRepository;
        this.orderRepository = orderRepository;
        this.shopifyService = shopifyService;
        this.wooService = wooService;
    }

    @StreamListener(SyncTrackingBinding.SYNC_TRACKING_RECEIVER_CHANNEL)
    public void processShopifySyncTracking(String rawData) throws JsonProcessingException {
        SyncTrackingDTO dto = objectMapper.readValue(rawData, SyncTrackingDTO.class);
        Site site = siteRepository.findById(dto.getSiteId()).orElse(null);
        Order order = orderRepository.findById(dto.getOriginalOrderId()).orElse(null);
        if (site != null && order != null) {
            for (SyncTrackingLineItemDTO lineItemDTO : dto.getLineItems()) {
                order.getLineItems().stream()
                    .filter(lineItem -> lineItem.getSku().equals(lineItemDTO.getLineItemSku()))
                    .findFirst().ifPresent(lineItem -> {
                    try {
                        if (site.getSiteType().equals(SiteTypeEnum.SHOPIFY.name())) {
                            if (lineItem.getFulfillmentId() == null) {
                                String response = shopifyService.addTracking(site.getUrl(), site.getAccessKey(),
                                    dto.getOrderId(),
                                    lineItem.getId(),
                                    site.getLocationId(),
                                    lineItemDTO.getTrackingNumber(),
                                    lineItemDTO.getTrackingUrl());
                                Map<String, Object> data = objectMapper.readValue(response, Map.class);
                                lineItem.setFulfillmentId((Long) ((Map<String, Object>) data.get("fulfillment")).get("id"));
                                orderRepository.save(order);
                            } else {
                                shopifyService.updateTracking(site.getUrl(), site.getAccessKey(),
                                    dto.getOrderId(),
                                    lineItem.getFulfillmentId(),
                                    lineItemDTO.getTrackingNumber(),
                                    lineItemDTO.getTrackingUrl());
                            }
                        } else if (site.getSiteType().equals(SiteTypeEnum.WOO.name())) {
                            wooService.addNote(site.getUrl(), site.getConsumerKey(), site.getConsumerSecret(), order.getOrderId(),
                                "Update tracking"
                                    + "<br>- Line item sku: " + lineItem.getSku()
                                    + "<br>- Tracking number: " + lineItemDTO.getTrackingNumber()
                                    + "<br>- Tracking url: " + lineItemDTO.getTrackingUrl());
                        }
                    } catch (Exception e) {
                        log.error("Error occur when sync shopify tracking number: {}", rawData);
                    }
                });
            }
        }
    }
}
