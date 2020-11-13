package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.ExportOrderHistory;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.ExportOrderHistoryRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/export-order-history")
public class ExportOrderHistoryResource {
    private static final Logger log = LoggerFactory.getLogger(ExportOrderHistoryResource.class);
    private final ExportOrderHistoryRepository exportOrderHistoryRepository;
    private final UserRepository userRepository;

    public ExportOrderHistoryResource(final ExportOrderHistoryRepository exportOrderHistoryRepository,
                                      final UserRepository userRepository) {
        this.exportOrderHistoryRepository = exportOrderHistoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<Page<ExportOrderHistory>> getExportOrderHistoriesByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                                        @RequestParam Map<String, String> params) {
        log.debug("Get export order history: {}", pageable);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));

        return new ResponseEntity<>(exportOrderHistoryRepository.findAllBySupplierIdAndCreatedDate(
            user.getId(), startDate, endDate, pageable), HttpStatus.OK);
    }

    @GetMapping("/admin/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<Page<ExportOrderHistory>> getExportOrderHistoriesByPaginationForAdmin(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                                                @RequestParam Map<String, String> params) {
        log.debug("Get export order history for admin: {}", pageable);

        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));

        return new ResponseEntity<>(exportOrderHistoryRepository.findAllBySupplierIdAndCreatedDate(
            params.get("supplierId"), startDate, endDate, pageable), HttpStatus.OK);
    }

    @GetMapping("/download")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public void downloadExportOrder(@RequestParam String id, HttpServletResponse response) throws IOException {
        log.debug("Download export order");

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        ExportOrderHistory exportOrderHistory = exportOrderHistoryRepository.findByIdAndSupplierId(id, user.getId())
            .orElseThrow(() -> new ObjectNotFoundException("export_order"));

        response.sendRedirect(exportOrderHistory.getUrl());
    }

    @GetMapping("/admin/download")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public void downloadExportOrderForAdmin(@RequestParam String id, HttpServletResponse response) throws IOException {
        log.debug("Download export order for admin");

        ExportOrderHistory exportOrderHistory = exportOrderHistoryRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("export_order"));

        response.sendRedirect(exportOrderHistory.getUrl());
    }
}
