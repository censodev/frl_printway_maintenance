package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.DailyStatistic;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.dto.OverviewStatisticDTO;
import com.goofinity.pgc_service.dto.RevenueProfitChartDTO;
import com.goofinity.pgc_service.dto.TopItemDTO;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.DailyStatisticRepository;
import com.goofinity.pgc_service.repository.ProductRepository;
import com.goofinity.pgc_service.repository.ProductTypeRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistic")
public class StatisticResource {
    private static final Logger log = LoggerFactory.getLogger(StatisticResource.class);
    private final DailyStatisticRepository dailyStatisticRepository;
    private final ProductRepository productRepository;
    private final ProductTypeRepository productTypeRepository;

    public StatisticResource(final DailyStatisticRepository dailyStatisticRepository,
                             final ProductRepository productRepository,
                             final ProductTypeRepository productTypeRepository) {
        this.dailyStatisticRepository = dailyStatisticRepository;
        this.productRepository = productRepository;
        this.productTypeRepository = productTypeRepository;
    }

    @GetMapping("/admin/overview")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<OverviewStatisticDTO> getOverviewStatisticForAdmin(@RequestParam Map<String, String> params) {
        log.debug("Get overview statistic for admin: {}", params);

        Instant startDate = params.get("startDate") != null
            ? Instant.parse(params.get("startDate"))
            : Instant.now().truncatedTo(ChronoUnit.DAYS).minus(60, ChronoUnit.DAYS);
        Instant endDate = params.get("endDate") != null
            ? Instant.parse(params.get("endDate"))
            : Instant.now().truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS).minus(1, ChronoUnit.SECONDS);

        List<DailyStatistic> dailyStatistics;
        String site = StringUtils.isEmpty(params.get("site")) ? null : params.get("site");
        String seller = StringUtils.isEmpty(site) ? params.get("seller") : null;
        if (!StringUtils.isEmpty(seller) || !StringUtils.isEmpty(site)) {
            dailyStatistics = dailyStatisticRepository.findStatistic(seller, site, startDate, endDate);
        } else {
            dailyStatistics = dailyStatisticRepository.findStatistic(RoleEnum.ROLE_ADMIN.name(), null, startDate, endDate);
        }

        return new ResponseEntity<>(resolveDataStatistic(dailyStatistics), HttpStatus.OK);
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<OverviewStatisticDTO> getOverviewStatisticForSeller(@RequestParam Map<String, String> params) {
        log.debug("Get overview statistic for seller: {}", params);

        String userEmail = SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        Instant startDate = params.get("startDate") != null
            ? Instant.parse(params.get("startDate"))
            : Instant.now().truncatedTo(ChronoUnit.DAYS).minus(60, ChronoUnit.DAYS);
        Instant endDate = params.get("endDate") != null
            ? Instant.parse(params.get("endDate"))
            : Instant.now().truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS).minus(1, ChronoUnit.SECONDS);

        List<DailyStatistic> dailyStatistics = dailyStatisticRepository.findStatistic(
            StringUtils.isEmpty(params.get("site")) ? userEmail : null,
            StringUtils.isEmpty(params.get("site")) ? null : params.get("site"), startDate, endDate);

        return new ResponseEntity<>(resolveDataStatistic(dailyStatistics), HttpStatus.OK);
    }

    @GetMapping("/admin/top-product")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<TopItemDTO>> topProductForAdmin() {
        log.debug("Top product for admin");

        List<TopItemDTO> dtos = new ArrayList<>();
        for (Product product : productRepository.findTopProduct(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "totalOrder")))) {
            dtos.add(TopItemDTO.builder()
                .title(product.getTitle())
                .value(product.getTotalOrder())
                .build());
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/admin/top-product-type")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<TopItemDTO>> topProductTypeForAdmin() {
        log.debug("Top product type for admin");

        List<TopItemDTO> dtos = new ArrayList<>();
        for (ProductType productType : productTypeRepository.findTopProductType(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "totalOrder")))) {
            dtos.add(TopItemDTO.builder()
                .title(productType.getTitle())
                .value(productType.getTotalOrder())
                .build());
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/top-product")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<List<TopItemDTO>> topProductForSeller() {
        log.debug("Top product for seller");

        List<TopItemDTO> dtos = new ArrayList<>();
        for (Product product : productRepository.findAllByEmail(SecurityUtils
            .getCurrentUserLogin().orElseThrow(SecurityException::new), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "totalOrder")))) {
            dtos.add(TopItemDTO.builder()
                .title(product.getTitle())
                .value(product.getTotalOrder())
                .build());
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    private OverviewStatisticDTO resolveDataStatistic(List<DailyStatistic> dailyStatistics) {
        OverviewStatisticDTO dto = OverviewStatisticDTO.builder()
            .revenueProfitChart(new ArrayList<>())
            .build();
        for (DailyStatistic dailyStatistic : dailyStatistics) {
            dto.setTotalOrder(dto.getTotalOrder() + dailyStatistic.getTotalOrders());
            dto.setTotalSeller(dto.getTotalSeller() + dailyStatistic.getTotalUsers());
            dto.setTotalProfit(dto.getTotalProfit() + dailyStatistic.getProfit());
            dto.setTotalRevenue(dto.getTotalRevenue() + dailyStatistic.getRevenue());
            dto.setTotalBalance(dto.getTotalBalance() + dailyStatistic.getTotalBalance());
            dto.setTotalCustomBalance(dto.getTotalCustomBalance() + dailyStatistic.getCustomBalance());
            dto.getRevenueProfitChart().add(RevenueProfitChartDTO.builder()
                .date(dailyStatistic.getStatisticDate())
                .profit(dailyStatistic.getProfit())
                .revenue(dailyStatistic.getRevenue())
                .build());

            if (dailyStatistic.getStatisticDate().equals(Instant.now().truncatedTo(ChronoUnit.DAYS))) {
                dto.setTodayTotalBalance(dailyStatistic.getTotalBalance());
                dto.setTodayTotalOrders(dailyStatistic.getTotalOrders());
                dto.setTodayTotalSeller(dailyStatistic.getTotalUsers());
                dto.setTodayTotalRevenue(dailyStatistic.getRevenue());
                dto.setTodayTotalProfit(dailyStatistic.getProfit());
                dto.setTodayCustomBalance(dailyStatistic.getCustomBalance());
            }
        }

        return dto;
    }
}
