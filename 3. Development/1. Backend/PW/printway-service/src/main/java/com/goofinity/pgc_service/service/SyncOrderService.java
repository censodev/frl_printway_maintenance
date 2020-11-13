package com.goofinity.pgc_service.service;

import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.dto.shopify.ShopifyOrderPage;
import com.goofinity.pgc_service.dto.woo.WooOrder;
import com.goofinity.pgc_service.enums.ShopifyFinancialStatusEnum;
import com.goofinity.pgc_service.enums.WooStatusEnum;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class SyncOrderService {
    private static final Logger log = LoggerFactory.getLogger(SyncOrderService.class);
    private final WooService wooService;
    private final ShopifyService shopifyService;
    private final OrderService orderService;

    public SyncOrderService(final WooService wooService,
                            final ShopifyService shopifyService,
                            final OrderService orderService) {
        this.wooService = wooService;
        this.shopifyService = shopifyService;
        this.orderService = orderService;
    }

    public Instant syncWooOrderByStartDate(Site site) {
        int page = 1;
        Instant lastDate = site.getLastSyncOrderDate() == null
            ? Instant.now().minus(14, ChronoUnit.DAYS) : site.getLastSyncOrderDate();
        while (true) {
            List<WooOrder> wooOrders;
            try {
                wooOrders = wooService.getPaidOrdersFrom(site.getUrl(),
                    site.getConsumerKey(), site.getConsumerSecret(), site.getLastSyncOrderDate(), page++);
            } catch (Exception e) {
                log.error("Error when sync order for site: {} with msg: {}", site.getId(), e.getMessage());
                break;
            }

            if (wooOrders == null || wooOrders.isEmpty()) {
                break;
            }

            wooOrders.forEach(wooOrder -> {
                if (WooStatusEnum.PROCESSING.name().equalsIgnoreCase(wooOrder.getStatus())) {
                    try {
                        orderService.saveOrderWoo(wooOrder, site);
                    } catch (Exception e) {
                        log.error("Error when sync order: {} for site: {}", wooOrder.getId(), site.getId());
                    }
                }
            });
            Instant lastWooUpdatedDate = wooOrders.stream()
                .map(wooOrder -> StringUtils.isEmpty(wooOrder.getDateModifiedGmt())
                    ? Instant.now() : Instant.parse(wooOrder.getDateModifiedGmt() + "Z"))
                .max(Instant::compareTo)
                .orElse(lastDate);
            lastDate = lastWooUpdatedDate.isAfter(lastDate) ? lastWooUpdatedDate : lastDate;
        }
        return lastDate;
    }

    public Instant syncShopifyService(Site site) {
        Instant lastDate = site.getLastSyncOrderDate() == null
            ? Instant.now().minus(14, ChronoUnit.DAYS) : site.getLastSyncOrderDate();
        String pageInfo = null;
        while (true) {
            ShopifyOrderPage orderPage;
            try {
                orderPage = shopifyService.getPaidOrdersFrom(site.getShopUrl(), site.getAccessKey(),
                    pageInfo, lastDate);
                pageInfo = orderPage.getPageInfo();
            } catch (Exception e) {
                log.error("Error when sync order for site: {} with msg: {}", site.getId(), e.getMessage());
                break;
            }

            if (orderPage.getOrders().isEmpty()) {
                break;
            }

            orderPage.getOrders().forEach(shopifyOrder -> {
                if (ShopifyFinancialStatusEnum.PAID.getValue().equalsIgnoreCase(shopifyOrder.getFinancialStatus())
                    && StringUtils.isEmpty(shopifyOrder.getFulfillmentStatus())) {
                    try {
                        orderService.saveOrderShopify(shopifyOrder, site);
                    } catch (Exception e) {
                        log.error("Error when sync order: {} for site: {}", shopifyOrder.getId(), site.getId());
                    }
                }
            });

            Instant lastShopifyUpdatedDate = orderPage.getOrders().stream()
                .map(shopifyOrder -> StringUtils.isEmpty(shopifyOrder.getUpdatedAt())
                    ? Instant.now() : Instant.parse(shopifyOrder.getUpdatedAt().substring(0, 19) + "Z"))
                .max(Instant::compareTo)
                .orElse(lastDate);
            lastDate = lastShopifyUpdatedDate.isAfter(lastDate) ? lastShopifyUpdatedDate : lastDate;

            if (pageInfo == null) {
                break;
            }
        }
        return lastDate;
    }
}
