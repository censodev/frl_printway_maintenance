package com.goofinity.pgc_service.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.goofinity.pgc_service.config.ApplicationProperties;
import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.dto.WooAddApiResponse;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.enums.SiteStatusEnum;
import com.goofinity.pgc_service.enums.SiteTypeEnum;
import com.goofinity.pgc_service.enums.StatisticFieldEnum;
import com.goofinity.pgc_service.repository.SiteRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.DailyStatisticService;
import com.goofinity.pgc_service.service.SequenceGeneratorService;
import com.goofinity.pgc_service.service.ShopifyService;
import com.goofinity.pgc_service.service.WooService;
import org.apache.commons.lang3.StringUtils;
import org.hashids.Hashids;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.MessageFormat;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/site")
public class SiteResource {
    private static final Logger log = LoggerFactory.getLogger(SiteResource.class);
    private final ApplicationProperties properties;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final ShopifyService shopifyService;
    private final WooService wooService;
    private final DailyStatisticService dailyStatisticService;
    private final SequenceGeneratorService sequenceGeneratorService;

    public SiteResource(final ApplicationProperties properties,
                        final SiteRepository siteRepository,
                        final UserRepository userRepository,
                        final ShopifyService shopifyService,
                        final WooService wooService,
                        final DailyStatisticService dailyStatisticService,
                        final SequenceGeneratorService sequenceGeneratorService) {
        this.properties = properties;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.shopifyService = shopifyService;
        this.wooService = wooService;
        this.dailyStatisticService = dailyStatisticService;
        this.sequenceGeneratorService = sequenceGeneratorService;

    }

    @GetMapping("/{id}")
    public ResponseEntity<Site> getSiteById(@PathVariable String id) {
        log.debug("Get site by id: {}", id);
        return new ResponseEntity<>(siteRepository.findByIdAndEmailIgnoreCase(id,
            SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("site")), HttpStatus.OK);
    }

    @GetMapping("/admin/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Page<Site>> getSiteForAdminByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                  @RequestParam Map<String, String> params) {
        log.debug("Get sites for admin with pagination: {}", pageable);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        String seller = params.get("seller");
        Instant startDate = StringUtils.isEmpty(params.get("startDate")) ? null : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate")) ? null : Instant.parse(params.get("endDate"));

        List<Boolean> statuses = getSiteStatus(params.get("status"));
        Page<Site> page = siteRepository.findAllForAdmin(keyword, seller, startDate, endDate, statuses.get(0), statuses.get(1), pageable);
        page.map(site -> {
            userRepository.findByEmailIgnoreCase(site.getEmail()).ifPresent(user -> {
                site.setFullName(user.getFullName());
            });
            return site;
        });
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<Page<Site>> getSiteByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                          @RequestParam Map<String, String> params) {
        log.debug("Get sites with pagination: {}", pageable);
        String email = SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        List<Boolean> statuses = getSiteStatus(params.get("status"));
        return new ResponseEntity<>(siteRepository.findAllForSeller(email, keyword, statuses.get(0), statuses.get(1), pageable), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Site>> getListSite() {
        log.debug("Get list site");
        return new ResponseEntity<>(siteRepository.findAllByEmail(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new)), HttpStatus.OK);
    }

    @GetMapping("/admin/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<Site>> getListSiteForAdmin() {
        log.debug("Get list site for admin");
        return new ResponseEntity<>(siteRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Site> createSite(@Validated @RequestBody Site site) throws MalformedURLException, JsonProcessingException {
        log.debug("Create site: {}", site);

        String email = SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        if ("http".equals(new URL(site.getUrl()).getProtocol())) {
            throw new InvalidDataException("not_https");
        }

        SiteTypeEnum.getByName(site.getSiteType()).orElseThrow(() -> new InvalidDataException("site_type"));

        String url = "https://" + new URL(site.getUrl()).getHost();
        if (siteRepository.countAllBySiteTypeAndUrlContainingAndDeletedIsFalse(site.getSiteType(), site.getUrl()) > 0) {
            throw new DuplicateDataException("site");
        }

        if (site.isVirtual() && siteRepository.countAllByEmailAndVirtualIsTrue(email) > 0) {
            throw new InvalidDataException("virtual_max_site");
        }

        site.setNumber(sequenceGeneratorService.generateSequence(Site.SEQUENCE_NAME));
        site.setAccessKey(site.isVirtual() ? "virtual" : null);
        site.setUrl(url);
        site.setEmail(email);
        site.setUniqueKey(new Hashids(Site.SALT, 7).encode(System.currentTimeMillis()));
        site.setActive(site.checkActive());
        site.setDeleted(false);
        site.setLastSyncOrderDate(Instant.now());
        siteRepository.save(site);

        dailyStatisticService.sendStatistic(email, null, StatisticFieldEnum.SITE.name());
        dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.SITE.name());
        return new ResponseEntity<>(site, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Site> updateSite(@RequestBody Site site) {
        log.debug("Update site: {}", site);
        Site existSite = siteRepository.findByIdAndEmailIgnoreCase(site.getId(), SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new)).orElseThrow(() -> new ObjectNotFoundException("site"));

        if (site.isDeleted()) {
            throw new InvalidDataException("site_removed");
        }

        if (StringUtils.isEmpty(site.getTitle())) {
            throw new InvalidDataException("title");
        }

        existSite.setTitle(site.getTitle());
        if (!existSite.isActive() && site.getSiteType() != null) {
            existSite.setUrl(site.getUrl());
            SiteTypeEnum.getByName(site.getSiteType()).orElseThrow(() -> new InvalidDataException("site_type"));
            existSite.setSiteType(site.getSiteType());
        }
        if (site.getOrderHoldingHour() >= 0) {
            existSite.setOrderHoldingHour(site.getOrderHoldingHour());
        }
        siteRepository.save(existSite);

        return new ResponseEntity<>(existSite, HttpStatus.OK);
    }

    @GetMapping("/shopify/api-key")
    public void updateShopifyApiKey(HttpServletResponse response,
                                    @RequestParam Map<String, String> params) throws IOException {
        log.info("Update api key: {}", params);

        siteRepository.findById(params.get("state")).ifPresent(site -> {
            if (!site.isDeleted() && !site.isActive()) {
                site.setShopUrl("https://" + params.get("shop"));
                if (siteRepository.countAllBySiteTypeAndShopUrlContainingAndDeletedIsFalse(site.getSiteType(), site.getShopUrl()) > 0) {
                    throw new DuplicateDataException("shop_url");
                }
                try {
                    site.setAccessKey(shopifyService.getAccessToken(site.getShopUrl(),
                        properties.getShopifyAppApiKey(),
                        properties.getShopifyAppApiSecret(),
                        params.get("code")));

                    site.setActive(site.checkActive());
                    site.setConnectDate(Instant.now());
                    siteRepository.save(site);

                    String webhook = "";
                    webhook += shopifyService.createWebhook("orders/paid",
                        properties.getUrl() + "/pgc-service/api/order/shopify",
                        site.getShopUrl(),
                        site.getAccessKey());
                    webhook += shopifyService.createWebhook("orders/updated",
                        properties.getUrl() + "/pgc-service/api/order/shopify",
                        site.getShopUrl(),
                        site.getAccessKey());
                    site.setWebhook(webhook);
                    site.setLocationId(shopifyService.getLocationId(site.getShopUrl(), site.getAccessKey()));
                    siteRepository.save(site);
                } catch (Exception e) {
                    log.error("Error when get access token: {}", e.getMessage());
                    throw new InvalidDataException("access_code");
                }
            }
        });

        response.sendRedirect(properties.getUrl() + "/sites");
    }

    @GetMapping("/shopify/locationId")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public void updateShopifyApiKey(@RequestParam String siteId) {
        log.debug("Get location id: {}", siteId);

        siteRepository.findById(siteId).ifPresent(site -> {
            try {
                site.setLocationId(shopifyService.getLocationId(site.getUrl(), site.getAccessKey()));
            } catch (IOException e) {
                throw new InvalidDataException("Error");
            }
            siteRepository.save(site);
        });
    }

    @PostMapping("/woo/api-key")
    public void updateWooApiKey(HttpServletResponse response,
                                @RequestBody WooAddApiResponse wooAddApiResponse) throws IOException {
        log.debug("Update woo api key: {}", wooAddApiResponse);

        siteRepository.findById(wooAddApiResponse.getUserId()).ifPresent(site -> {
            if (!site.isDeleted() && !site.isActive()) {
                try {
                    site.setConsumerKey(wooAddApiResponse.getConsumerKey());
                    site.setConsumerSecret(wooAddApiResponse.getConsumerSecret());
                    //Create webhook
                    String webhook = "";
                    webhook += wooService.createWebhook("Order created",
                        "order.created",
                        properties.getWooWebhookKey(),
                        properties.getUrl() + "/pgc-service/api/order/woo",
                        site.getUrl(),
                        wooAddApiResponse.getConsumerKey(),
                        wooAddApiResponse.getConsumerSecret());
                    webhook += wooService.createWebhook("Order updated",
                        "order.updated",
                        properties.getWooWebhookKey(),
                        properties.getUrl() + "/pgc-service/api/order/woo",
                        site.getUrl(),
                        wooAddApiResponse.getConsumerKey(),
                        wooAddApiResponse.getConsumerSecret());

                    site.setWebhook(webhook);
                    site.setActive(site.checkActive());
                    site.setConnectDate(Instant.now());
                    siteRepository.save(site);
                } catch (Exception ex) {
                    log.error("Error when get consumer key/scret: {}", ex.getMessage());
                    throw new InvalidDataException("consumer_key");
                }
            }
        });

        response.sendRedirect(properties.getUrl() + "/sites");
    }

    @GetMapping("/shopify/add-app")
    public void shopifyAddApp(HttpServletResponse response,
                              @RequestParam Map<String, String> params) throws IOException {
        Site site = siteRepository.findById(params.get("siteId")).orElseThrow(() -> new ObjectNotFoundException("site"));
        String url = "{0}/admin/oauth/authorize?client_id={1}&scope=write_products,write_orders,write_fulfillments,write_inventory&redirect_uri={2}/pgc-service/api/site/shopify/api-key&state={3}";
        response.sendRedirect(MessageFormat.format(url, site.getUrl(), properties.getShopifyAppApiKey(), properties.getUrl(), site.getId()));
    }

    @GetMapping("/woo/add-app")
    public void wooAddApp(HttpServletResponse response,
                          @RequestParam Map<String, String> params) throws IOException {
        Site site = siteRepository.findById(params.get("siteId")).orElseThrow(() -> new ObjectNotFoundException("site"));
        String url = "{0}/wc-auth/v1/authorize?app_name=PrintWay&scope=read_write&return_url={1}/bot&callback_url={2}/pgc-service/api/site/woo/api-key&user_id={3}";
        response.sendRedirect(MessageFormat.format(url, site.getUrl(), properties.getUrl(), properties.getUrl(), site.getId()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void removeSite(@PathVariable String id) {
        log.debug("Remove site: {}", id);
        Site site = siteRepository.findByIdAndEmailIgnoreCase(id, SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("site"));
        if (site.isDeleted()) {
            throw new InvalidDataException("site_removed");
        }
        site.setActive(false);
        site.setDeleted(true);
        site.setDeletedDate(Instant.now());
        siteRepository.save(site);
    }

    @PutMapping("/active/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void activeSite(@PathVariable String id) {
        log.debug("Active site: {}", id);

        Site site = siteRepository.findByIdAndEmailIgnoreCase(id, SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("site"));
        if (site.isDeleted()) {
            throw new InvalidDataException("site_removed");
        }

        site.setActive(!site.isActive());
        siteRepository.save(site);
    }

    @DeleteMapping("/admin/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public void removeSiteForAdmin(@PathVariable String id) {
        log.debug("Remove site for admin: {}", id);
        Site site = siteRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("site"));
        if (site.isDeleted()) {
            throw new InvalidDataException("site_removed");
        }
        site.setDeleted(true);
        site.setActive(false);
        site.setDeletedDate(Instant.now());
        siteRepository.save(site);
    }

    @PostMapping("/gdpr/webhook")
    @ResponseStatus(HttpStatus.OK)
    public void shopifyGdprWebhook() {
    }

    private List<Boolean> getSiteStatus(String status) {
        if (!StringUtils.isEmpty(status)) {
            if (SiteStatusEnum.getByName(status.toUpperCase()).isPresent()) {
                switch (SiteStatusEnum.getByName(status.toUpperCase()).get()) {
                    case ACTIVE:
                        return Arrays.asList(true, false);
                    case IN_ACTIVE:
                        return Arrays.asList(false, false);
                    case REMOVE:
                        return Arrays.asList(false, true);
                }
            }
        }

        return Arrays.asList(null, null);
    }
}
