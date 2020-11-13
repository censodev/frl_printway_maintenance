package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.Carrier;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypeCarrier;
import com.goofinity.pgc_service.dto.UserDTO;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.CarrierRepository;
import com.goofinity.pgc_service.repository.ProductTypeRepository;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.routines.UrlValidator;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/carrier")
public class CarrierResource {
    private static final Logger log = LoggerFactory.getLogger(CarrierResource.class);
    private final CarrierRepository carrierRepository;
    private final ProductTypeRepository productTypeRepository;

    public CarrierResource(final CarrierRepository carrierRepository,
                           final ProductTypeRepository productTypeRepository) {
        this.carrierRepository = carrierRepository;
        this.productTypeRepository = productTypeRepository;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Carrier> getCarrierById(@PathVariable String id) {
        log.debug("Get carrier by id: {}", id);
        return new ResponseEntity<>(carrierRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("carrier")), HttpStatus.OK);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<Carrier>> getCarriers() {
        log.debug("Get carriers");
        return new ResponseEntity<>(carrierRepository.findAllByActiveIsTrue(), HttpStatus.OK);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Page<Carrier>> getCategoriesByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                   @RequestParam Map<String, String> params) {
        log.debug("Get carriers with pagination: {}", pageable);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        return new ResponseEntity<>(carrierRepository.findAllByNameIgnoreCaseContainingOrCodeIgnoreCaseContaining(keyword, keyword, pageable), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Carrier> createCarrier(@Valid @RequestBody Carrier carrier) {
        log.debug("Create carrier: {}", carrier);

        if (carrierRepository.findByNameIgnoreCaseOrCodeIgnoreCase(carrier.getName(), carrier.getCode()).isPresent()) {
            throw new DuplicateDataException("name_or_code");
        }

        if (!new UrlValidator().isValid(carrier.getUrl())) {
            throw new InvalidDataException("url");
        }

        carrier.setActive(true);
        carrierRepository.save(carrier);
        return new ResponseEntity<>(carrier, HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Carrier> updateCarrier(@Valid @RequestBody Carrier carrier) {
        log.debug("Update carrier: {}", carrier);

        Carrier existCarrier = carrierRepository.findById(carrier.getId())
            .orElseThrow(() -> new ObjectNotFoundException("carrier"));

        if (carrierRepository.findByIdNotAndNameIgnoreCaseOrIdNotAndCodeIgnoreCase(carrier.getId(), carrier.getName(), carrier.getId(), carrier.getCode()).isPresent()) {
            throw new DuplicateDataException("name_or_code");
        }

        if (!new UrlValidator().isValid(carrier.getUrl())) {
            throw new InvalidDataException("url");
        }

        existCarrier.setName(carrier.getName());
        existCarrier.setCode(carrier.getCode());
        existCarrier.setUrl(carrier.getUrl());
        existCarrier.setDescription(carrier.getDescription());
        carrierRepository.save(existCarrier);
        return new ResponseEntity<>(existCarrier, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void deleteCarrierById(@PathVariable String id) {
        log.debug("Delete carrier by id: {}", id);

        Carrier carrier = carrierRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("carrier"));
        //Check order use carrier

        carrierRepository.delete(carrier);
    }

    @GetMapping("/active")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void activeCarrier(@RequestParam String id,
                              @RequestParam boolean active) {
        log.debug("Active carrier by id: {}", id);

        Carrier carrier = carrierRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("carrier"));
        carrier.setActive(active);
        carrierRepository.save(carrier);
    }

    @GetMapping("/list/assign")
    public ResponseEntity<List<Carrier>> getCarrierForLineItem(@Valid @RequestParam String productTypeId) {
        log.debug("Get carriers for assign line item");

        ProductType productType = productTypeRepository.findById(productTypeId)
            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

        return new ResponseEntity<>(productType.getCarriers()
            .stream().map(ProductTypeCarrier::getCarrier).collect(Collectors.toList()), HttpStatus.OK);
    }
}
