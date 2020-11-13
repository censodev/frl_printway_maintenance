package com.goofinity.pgc_service.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.goofinity.pgc_service.config.ApplicationProperties;
import com.goofinity.pgc_service.domain.*;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.dto.ExcelData;
import com.goofinity.pgc_service.dto.UserDTO;
import com.goofinity.pgc_service.enums.*;
import com.goofinity.pgc_service.repository.*;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.DailyStatisticService;
import com.goofinity.pgc_service.service.ExcelService;
import com.goofinity.pgc_service.util.DataUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.bson.types.ObjectId;
import org.hashids.Hashids;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/user")
public class UserResource {
    private static final Logger log = LoggerFactory.getLogger(UserResource.class);
    private final ApplicationProperties properties;
    private final UserRepository userRepository;
    private final SellerLevelRepository sellerLevelRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final NotificationSettingRepository notificationSettingRepository;
    private final LineItemStatisticRepository lineItemStatisticRepository;
    private final ProductTypeRepository productTypeRepository;
    private final ConfigRepository configRepository;
    private final ExcelService excelService;
    private final DailyStatisticService dailyStatisticService;

    public UserResource(final ApplicationProperties properties,
                        final UserRepository userRepository,
                        final SellerLevelRepository sellerLevelRepository,
                        final UserBalanceRepository userBalanceRepository,
                        final NotificationSettingRepository notificationSettingRepository,
                        final LineItemStatisticRepository lineItemStatisticRepository,
                        final ProductTypeRepository productTypeRepository,
                        final ConfigRepository configRepository,
                        final ExcelService excelService,
                        final DailyStatisticService dailyStatisticService) {
        this.properties = properties;
        this.userRepository = userRepository;
        this.sellerLevelRepository = sellerLevelRepository;
        this.userBalanceRepository = userBalanceRepository;
        this.notificationSettingRepository = notificationSettingRepository;
        this.lineItemStatisticRepository = lineItemStatisticRepository;
        this.productTypeRepository = productTypeRepository;
        this.configRepository = configRepository;
        this.excelService = excelService;
        this.dailyStatisticService = dailyStatisticService;
    }

    @GetMapping
    public ResponseEntity<UserDTO> getUserInfo() {
        log.debug("Get user info");

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        UserDTO dto = UserDTO.builder()
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .address(user.getAddress())
            .phone(user.getPhone())
            .dob(user.getDob())
            .fbLink(user.getFbLink())
            .roles(user.getRoles())
            .sellerLevel(user.getSellerLevel())
            .build();

        if (SecurityUtils.getCurrentUserRoles().contains(RoleEnum.ROLE_ADMIN.name())) {
            Config configAutoApprove = configRepository.findByKey(ConfigEnum.AUTO_APPROVE.name()).orElse(new Config());
            dto.setAutoApprove(Boolean.parseBoolean(configAutoApprove.getValue()));
        }

        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void updateUserInfo(@RequestBody UserDTO dto) {
        log.debug("Update user: {}", dto);

        if (SecurityUtils.getCurrentUserRoles().contains(RoleEnum.ROLE_SUPPLIER.name())) {
            return;
        }

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setAddress(dto.getAddress());
        user.setDob(dto.getDob());
        user.setFbLink(dto.getFbLink());

        if (SecurityUtils.getCurrentUserRoles().contains(RoleEnum.ROLE_ADMIN.name())
            && dto.getAutoApprove() != null) {
            Config configAutoApprove = configRepository.findByKey(ConfigEnum.AUTO_APPROVE.name()).orElse(new Config());
            configAutoApprove.setValue(dto.getAutoApprove().toString());
            configRepository.save(configAutoApprove);
        }

        userRepository.save(user);
    }

    @PostMapping("/sync")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void syncUser(@Valid @RequestBody User user,
                         @RequestHeader Map<String, String> headers) throws JsonProcessingException {
        log.debug("Sync user info: {}", user);

        if (!properties.getSecurityKey().equals(headers.get("security-key"))) {
            throw new SecurityException();
        }

        User existUser = userRepository.findByEmailIgnoreCase(user.getEmail())
            .orElse(null);

        if (existUser == null) {
            if (user.getRoles().size() != 1) {
                throw new InvalidDataException("only_one_role");
            }
            if (user.getSellerLevel() != null) {
                SellerLevel sellerLevel = sellerLevelRepository.findById(user.getSellerLevel().getId())
                    .orElseThrow(() -> new ObjectNotFoundException("seller_level"));
                user.setSellerLevel(sellerLevel);
                user.setForceSellerLevel(sellerLevel);
            }
            user.setUniqueKey(new Hashids(User.SALT, 7).encode(System.currentTimeMillis()));
            userRepository.save(user);

            if (!userBalanceRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
                userBalanceRepository.save(UserBalance.builder()
                    .email(user.getEmail())
                    .build());
            }

            if (!user.getRoles().contains(RoleEnum.ROLE_ADMIN_CONSTANT)) {
                List<Config> configs = new ArrayList<>(Arrays.asList(
                    Config.builder()
                        .key(ConfigEnum.NEWS_UPDATE_EMAIL.name())
                        .value("true")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.NEWS_UPDATE_PUSH.name())
                        .value("false")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_PROCESSING_EMAIL.name())
                        .value("true")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_PROCESSING_PUSH.name())
                        .value("false")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_SHIPPED_EMAIL.name())
                        .value("true")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_SHIPPED_PUSH.name())
                        .value("false")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.BALANCE_UPDATE_EMAIL.name())
                        .value("true")
                        .build(),
                    Config.builder()
                        .key(ConfigEnum.BALANCE_UPDATE_PUSH.name())
                        .value("false")
                        .build()
                ));

                if (user.getRoles().contains(RoleEnum.ROLE_SELLER_CONSTANT)) {
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_NEW_EMAIL.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_NEW_PUSH.name())
                        .value("false")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_PENDING_DESIGN_EMAIL.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_PENDING_DESIGN_PUSH.name())
                        .value("false")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_PENDING_EMAIL.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_PENDING_PUSH.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_ON_HOLD_EMAIL.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_ON_HOLD_PUSH.name())
                        .value("false")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_CANCEL_EMAIL.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_CANCEL_PUSH.name())
                        .value("false")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_REFUND_EMAIL.name())
                        .value("true")
                        .build());
                    configs.add(Config.builder()
                        .key(ConfigEnum.ORDER_UPDATE_REFUND_PUSH.name())
                        .value("false")
                        .build());

                    lineItemStatisticRepository.save(LineItemStatistic.builder()
                        .id(user.getEmail())
                        .statistic(ProduceStatusEnum.initStatusStatistic())
                        .build());
                } else if (user.getRoles().contains(RoleEnum.ROLE_SUPPLIER_CONSTANT)) {
                    lineItemStatisticRepository.save(LineItemStatistic.builder()
                        .id(user.getId())
                        .statistic(ProduceStatusEnum.initStatusStatistic())
                        .build());
                }

                notificationSettingRepository.save(NotificationSetting.builder()
                    .id(user.getId())
                    .configs(configs)
                    .build());
            }

            if (user.getRoles().contains(RoleEnum.ROLE_SELLER.name())) {
                dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.USER.name());
            }
        } else {
            existUser.setActivated(user.isActivated());
            existUser.setFirstName(user.getFirstName());
            existUser.setLastName(user.getLastName());
            existUser.setAddress(user.getAddress());
            existUser.setPhone(user.getPhone());
            existUser.setDob(user.getDob());
            existUser.setNote(user.getNote());
            existUser.setFbLink(user.getFbLink());

            if (user.getSellerLevel() != null) {
                SellerLevel sellerLevel = sellerLevelRepository.findById(user.getSellerLevel().getId())
                    .orElseThrow(() -> new ObjectNotFoundException("seller_level"));

                if (existUser.getSellerLevel() == null
                    || existUser.getSellerLevel().getTotalOrder() < sellerLevel.getTotalOrder()) {
                    existUser.setSellerLevel(sellerLevel);
                }
                existUser.setForceSellerLevel(sellerLevel);
            }

            userRepository.save(existUser);
        }
    }

    @PostMapping("/sync/lock")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void syncLockUser(@Valid @RequestBody User user,
                             @RequestHeader Map<String, String> headers) {
        log.debug("Sync lock user info: {}", user);

        if (!properties.getSecurityKey().equals(headers.get("security-key"))) {
            throw new SecurityException();
        }

        userRepository.findByEmailIgnoreCase(user.getEmail())
            .ifPresent(existUser -> {
                existUser.setActivated(user.isActivated());
                userRepository.save(existUser);
            });
    }

    @GetMapping("/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<Page<User>> getUsersWithPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                             @RequestParam Map<String, String> params) {
        log.debug("Get users with pagination: {}", pageable);

        return new ResponseEntity<>(getUsersPagination(pageable, params), HttpStatus.OK);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<User>> getUsersWithoutPagination(@RequestParam Map<String, String> params) {
        log.debug("Get users without pagination: {}", params);

        String role = params.get("role") != null ? params.get("role") : RoleEnum.ROLE_SELLER_CONSTANT;

        return new ResponseEntity<>(userRepository.findAllByActivatedTrueAndRolesContains(role), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
        log.debug("Get user by id: {}", id);

        return new ResponseEntity<>(userRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("user")), HttpStatus.OK);
    }

    @GetMapping("/admin/detail")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        log.debug("Get user by email: {}", email);

        return new ResponseEntity<>(userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ObjectNotFoundException("user")), HttpStatus.OK);
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportExcel(Pageable pageable,
                                                           @RequestParam Map<String, String> params) throws IOException {
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(Arrays.asList("Id", "Name", "Email", "Phone", "Address", "Total Order", "Sale Amount", "Level", "Roles", "Status")));
        List<User> users = getUsersPagination(PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort()), params).getContent();
        for (int i = 0; i < users.size(); i++) {
            excelData.getRowData().add(Arrays.asList("" + (i + 1),
                users.get(i).getFullName(),
                users.get(i).getEmail(),
                users.get(i).getPhone(),
                users.get(i).getAddress(),
                users.get(i).getTotalOrder() + "",
                users.get(i).getSaleAmount() + "",
                users.get(i).getSellerLevel() == null ? "" : users.get(i).getSellerLevel().getName(),
                String.join(", ", users.get(i).getRoles()),
                users.get(i).isActivated() ? "Active" : "Lock"));
        }
        Workbook workbook = excelService.exportExcel("Users", excelData);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        headers.add("Content-Disposition", "attachment; filename=users-" + DataUtil.formatter.format(Instant.now()) + ".xlsx");
        ByteArrayInputStream in = new ByteArrayInputStream(outputStream.toByteArray());

        return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
    }

    private Page<User> getUsersPagination(Pageable pageable, Map<String, String> params) {
        Boolean activatedList = params.get("activated") == null ? null : Boolean.parseBoolean(params.get("activated"));

        List<ObjectId> sellerLevelIds = params.get("sellerLevelIds") == null
            ? null
            : Stream.of(params.get("sellerLevelIds").split(",")).map(id -> new ObjectId(id.trim())).collect(Collectors.toList());

        List<String> roles = params.get("roles") == null
            ? null
            : Stream.of(params.get("roles").split(",")).map(s -> s.trim().toUpperCase()).collect(Collectors.toList());

        int fromSaleAmount = -1;
        int toSaleAmount = Integer.MAX_VALUE;
        if (params.get("fromSaleAmount") != null) {
            if (!NumberUtils.isDigits(params.get("fromSaleAmount"))) {
                throw new InvalidDataException("fromSaleAmount");
            }

            fromSaleAmount = Integer.parseInt(params.get("fromSaleAmount")) - 1;
        }

        if (params.get("toSaleAmount") != null) {
            if (!NumberUtils.isDigits(params.get("toSaleAmount"))) {
                throw new InvalidDataException("toSaleAmount");
            }

            toSaleAmount = Integer.parseInt(params.get("toSaleAmount")) + 1;
        }

        int fromNextLevelSaleAmount = -1;
        int toNextLevelSaleAmount = Integer.MAX_VALUE;
        if (params.get("nextLevelFilter") != null) {
            SellerLevel sellerLevel = sellerLevelRepository.findById(params.get("nextLevelFilter"))
                .orElseThrow(() -> new ObjectNotFoundException("seller_level"));

            fromNextLevelSaleAmount = (int) (sellerLevel.getTotalOrder() * (sellerLevel.getPercentToAlert() / 100)) - 1;
            toNextLevelSaleAmount = sellerLevel.getTotalOrder();
            sellerLevelIds = Collections.singletonList(new ObjectId(sellerLevel.getId()));
        }

        return userRepository.findAllByFilter(activatedList,
            sellerLevelIds, roles, fromSaleAmount, toSaleAmount, fromNextLevelSaleAmount, toNextLevelSaleAmount,
            StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword"), pageable);
    }

    @GetMapping("/supplier/list")
//    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<UserDTO>> getSuppliers() {
        log.debug("Get suppliers");
        List<User> suppliers = userRepository.findAllByActivatedTrueAndRolesContains(RoleEnum.ROLE_SUPPLIER.name());
        return new ResponseEntity<>(suppliers.stream().map(user -> UserDTO.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .build()).collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping("/supplier/assign")
//    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<UserDTO>> getSuppliersForLineItem(@Valid @RequestParam String productTypeId) {
        log.debug("Get suppliers for assign line item");

        ProductType productType = productTypeRepository.findById(productTypeId)
            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

        return new ResponseEntity<>(productType.getSuppliers().stream().map(user -> UserDTO.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .build()).collect(Collectors.toList()), HttpStatus.OK);
    }
}
