package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.SellerLevel;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.SellerLevelRepository;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
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
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller-level")
public class SellerLevelResource {
    private static final Logger log = LoggerFactory.getLogger(SellerLevelResource.class);
    private final SellerLevelRepository sellerLevelRepository;

    public SellerLevelResource(final SellerLevelRepository sellerLevelRepository) {
        this.sellerLevelRepository = sellerLevelRepository;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<SellerLevel> getSellerLevelById(@PathVariable String id) {
        log.debug("Get seller level by id: {}", id);
        return new ResponseEntity<>(sellerLevelRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("seller_level")), HttpStatus.OK);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<SellerLevel>> getSellerLevels() {
        log.debug("Get seller levels");
        return new ResponseEntity<>(sellerLevelRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Page<SellerLevel>> getSellerLevelsByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                         @RequestParam Map<String, String> params) {
        log.debug("Get seller levels with pagination: {}", pageable);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        return new ResponseEntity<>(sellerLevelRepository.findAllByNameIgnoreCaseContaining(keyword, pageable), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<SellerLevel> createSellerLevel(@Valid @RequestBody SellerLevel sellerLevel) {
        log.debug("Create seller level: {}", sellerLevel);

        if (sellerLevelRepository.findByNameIgnoreCaseOrTotalOrder(sellerLevel.getName(), sellerLevel.getTotalOrder()).isPresent()) {
            throw new DuplicateDataException("name_or_total_order");
        }

        if (sellerLevel.getPercentToAlert() < 0 || sellerLevel.getPercentToAlert() > 100) {
            throw new InvalidDataException("percent_to_alert");
        }

        if (sellerLevel.getDiscountInUsd() < 0) {
            throw new InvalidDataException("discount_negative");
        }

        sellerLevel.setTotalSeller(0);
        sellerLevelRepository.save(sellerLevel);
        return new ResponseEntity<>(sellerLevel, HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<SellerLevel> updateSellerLevel(@Valid @RequestBody SellerLevel sellerLevel) {
        log.debug("Update seller level: {}", sellerLevel);

        SellerLevel existSellerLevel = sellerLevelRepository.findById(sellerLevel.getId())
            .orElseThrow(() -> new ObjectNotFoundException("sellerLevel"));

        if (sellerLevelRepository.findByIdNotAndNameIgnoreCaseOrIdNotAndTotalOrder(sellerLevel.getId(), sellerLevel.getName(),
            sellerLevel.getId(), sellerLevel.getTotalOrder()).isPresent()) {
            throw new DuplicateDataException("name_or_total_order");
        }

        if (sellerLevel.getPercentToAlert() < 0 || sellerLevel.getPercentToAlert() > 100) {
            throw new InvalidDataException("percent_to_alert");
        }

        if (sellerLevel.getDiscountInUsd() < 0) {
            throw new InvalidDataException("discount_negative");
        }

        existSellerLevel.setName(sellerLevel.getName());
        existSellerLevel.setPercentToAlert(sellerLevel.getPercentToAlert());
        existSellerLevel.setDiscountInUsd(sellerLevel.getDiscountInUsd());
        existSellerLevel.setTotalOrder(sellerLevel.getTotalOrder());
        sellerLevelRepository.save(existSellerLevel);
        return new ResponseEntity<>(existSellerLevel, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void deleteSellerLevelById(@PathVariable String id) {
        log.debug("Delete seller level by id: {}", id);

        SellerLevel sellerLevel = sellerLevelRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("seller_level"));
        if (sellerLevel.getTotalSeller() > 0) {
            throw new InvalidDataException("total_seller_more_than_zero");
        }

        sellerLevelRepository.delete(sellerLevel);
    }
}
