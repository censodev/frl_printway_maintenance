package com.goofinity.pgc_service.crons;

import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.enums.SiteTypeEnum;
import com.goofinity.pgc_service.repository.SiteRepository;
import com.goofinity.pgc_service.service.SyncOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;
import java.util.List;

@Configuration
public class SyncMissingOrderCron {
    private final Logger log = LoggerFactory.getLogger(SyncMissingOrderCron.class);

    private final int PAGE_SIZE = 100;
    private final SiteRepository siteRepository;
    private final SyncOrderService syncOrderService;

    public SyncMissingOrderCron(final SiteRepository siteRepository,
                                final SyncOrderService syncOrderService) {
        this.siteRepository = siteRepository;
        this.syncOrderService = syncOrderService;
    }

    @Scheduled(cron = "${application.cron.syncMissingOrder}")
    private void syncMissingOrder() {
        int page = 0;
        while (true) {
            List<Site> sites = siteRepository.findAllByActiveIsTrueAndSiteTypeNotContaining(
                SiteTypeEnum.VIRTUAL.name(),
                PageRequest.of(page++, PAGE_SIZE));

            if (sites.isEmpty()) {
                break;
            }

            for (Site site : sites) {
                if (site.getSiteType().equalsIgnoreCase(SiteTypeEnum.WOO.name())) {
                    Instant lastDate = syncOrderService.syncWooOrderByStartDate(site);
                    site.setLastSyncOrderDate(lastDate);
                    siteRepository.save(site);
                } else if (site.getSiteType().equalsIgnoreCase(SiteTypeEnum.SHOPIFY.name())) {
                    Instant lastDate = syncOrderService.syncShopifyService(site);
                    site.setLastSyncOrderDate(lastDate);
                    siteRepository.save(site);
                }
            }
        }
    }
}
