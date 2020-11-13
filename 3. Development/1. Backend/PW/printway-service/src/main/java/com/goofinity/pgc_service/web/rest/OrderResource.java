package com.goofinity.pgc_service.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.config.ApplicationProperties;
import com.goofinity.pgc_service.domain.*;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypeCarrier;
import com.goofinity.pgc_service.domain.productType.ProductTypeVariantSupplierCost;
import com.goofinity.pgc_service.dto.*;
import com.goofinity.pgc_service.dto.shopify.ShopifyOrder;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceDTO;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceOrderDTO;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreDTO;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreWebhookDTO;
import com.goofinity.pgc_service.dto.woo.WooOrder;
import com.goofinity.pgc_service.enums.*;
import com.goofinity.pgc_service.repository.*;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.*;
import com.goofinity.pgc_service.util.DataUtil;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.validation.Valid;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.Stream;

import static com.goofinity.pgc_service.util.DataUtil.convertMapKeyIgnoreCase;
import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;
import static com.goofinity.pgc_service.util.NumberUtil.addDouble;
import static com.goofinity.pgc_service.util.NumberUtil.subtractDouble;

@RestController
@RequestMapping("/api/order")
public class OrderResource {
    private static final Logger log = LoggerFactory.getLogger(OrderResource.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final int PAGE_SIZE = 200;
    private final ApplicationProperties applicationProperties;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final SiteRepository siteRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final ProductTypeRepository productTypeRepository;
    private final LineItemStatisticRepository lineItemStatisticRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final OrderService orderService;
    private final ExcelService excelService;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final BalanceService balanceService;
    private final ExportOrderService exportOrderService;
    private final LineItemStatisticService lineItemStatisticService;
    private final UserService userService;
    private final AmazonSESService amazonSESService;

    public OrderResource(final ApplicationProperties applicationProperties,
                         final UserRepository userRepository,
                         final OrderRepository orderRepository,
                         final SiteRepository siteRepository,
                         final TransactionHistoryRepository transactionHistoryRepository,
                         final UserBalanceRepository userBalanceRepository,
                         final ProductTypeRepository productTypeRepository,
                         final LineItemStatisticRepository lineItemStatisticRepository,
                         final ProductRepository productRepository,
                         final ProductService productService,
                         final OrderService orderService,
                         final ExcelService excelService,
                         final SequenceGeneratorService sequenceGeneratorService,
                         final BalanceService balanceService,
                         final ExportOrderService exportOrderService,
                         final LineItemStatisticService lineItemStatisticService,
                         final UserService userService,
                         final AmazonSESService amazonSESService) {
        this.applicationProperties = applicationProperties;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.siteRepository = siteRepository;
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.userBalanceRepository = userBalanceRepository;
        this.productTypeRepository = productTypeRepository;
        this.lineItemStatisticRepository = lineItemStatisticRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.orderService = orderService;
        this.excelService = excelService;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.balanceService = balanceService;
        this.exportOrderService = exportOrderService;
        this.lineItemStatisticService = lineItemStatisticService;
        this.userService = userService;
        this.amazonSESService = amazonSESService;
    }

    @GetMapping("/admin/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Page<Order>> getOrdersByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                             @RequestParam Map<String, String> params) {
        log.debug("Get orders with pagination for admin: {}", pageable);

        User user = getCurrentUser();
        return new ResponseEntity<>(getOrdersPagination(user, pageable, params, null, true), HttpStatus.OK);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<Page<Order>> getOrdersByPaginationForSeller(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                      @RequestParam Map<String, String> params) {
        log.debug("Get orders with pagination for admin: {}", pageable);

        User user = getCurrentUser();
        return new ResponseEntity<>(getOrdersPagination(user, pageable, params, null, false), HttpStatus.OK);
    }

    @GetMapping("/supplier/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<Page<Order>> getOrdersByPaginationForSupplier(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                        @RequestParam Map<String, String> params) {
        log.debug("Get orders with pagination for admin: {}", pageable);

        User user = getCurrentUser();
        return new ResponseEntity<>(getOrdersPaginationForSupplier(user, pageable, params, true), HttpStatus.OK);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Order> getOrderByIdForAdmin(@PathVariable("id") String id) {
        log.debug("Get order detail for admin: {}", id);

        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("order"));
        return new ResponseEntity<>(updateOrderStatus(order), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") String id) {
        log.debug("Get order detail: {}", id);

        Order order = orderRepository.findByIdAndSellerEmail(id, SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("order"));

        return new ResponseEntity<>(updateOrderStatus(order), HttpStatus.OK);
    }

    private Order updateOrderStatus(Order order) {
        long count = order.getLineItems().stream()
            .filter(lineItem -> ProduceStatusEnum.getFinishOrderStatuses().contains(lineItem.getStatus()))
            .count();
        if (count == order.getLineItems().size()) {
            order.setStatus(OrderStatusEnum.COMPLETED.name());
        } else {
            order.setStatus(OrderStatusEnum.PROCESSING.name());
        }

        return order;
    }

    @PutMapping("/note")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public void updateNote(@Valid @RequestBody OrderNoteDTO orderNoteDTO) {
        log.debug("Update note for order: {}", orderNoteDTO);
        String userEmail = SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        Order order = orderRepository.findByIdAndSellerEmail(orderNoteDTO.getOrderId(), userEmail)
            .orElseThrow(() -> new ObjectNotFoundException("order"));
        order.setNote(orderNoteDTO.getNote());
        orderRepository.save(order);
    }

    @PutMapping("/shipping")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void updateShippingAddress(@Valid @RequestBody OrderShippingAddressDTO dto) {
        log.debug("Update shipping address for order: {}", dto);

        User user = getCurrentUser();
        List<String> roles = SecurityUtils.getCurrentUserRoles();
        Order order = (roles.contains(RoleEnum.ROLE_ADMIN.name())
            ? orderRepository.findById(dto.getOrderId())
            : orderRepository.findByIdAndSellerEmail(dto.getOrderId(), user.getEmail())).orElseThrow(() -> new ObjectNotFoundException("order"));

//        boolean isEnableEdit = true;
//        for (LineItem lineItem : order.getLineItems()) {
//            if (!ProduceStatusEnum.getBeforeProcessingStatuses().contains(lineItem.getStatus())) {
//                isEnableEdit = false;
//                break;
//            }
//        }
//
//        if (!isEnableEdit) {
//            throw new InvalidDataException("order_in_processing");
//        }

        order.setShippingAddress(Address.builder()
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .fullName(StringUtils.defaultString(dto.getFirstName(), "") + " " + StringUtils.defaultString(dto.getLastName(), ""))
            .phone(dto.getPhone())
            .address1(dto.getAddress1())
            .address2(dto.getAddress2())
            .postcode(dto.getPostcode())
            .province(dto.getProvince())
            .city(dto.getCity())
            .country(dto.getCountry())
            .build());
        order.addOrderLog(null, OrderLogTypeEnum.UPDATE_SHIPPING_ADDRESS.name(), null, user.getFullName());
        orderRepository.save(order);
    }

    @PutMapping("/design")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity updateMissingDesign(@Valid @RequestBody MissingDesignDTO dto) {
        log.debug("Update missing design: {}", dto);

        User user = getCurrentUser();
        orderService.updateMissingDesign(user, dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/admin/export")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<InputStreamResource> exportExcelForAdmin(Pageable pageable,
                                                                   @RequestBody(required = false) List<LineItemDTO> lineItemDTOs,
                                                                   @RequestParam Map<String, String> params) throws IOException {
        log.debug("Export order for admin");

        User user = getCurrentUser();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        headers.add("Content-Disposition", "attachment; filename=orders-" + DataUtil.formatter.format(Instant.now()) + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(exportOrderForAdminAndSeller(user, pageable, params, lineItemDTOs, true));
    }

    @PostMapping("/export")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<InputStreamResource> exportExcelForSeller(Pageable pageable,
                                                                    @RequestBody(required = false) List<LineItemDTO> lineItemDTOs,
                                                                    @RequestParam Map<String, String> params) throws IOException {
        log.debug("Export order for seller");

        User user = getCurrentUser();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        headers.add("Content-Disposition", "attachment; filename=orders-" + DataUtil.formatter.format(Instant.now()) + ".xlsx");
        return ResponseEntity.ok().headers(headers).body(exportOrderForAdminAndSeller(user, pageable, params, lineItemDTOs, false));
    }

    @PostMapping("/supplier/export")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<InputStreamResource> exportExcelForSupplier(@RequestBody(required = false) List<LineItemDTO> lineItemDTOs,
                                                                      @RequestParam Map<String, String> params) throws IOException {
        log.debug("Export order for supplier");

        User user = getCurrentUser();
        boolean isOnlyExport = Boolean.parseBoolean(params.get("onlyExport"));

        int page = 0;
        List<Order> orders = new ArrayList<>();
        while (true) {
            List<Order> tempOrders = getOrdersPaginationForSupplier(user, PageRequest.of(page++, PAGE_SIZE), params, false)
                .getContent();
            orders.addAll(tempOrders);

            if (tempOrders.isEmpty()) {
                break;
            }
        }

        //Filter processing order and create order export history -> upload amz
        if (!isOnlyExport) {
            exportOrderService.createExportOrderHistory(user, orders, lineItemDTOs);
        }

        //Export all order for supplier
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(exportOrderService.getSupplierExportHeader()));

        //Filter line item to export
        if (lineItemDTOs != null && !lineItemDTOs.isEmpty()) {
            orders = filterLineItemByExistList(orders, lineItemDTOs);
        }

        String itemStatus = StringUtils.isEmpty(params.get("itemStatus")) ? null : params.get("itemStatus").toUpperCase();
        List<String> statuses = StringUtils.isEmpty(itemStatus)
            ? ProduceStatusEnum.getSupplierStatuses()
            : Collections.singletonList(itemStatus);
        for (Order order : orders) {
            if (!isOnlyExport) {
                order.getLineItems().forEach(lineItem -> {
                    if (lineItem.isChangeToProd()) {
                        lineItem.setStatus(ProduceStatusEnum.PROCESSING.name());
                    }
                });
            }

            order.getLineItems()
                .removeIf(lineItem -> !user.getId().equals(lineItem.getSupplierId())
                    || !statuses.contains(lineItem.getStatus()));
        }
        orders.removeIf(order -> order.getLineItems().isEmpty());
        //End

        for (Order order : orders) {
            exportOrderService.resolveDataForSupplierExport(excelData, null, order, order.getLineItems());
        }

        Workbook workbook = excelService.exportExcel("Orders", excelData);
        String filename = "orders-" + DataUtil.formatter.format(Instant.now()) + ".xlsx";

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        InputStream in = new ByteArrayInputStream(outputStream.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        headers.add("Content-Disposition", "attachment; filename=" + filename);
        return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
    }

    @PostMapping("/tracking-more")
    @ResponseStatus(HttpStatus.OK)
    public void trackingMore(@RequestBody TrackingMoreWebhookDTO trackingMoreWebhookDTO) {
        log.debug("Tracking more webhook: {}", trackingMoreWebhookDTO);

        String trackingNumber = trackingMoreWebhookDTO.getData().getTrackingNumber();
        String carrierCode = trackingMoreWebhookDTO.getData().getCarrierCode();
        List<Order> orders = orderRepository.findByLineItemTrackingNumber(trackingNumber, carrierCode);
        for (Order order : orders) {
            for (LineItem lineItem : order.getLineItems()) {
                if (StringUtils.equals(lineItem.getTrackingNumber(), trackingNumber)
                    && StringUtils.equals(lineItem.getCarrierCode(), carrierCode)) {
                    lineItem.setTrackingStatus(trackingMoreWebhookDTO.getData().getStatus());
                }
            }
        }

        orderRepository.saveAll(orders);
    }

    @PostMapping("/woo")
    public ResponseEntity saveWooOrder(@RequestBody String rawData,
                                       @RequestHeader Map<String, String> headers) throws InvalidKeyException, NoSuchAlgorithmException, JsonProcessingException {
        log.debug("Tracking new Woo order");

        if (rawData.matches("^webhook_id=\\d+$")) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        headers = convertMapKeyIgnoreCase(headers);
        String shopTopic = headers.get("x-wc-webhook-topic");
        String shopHmacSha256 = headers.get("x-wc-webhook-signature");
        String shopDomain = headers.get("x-wc-webhook-source");

        String domain = shopDomain.substring(0, shopDomain.length() - 1);
        Site site = siteRepository.findBySiteTypeAndUrlContainingAndDeletedIsFalseAndActiveIsTrue(SiteTypeEnum.WOO.name(), domain).orElse(null);

        if (site == null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        if (!WooWebhookTopicEnum.UPDATED.getValue().equals(shopTopic)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        if (verifyWebHookData(applicationProperties.getWooWebhookKey(), rawData, shopHmacSha256)) {
            WooOrder wooOrder = objectMapper.readValue(rawData, WooOrder.class);

            if (!WooStatusEnum.PROCESSING.getValue().equals(wooOrder.getStatus())) {
                return new ResponseEntity<>(HttpStatus.OK);
            }

            orderService.saveOrderWoo(wooOrder, site);

            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/shopify")
    public ResponseEntity saveShopifyOrder(@RequestBody String rawData,
                                           @RequestHeader("X-Shopify-Topic") String shopTopic,
                                           @RequestHeader("X-Shopify-Hmac-Sha256") String shopHmacSha256,
                                           @RequestHeader("X-Shopify-Shop-Domain") String shopDomain) throws InvalidKeyException, NoSuchAlgorithmException, IOException {
        log.debug("Tracking new Shopify order");
        Site site = siteRepository.findBySiteTypeAndShopUrlContainingAndDeletedIsFalseAndActiveIsTrue(SiteTypeEnum.SHOPIFY.name(), shopDomain).orElse(null);

        if (site == null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        if (!ShopifyWebhookTopicEnum.UPDATED.getValue().equals(shopTopic)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        if (verifyWebHookData(applicationProperties.getShopifyAppApiSecret(), rawData, shopHmacSha256)) {
            ShopifyOrder shopifyOrder = objectMapper.readValue(rawData, ShopifyOrder.class);

            if (!(ShopifyFinancialStatusEnum.PAID.getValue().equalsIgnoreCase(shopifyOrder.getFinancialStatus())
                && StringUtils.isEmpty(shopifyOrder.getFulfillmentStatus()))) {
                return new ResponseEntity<>(HttpStatus.OK);
            }

            orderService.saveOrderShopify(shopifyOrder, site);

            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<List<OrderImportLineErrorDTO>> importOrder(@RequestParam String siteId,
                                                                     @RequestPart(value = "file") final MultipartFile multipartFile) throws IOException {
        log.debug("Import order");

        User user = getCurrentUser();
        if (!user.isActivated()) {
            throw new InvalidDataException("user_locked");
        }

        Site site = siteRepository.findByIdAndEmailIgnoreCase(siteId, SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("site"));

        XSSFWorkbook wb = new XSSFWorkbook(multipartFile.getInputStream());
        return new ResponseEntity<>(orderService.importOrder(wb, user, site), HttpStatus.OK);
    }

    @PostMapping("/admin/import")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<OrderImportLineErrorDTO>> adminImportOrder(@RequestParam String siteId,
                                                                          @RequestPart(value = "file") final MultipartFile multipartFile) throws IOException {
        log.debug("Import order for admin");

        Site site = siteRepository.findById(siteId).orElseThrow(() -> new ObjectNotFoundException("site"));
        User user = userRepository.findByEmailIgnoreCase(site.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("user"));

        if (!user.isActivated()) {
            throw new InvalidDataException("user_locked");
        }

        XSSFWorkbook wb = new XSSFWorkbook(multipartFile.getInputStream());
        return new ResponseEntity<>(orderService.importOrder(wb, user, site), HttpStatus.OK);
    }

    @PostMapping("/supplier/import-tracking")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<List<ImportTrackingErrorDTO>> importTrackingForSupplier(@RequestPart(value = "file") final MultipartFile multipartFile) throws IOException {
        log.debug("Import tracking number for supplier");

        XSSFWorkbook wb = new XSSFWorkbook(multipartFile.getInputStream());
        return new ResponseEntity<>(orderService.importTracking(wb), HttpStatus.OK);
    }

    @PostMapping("/admin/import-tracking")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<ImportTrackingErrorDTO>> importTrackingForAdmin(@RequestPart(value = "file") final MultipartFile multipartFile) throws IOException {
        log.debug("Import tracking number for admin");

        XSSFWorkbook wb = new XSSFWorkbook(multipartFile.getInputStream());
        return new ResponseEntity<>(orderService.importTracking(wb), HttpStatus.OK);
    }

    @PostMapping("/import/error")
    public ResponseEntity<InputStreamResource> importOrder(@RequestBody List<OrderImportLineErrorDTO> orderImportErrors) throws IOException {
        log.debug("Import order error");

        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Arrays.asList(Stream.of(ImportOrderCellEnum.values()).map(ImportOrderCellEnum::getTitle).collect(Collectors.toList())));
        for (OrderImportLineErrorDTO orderImportError : orderImportErrors) {
            excelData.getRowData().add(Arrays.asList(
                orderImportError.getOrderId(),
                orderImportError.getFirstName(),
                orderImportError.getLastName(),
                orderImportError.getCompany(),
                orderImportError.getAddress1(),
                orderImportError.getAddress2(),
                orderImportError.getCity(),
                orderImportError.getProvince(),
                orderImportError.getCountry(),
                orderImportError.getPostcode(),
                orderImportError.getPhone(),
                orderImportError.getItemSku(),
                orderImportError.getItemPrice(),
                orderImportError.getItemQuantity(),
                orderImportError.getShippingMethod(),
                orderImportError.getError()
            ));
        }

        Workbook workbook = excelService.exportExcel("Orders", excelData);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        headers.add("Content-Disposition", "attachment; filename=import_order_error-" + DataUtil.formatter.format(Instant.now()) + ".xlsx");
        ByteArrayInputStream in = new ByteArrayInputStream(outputStream.toByteArray());

        return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
    }

    @PutMapping("/on-hold")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public void setOnHold(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Set on hold for line item: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdInAndSellerEmail(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()), user.getEmail());
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (ProduceStatusEnum.getBeforeProcessingStatuses().contains(lineItem.getStatus())
                        && !lineItem.getStatus().equals(ProduceStatusEnum.ON_HOLD.name())
                        && !lineItem.getStatus().equals(ProduceStatusEnum.ACTION_REQUIRED.name())) {
                        // Request update statistic for line item status
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.ON_HOLD.name(), lineItem.getStatus());

                        lineItem.setPreStatus(lineItem.getStatus());
                        lineItem.setStatus(ProduceStatusEnum.ON_HOLD.name());
                        lineItem.setStatusNote(lineItemDTO.getNote());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.ON_HOLD.name(), lineItemDTO.getNote(), user.getFullName());

                        amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                    }
                });
            });
        }
        orderRepository.saveAll(orders);

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    @PutMapping("/on-hold/resolve")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public void resolveOnHold(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Resolve on hold for line item: {}", lineItemDTOs);

        solveOnHold(lineItemDTOs, false);
    }

    @PutMapping("/admin/on-hold/resolve")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void resolveOnHoldForAdmin(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Resolve on hold for admin for line item: {}", lineItemDTOs);

        solveOnHold(lineItemDTOs, true);
    }

    public void solveOnHold(List<LineItemDTO> lineItemDTOs, boolean isAdmin) {
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        Set<String> orderIds = lineItemDTOs.stream().map(LineItemDTO::getOrderId).collect(Collectors.toSet());
        List<Order> orders = isAdmin
            ? orderRepository.findAllByIdIn(orderIds)
            : orderRepository.findAllByIdInAndSellerEmail(orderIds, user.getEmail());
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (lineItem.getStatus().equals(ProduceStatusEnum.ON_HOLD.name())) {
                        changeStatusAfterResolve(lineItem);
                        lineItem.setPreStatus(null);
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.SOLVE_ON_HOLD.name(), lineItemDTO.getNote(), user.getFullName());

                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), ProduceStatusEnum.ON_HOLD.name());

                        checkStatusToSendMail(order, lineItem);
                    }
                });
            });
        }
        orderRepository.saveAll(orders);

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

        orderService.checkCoolingOffToPay(orders);
    }

    @PutMapping("/admin/action-required")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void setActionRequired(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Set action required for line item: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (ProduceStatusEnum.getBeforeProcessingStatuses().contains(lineItem.getStatus())
                        && !lineItem.getStatus().equals(ProduceStatusEnum.ON_HOLD.name())
                        && !lineItem.getStatus().equals(ProduceStatusEnum.ACTION_REQUIRED.name())) {
                        changeStatusAfterResolve(lineItem);
                        lineItem.setPreStatus(lineItem.getStatus());
                        lineItem.setStatus(ProduceStatusEnum.ACTION_REQUIRED.name());
                        lineItem.setStatusNote(lineItemDTO.getNote());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.ACTION_REQUIRE.name(), lineItemDTO.getNote(), user.getFullName());

                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), lineItem.getPreStatus());
                    }
                });
            });
        }
        orderRepository.saveAll(orders);

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    @PutMapping("/admin/action-required/resolve")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void resolveActionRequired(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Resolve action required for line item: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (lineItem.getStatus().equals(ProduceStatusEnum.ACTION_REQUIRED.name())) {
                        lineItem.setStatus(lineItem.getPreStatus());
                        lineItem.setPreStatus(null);
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.SOLVE_ACTION_REQUIRED.name(), lineItemDTO.getNote(), user.getFullName());

                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), ProduceStatusEnum.ACTION_REQUIRED.name());

                        checkStatusToSendMail(order, lineItem);
                    }
                });
            });
        }
        orderRepository.saveAll(orders);
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
        orderService.checkCoolingOffToPay(orders);
    }

    @PutMapping("/admin/refund")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void refundOrder(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Refund for line item: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (lineItem.getStatus().equals(ProduceStatusEnum.PROCESSING.name())) {
                        double amount = refundForSeller(order, lineItem);

                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.REFUNDED.name(), lineItem.getStatus());
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            null, lineItem.getStatus());
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            null, ProduceStatusEnum.ALL.name());

                        lineItem.setStatus(ProduceStatusEnum.REFUNDED.name());
                        order.addOrderLog(lineItemDTO.getItemSku(), OrderLogTypeEnum.REFUNDED.name(), amount + "");

                        amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                    } else {
                        throw new InvalidDataException("not_paid");
                    }
                });
            });
        }
        orderRepository.saveAll(orders);
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    private double refundForSeller(Order order, LineItem lineItem) {
        final double[] amount = {0};
        transactionHistoryRepository.findByOrderIdAndItemSkuAndTypeAndStatus(order.getId(), lineItem.getSku(), TransactionTypeEnum.PAID_ITEM.name(), TransactionStatusEnum.APPROVED.name())
            .ifPresent(transactionHistory -> amount[0] = transactionHistory.getAmount());

        if (amount[0] > 0) {
            UserBalance userBalance = balanceService.getBalanceOfUser(order.getSellerEmail());
            UserBalance adminBalance = balanceService.getBalanceOfUser(RoleEnum.ROLE_ADMIN.name());
            userBalance.setAvailableAmount(addDouble(userBalance.getAvailableAmount(), amount[0]));
            userBalance.setPaidAmount(subtractDouble(userBalance.getPaidAmount(), amount[0]));
            adminBalance.setPaidAmount(subtractDouble(adminBalance.getPaidAmount(), amount[0]));
            userBalanceRepository.saveAll(Arrays.asList(userBalance, adminBalance));

            transactionHistoryRepository.save(TransactionHistory.builder()
                .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
                .email(order.getSellerEmail())
                .createdByFullName(userService.getFullName(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new)))
                .type(TransactionTypeEnum.REFUND.name())
                .amount(amount[0])
                .status(TransactionStatusEnum.APPROVED.name())
                .orderId(order.getId())
                .itemSku(lineItem.getSku())
                .site(order.getSite())
                .lastChangeStatusDate(Instant.now())
                .build());

            //Resolve debt order
            Set<String> orderDebtIds = transactionHistoryRepository.findAllByEmailIgnoreCaseAndStatus(order.getSellerEmail(),
                TransactionStatusEnum.DEBT.name())
                .stream()
                .map(TransactionHistory::getOrderId)
                .collect(Collectors.toSet());
            for (Order debtOrder : orderRepository.findAllByIdIn(new ArrayList<>(orderDebtIds))) {
                orderService.paidForOrder(debtOrder);
            }
        }

        return amount[0];
    }

    @PutMapping("/admin/cancel")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void cancelOrderForAdmin(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Cancel order for admin: {}", lineItemDTOs);

        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        cancelOrder(orders, lineItemDTOs, user, false, true);
    }

    @PutMapping("/cancel")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public void cancelOrder(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Cancel order: {}", lineItemDTOs);

        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdInAndSellerEmail(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()), user.getEmail());
        cancelOrder(orders, lineItemDTOs, user, false, false);
    }

    @PutMapping("/supplier/cancel")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public void cancelOrderForSupplier(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Cancel order: {}", lineItemDTOs);

        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdInAndLineItems_SupplierId(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()), user.getId());
        cancelOrder(orders, lineItemDTOs, user, true, false);
    }

    private void cancelOrder(List<Order> orders, List<LineItemDTO> lineItemDTOs, User user, boolean isSupplier, boolean isAdmin) {
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            orders.stream()
                .filter(order -> order.getId().equals(lineItemDTO.getOrderId()))
                .findFirst().ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (isSupplier) {
                        if (ProduceStatusEnum.PROCESSING.name().equals(lineItem.getStatus())) {
                            lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                                ProduceStatusEnum.REQUEST_CANCEL.name(), lineItem.getStatus());
                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                ProduceStatusEnum.REQUEST_CANCEL.name(), lineItem.getStatus());

                            lineItem.setStatus(ProduceStatusEnum.REQUEST_CANCEL.name());
                            lineItem.setStatusNote(lineItemDTO.getNote());
                            order.addOrderLog(lineItemDTO.getItemSku(), OrderLogTypeEnum.SUPPLIER_REQUEST_CANCEL.name(), null, user.getFullName());
                        }
                    } else {
                        if ((isAdmin || !lineItem.isPaid())
                            && !ProduceStatusEnum.getFinishOrderStatuses().contains(lineItem.getStatus())) {
                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                ProduceStatusEnum.CANCELED.name(), lineItem.getStatus());

                            lineItem.setStatus(ProduceStatusEnum.CANCELED.name());
                            lineItem.setStatusNote(lineItemDTO.getNote());
                            order.addOrderLog(lineItemDTO.getItemSku(), OrderLogTypeEnum.CANCELED.name(), null, user.getFullName());

                            //Refund money for cancel line item
                            transactionHistoryRepository.findByOrderIdAndItemSkuAndType(order.getId(), lineItem.getSku(), TransactionTypeEnum.PAID_ITEM.name())
                                .ifPresent(transactionHistory -> {
                                    //Update balance
                                    UserBalance adminBalance = balanceService.getBalanceOfUser(RoleEnum.ROLE_ADMIN.name());
                                    adminBalance.setUpcomingAmount(subtractDouble(adminBalance.getUpcomingAmount(), transactionHistory.getAmount()));

                                    UserBalance sellerBalance = balanceService.getBalanceOfUser(transactionHistory.getEmail());
                                    sellerBalance.setUpcomingAmount(subtractDouble(sellerBalance.getUpcomingAmount(), transactionHistory.getAmount()));

                                    if (transactionHistory.getStatus().equalsIgnoreCase(TransactionStatusEnum.APPROVED.name())) {
                                        adminBalance.setAvailableAmount(addDouble(adminBalance.getAvailableAmount(), transactionHistory.getAmount()));
                                        sellerBalance.setAvailableAmount(addDouble(sellerBalance.getAvailableAmount(), transactionHistory.getAmount()));
                                    }

                                    userBalanceRepository.saveAll(Arrays.asList(sellerBalance, adminBalance));

                                    //Set status
                                    transactionHistory.setStatus(TransactionStatusEnum.REJECTED.name());
                                    transactionHistoryRepository.save(transactionHistory);
                                });

                            amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                        }
                    }
                });
            });
        }

        orderRepository.saveAll(orders);
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    @PutMapping("/admin/duplicate")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void duplicateOrderForAdmin(@RequestBody List<LineItemDTO> lineItemDTOs) throws JsonProcessingException {
        log.debug("Duplicate order for admin: {}", lineItemDTOs);

        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));

        orders.forEach(order -> {
            userRepository.findByEmailIgnoreCase(order.getSellerEmail()).ifPresent(user -> {
                if (!user.isActivated()) {
                    throw new InvalidDataException("user_locked");
                }
            });
        });

        duplicateOrder(orders, lineItemDTOs);
    }

    @PutMapping("/duplicate")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public void duplicateOrder(@RequestBody List<LineItemDTO> lineItemDTOs) throws JsonProcessingException {
        log.debug("Duplicate order: {}", lineItemDTOs);

        User user = getCurrentUser();
        if (!user.isActivated()) {
            throw new InvalidDataException("user_locked");
        }

        List<Order> orders = orderRepository.findAllByIdInAndSellerEmail(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()), user.getEmail());
        duplicateOrder(orders, lineItemDTOs);
    }

    private void duplicateOrder(List<Order> orders, List<LineItemDTO> lineItemDTOs) throws JsonProcessingException {
        Map<String, Order> newOrderMap = new HashMap<>();
        Map<String, LineItem> lineItemMap = new HashMap<>();
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();

        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            //Add new order to map, add line items of order to map to easy query
            if (newOrderMap.get(lineItemDTO.getOrderId()) == null) {
                orders.stream()
                    .filter(order -> order.getId().equals(lineItemDTO.getOrderId()))
                    .findFirst()
                    .ifPresent(order -> {
                        try {
                            order.setNumberOfDuplicated(order.getNumberOfDuplicated() + 1);

                            //Duplicate order
                            Order newOrder = objectMapper.readValue(objectMapper.writeValueAsString(order), Order.class);
                            newOrder.setSource(OrderSourceEnum.DUPLICATE.name());
                            newOrder.setOrderName(order.getOrderName() + StringUtils.repeat("-rs", order.getNumberOfDuplicated()));
                            newOrder.setParentId(newOrder.getId());
                            newOrder.setId(null);
                            newOrder.setIndexDuplicate(newOrder.getNumberOfDuplicated());
                            newOrder.setNumberOfDuplicated(0);
                            newOrder.setOrderLogs(new ArrayList<>());

                            //Add line items of order to map to easy query
                            for (LineItem lineItem : newOrder.getLineItems()) {
                                lineItemMap.put(order.getId() + "-" + lineItem.getSku(), lineItem);
                            }
                            newOrder.setLineItems(new ArrayList<>());

                            newOrder.setCoolingOffExp(Instant.now());
                            newOrderMap.put(order.getId(), newOrder);

                            userRepository.findByEmailIgnoreCase(newOrder.getSellerEmail()).ifPresent(user -> {
                                newOrder.setCoolingOff(order.getSite().getOrderHoldingHour() > 0);
                                newOrder.setCoolingOffExp(Instant.now().plus(order.getSite().getOrderHoldingHour(), ChronoUnit.HOURS));
                            });
                        } catch (JsonProcessingException e) {
                            log.error("Error occur when clone: {}", e.getMessage());
                        }
                    });
            }

            //Validate line item and add to order
            Order order = newOrderMap.get(lineItemDTO.getOrderId());
            LineItem lineItem = lineItemMap.get(lineItemDTO.getOrderId() + "-" + lineItemDTO.getItemSku());
            if (order != null && lineItem != null) {
                try {
                    Product product = productRepository.findBySku(lineItem.getSku())
                        .orElseThrow(() -> new ObjectNotFoundException("product"));
                    ProductVariantDetail productVariantDetail = productService.getProductVariantDetailBySku(product, lineItem.getSku())
                        .orElseThrow(() -> new ObjectNotFoundException("product_variant_detail"));

                    if (product.isActivated() && productVariantDetail.isEnable()) {
                        ProductType productType = productService.getProductTypeBySku(product, lineItem.getSku())
                            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

                        lineItem.setPreStatus(null);
                        lineItem.setStatusNote(null);
                        lineItem.setTrackingNumber(null);
                        lineItem.setTrackingUrl(null);
                        lineItem.setTrackingStatus(null);
                        lineItem.setExportOrderId(null);
                        lineItem.setSupplierId(null);
                        lineItem.setSupplier(null);
                        lineItem.setLastSentNotification(Instant.now());
                        lineItem.setLastSentSpreadHour(0);
                        lineItem.setPaid(false);
                        lineItem.setPaidAmount(0);
                        lineItem.setFulfillmentId(null);
                        lineItem.setId(null);
                        orderService.setCostForLineItem(lineItem, productType);

                        //Set status for line item
                        int numberDesignMissing = (int) lineItem.getPrintFileImages()
                            .stream()
                            .filter(productPrintFileDetail -> productPrintFileDetail.getImage() == null)
                            .count();
                        boolean isValidShippingCountry = orderService.isValidShippingCountry(order.getShippingAddress() == null ? "" : order.getShippingAddress().getCountry(),
                            productType.getCountries(), productType.isInclude());
                        String status = orderService.getLineItemStatus(numberDesignMissing, StringUtils.isEmpty(lineItem.getSupplierId()));
                        lineItem.setStatus(status);
                        lineItem.setPreStatus(isValidShippingCountry ? null : status);
                        lineItem.setStatusNote(isValidShippingCountry ? null : OrderLogTypeEnum.INVALID_SHIPPING_COUNTRY.name());
                        orderService.addLogForLineItem(status, isValidShippingCountry, lineItem.getSku(), order);
                        //End
                        order.getLineItems().add(lineItem);

                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), null);
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.ALL.name(), null);

                        if (order.getCoolingOffExp().isAfter(Instant.now())) {
                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                ProduceStatusEnum.COOLING_OFF.name(), null);
                        }
                    }
                } catch (Exception ex) {
                    log.error("Error when duplicate line item: {}", ex.getMessage());
                }
            }
        }

        List<Order> newOrders = newOrderMap.values().stream().filter(order -> !order.getLineItems().isEmpty()).collect(Collectors.toList());
        List<String> newOrderIds = newOrders.stream().map(Order::getParentId).collect(Collectors.toList());
        orderRepository.saveAll(newOrders);
        orderRepository.saveAll(orders.stream().filter(order -> newOrderIds.contains(order.getId())).collect(Collectors.toList()));
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);

        orderService.checkCoolingOffToPay(newOrders);

        for (Order newOrder : newOrders) {
            //Statistic for admin
            orderService.sendOrderStatistic(newOrder.getSite());

            amazonSESService.sendEmailAfterNewOrderForSeller(newOrder);
        }
    }

    @PutMapping("/admin/assign-supplier")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void assignSupplierForAdmin(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Assign supplier: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (!ProduceStatusEnum.getAfterInProductionStatuses().contains(lineItem.getStatus())
                        && !ProduceStatusEnum.getOnHoldStatuses().contains(lineItem.getStatus())) {
                        ProductType productType = productTypeRepository.findById(lineItem.getProductTypeId())
                            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

                        User supplier = productType.getSuppliers()
                            .stream()
                            .filter(sp -> sp.getId().equals(lineItemDTO.getAssignId()))
                            .findFirst()
                            .orElseThrow(() -> new InvalidDataException("product_type_not_contain_supplier"));
                        ProductTypeVariantSupplierCost productTypeVariantSupplierCost = productType.getVariantDetails()
                            .stream()
                            .filter(variantDetail -> variantDetail.getSku().equals(lineItem.getBaseSku()))
                            .findFirst()
                            .orElseThrow(() -> new ObjectNotFoundException("line_item_in_product_type"))
                            .getSupplierCosts()
                            .stream()
                            .filter(variantSupplierCost -> variantSupplierCost.getSupplier().getId().equals(lineItemDTO.getAssignId()))
                            .findFirst()
                            .orElseThrow(() -> new ObjectNotFoundException("supplier_cost"));

                        lineItem.setSupplier(supplier.getFullName());
                        lineItem.setSupplierId(supplier.getId());
                        lineItem.setSupplierCost(productTypeVariantSupplierCost.getCost());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.CHOOSE_SUPPLIER.name(), supplier.getFullName(), user.getFullName());

                        Optional<TransactionHistory> transactionHistory = transactionHistoryRepository.findByOrderIdAndItemSkuAndType(order.getId(), lineItem.getSku(), TransactionTypeEnum.PAID_ITEM.name());
                        if (transactionHistory.isPresent()
                            && transactionHistory.get().getStatus().equalsIgnoreCase(TransactionStatusEnum.APPROVED.name())) {
                            lineItem.setStatus(ProduceStatusEnum.PROCESSING.name());
                            order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.PROCESSING.name(), null);

                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                lineItem.getStatus(), ProduceStatusEnum.CHOOSE_SUPPLIER.name());
                            lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                                lineItem.getStatus(), null);
                            lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                                ProduceStatusEnum.ALL.name(), null);

                            amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                            amazonSESService.sendEmailAfterChangeStatusForSupplier(order, lineItem);
                        } else {
                            if (lineItem.getNumberDesignMissing() == 0) {
                                if (!(ProduceStatusEnum.NEED_PAY.name().equalsIgnoreCase(lineItem.getStatus())
                                    || ProduceStatusEnum.NEED_PAY.name().equalsIgnoreCase(lineItem.getPreStatus()))) {
                                    lineItem.setStatus(ProduceStatusEnum.NEED_PAY.name());
                                    order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.NEED_PAY_COOLING_OFF.name(), null);
                                    lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                        lineItem.getStatus(), ProduceStatusEnum.CHOOSE_SUPPLIER.name());
                                }
                            } else {
                                lineItem.setStatus(ProduceStatusEnum.PENDING_DESIGN.name());
                                order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.PENDING_DESIGN.name(), null);

                                amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                            }
                        }
                    }
                });
            });
        }
        orderRepository.saveAll(orders);
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
        orderService.checkCoolingOffToPay(orders);
    }

    @GetMapping("/carrier/list")
    public ResponseEntity<List<Carrier>> getListCarrierByProductType(@RequestParam String productTypeId) {
        log.debug("Get list carrier by product type id: {}", productTypeId);

        ProductType productType = productTypeRepository.findById(productTypeId)
            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

        productType.getCarriers().forEach(productTypeCarrier -> {
            productTypeCarrier.getCarrier().setCost(productTypeCarrier.getCost());
        });
        return new ResponseEntity<>(productType.getCarriers().stream().map(ProductTypeCarrier::getCarrier)
            .collect(Collectors.toList()), HttpStatus.OK);
    }

    @PutMapping("/admin/assign-carrier")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void assignCarrierForAdmin(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Assign carrier for admin: {}", lineItemDTOs);

        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        assignCarrier(lineItemDTOs, orders, user.getFullName());
    }

    @PutMapping("/assign-carrier")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public void assignCarrierForSeller(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Assign carrier for admin: {}", lineItemDTOs);

        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdInAndSellerEmail(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()), user.getEmail());
        assignCarrier(lineItemDTOs, orders, user.getFullName());
    }

    private void assignCarrier(List<LineItemDTO> lineItemDTOs, List<Order> orders, String assignAuthor) {
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (!ProduceStatusEnum.getExcludeChangeCarrierStatus().contains(lineItem.getStatus())
                        && !ProduceStatusEnum.getOnHoldStatuses().contains(lineItem.getStatus())) {
                        ProductType productType = productTypeRepository.findById(lineItem.getProductTypeId())
                            .orElseThrow(() -> new ObjectNotFoundException("product_type"));

                        ProductTypeCarrier carrierCost = productType.getCarriers()
                            .stream()
                            .filter(productTypeCarrier -> productTypeCarrier.getCarrier().getId().equals(lineItemDTO.getAssignId()))
                            .findFirst()
                            .orElseThrow(() -> new InvalidDataException("product_type_not_contain_supplier"));

                        boolean isFirstCarrier = StringUtils.isEmpty(lineItem.getCarrierId());
                        lineItem.setCarrierId(carrierCost.getCarrier().getId());
                        lineItem.setCarrier(carrierCost.getCarrier().getName());
                        lineItem.setCarrierCode(carrierCost.getCarrier().getCode());
                        lineItem.setCarrierCost(carrierCost.getCost());

                        if (isFirstCarrier) {
                            order.setTotal(order.getLineItems().stream()
                                .flatMapToDouble(lI -> DoubleStream.of(lI.getQuantity() * (NumberUtils.toDouble(lI.getPrice(), 0) - order.getDiscount() + lI.getCarrierCost())))
                                .sum());

                            order.setTotalBaseCost(order.getLineItems().stream()
                                .flatMapToDouble(lI -> DoubleStream.of(lI.getQuantity() * (lI.getBaseCost() - order.getDiscount() + lI.getCarrierCost())))
                                .sum());
                        }
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.CHOOSE_CARRIER.name(), carrierCost.getCarrier().getName(), assignAuthor);
                    }
                });
            });
        }
        orderRepository.saveAll(orders);
    }

    @PutMapping("/admin/request-cancel/approve")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void approveRequestCancel(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Approve supplier request cancel for line item: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (ProduceStatusEnum.REQUEST_CANCEL.name().contains(lineItem.getStatus())) {
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.CHOOSE_SUPPLIER.name(), lineItem.getStatus());
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            null, ProduceStatusEnum.REQUEST_CANCEL.name());
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            null, ProduceStatusEnum.ALL.name());

                        lineItem.setPreStatus(lineItem.getStatus());
                        lineItem.setStatus(ProduceStatusEnum.CHOOSE_SUPPLIER.name());
                        lineItem.setSupplierId(null);
                        lineItem.setSupplier(null);
                        lineItem.setSupplierCost(0);
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.APPROVED_REQUEST_CANCEL.name(), lineItemDTO.getNote(), user.getFullName());

                        amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                    }
                });
            });
        }
        orderRepository.saveAll(orders);
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    @PutMapping("/admin/request-cancel/reject")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void rejectRequestCancel(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Reject supplier request cancel for line item: {}", lineItemDTOs);

        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));
        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if (ProduceStatusEnum.REQUEST_CANCEL.name().contains(lineItem.getStatus())) {
                        // Auto refund for Seller
                        double amount = refundForSeller(order, lineItem);

                        order.addOrderLog(lineItemDTO.getItemSku(), OrderLogTypeEnum.AUTO_REFUNDED.name(), amount + "");

                        lineItem.setPreStatus(lineItem.getStatus());
                        lineItem.setStatus(ProduceStatusEnum.CANCELED.name());
                        lineItem.setStatusNote(lineItemDTO.getNote());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.REJECTED_REQUEST_CANCEL.name(), lineItemDTO.getNote(), user.getFullName());

                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            lineItem.getStatus(), lineItem.getPreStatus());
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            lineItem.getStatus(), lineItem.getPreStatus());

                        amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                        amazonSESService.sendEmailAfterChangeStatusForSupplier(order, lineItem);
                    }
                });
            });
        }
        orderRepository.saveAll(orders);
        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    @PutMapping("/admin/assign-tracking")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public void assignTrackingForLineItem(@RequestBody List<LineItemDTO> lineItemDTOs) {
        log.debug("Assign tracking for line item: {}", lineItemDTOs);

        Map<String, TrackingMoreDTO> trackingMap = new HashMap<>();
        Map<String, SupplierBalanceDTO> supplierBalanceMap = new HashMap<>();
        Map<String, SyncTrackingDTO> syncTrackingMap = new HashMap<>();
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findAllByIdIn(lineItemDTOs.stream()
            .map(LineItemDTO::getOrderId).collect(Collectors.toSet()));

        for (LineItemDTO lineItemDTO : lineItemDTOs) {
            getOrderByOrderId(orders, lineItemDTO.getOrderId()).ifPresent(order -> {
                SyncTrackingDTO syncTrackingDTO = syncTrackingMap.computeIfAbsent(order.getId(), s -> SyncTrackingDTO.builder()
                    .siteId(order.getSite().getId())
                    .originalOrderId(order.getId())
                    .orderId(order.getOrderId())
                    .lineItems(new ArrayList<>())
                    .build());

                orderService.getLineItemInOrderBySku(order, lineItemDTO.getItemSku()).ifPresent(lineItem -> {
                    if ((ProduceStatusEnum.IN_PRODUCTION.name().contains(lineItem.getStatus())
                        || ProduceStatusEnum.SHIPPED.name().contains(lineItem.getStatus()))
                        && !StringUtils.isEmpty(lineItemDTO.getTrackingNumber())
                        && !StringUtils.isEmpty(lineItemDTO.getTrackingUrl())) {

                        String lastTrackingNumber = lineItem.getTrackingNumber();
                        String lastTrackingUrl = lineItem.getTrackingUrl();
                        lineItem.setTrackingNumber(lineItemDTO.getTrackingNumber());
                        lineItem.setTrackingUrl(StringUtils.isEmpty(lineItemDTO.getTrackingUrl())
                            ? "https://www.trackingmore.com/en/" + lineItemDTO.getTrackingNumber() : lineItemDTO.getTrackingUrl());

                        trackingMap.computeIfAbsent(lineItemDTO.getTrackingNumber(), s -> TrackingMoreDTO.builder()
                            .carrierCode(lineItem.getCarrierCode())
                            .trackingNumber(lineItemDTO.getTrackingNumber())
                            .orderId(order.getOrderNumber())
                            .comment(order.getId())
                            .title(order.getOrderName())
                            .build());

                        if (ProduceStatusEnum.IN_PRODUCTION.name().equalsIgnoreCase(lineItem.getStatus())) {
                            lineItem.setStatus(ProduceStatusEnum.SHIPPED.name());
                            order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.SHIPPED.name(), lineItemDTO.getNote());

                            lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                                lineItem.getStatus(), ProduceStatusEnum.IN_PRODUCTION.name());
                            lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                                lineItem.getStatus(), ProduceStatusEnum.IN_PRODUCTION.name());

                            amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                            amazonSESService.sendEmailAfterChangeStatusForSupplier(order, lineItem);

                            supplierBalanceMap.computeIfAbsent(lineItem.getSupplierId(), s -> SupplierBalanceDTO.builder()
                                .supplierEmail("")
                                .supplierId(lineItem.getSupplierId())
                                .isPaid(false)
                                .author("System")
                                .orders(new ArrayList<>())
                                .build())
                                .getOrders()
                                .add(SupplierBalanceOrderDTO.builder()
                                    .orderId(order.getId())
                                    .itemSku(lineItem.getSku())
                                    .amount(lineItem.getSupplierCost() * lineItem.getQuantity())
                                    .build());
                        } else {
                            order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.UPDATED_TRACKING.name(), lineItemDTO.getTrackingNumber(), user.getFullName());
                        }

                        if (!Objects.equals(lineItem.getTrackingNumber(), lastTrackingNumber)
                            || !Objects.equals(lineItem.getTrackingUrl(), lastTrackingUrl)) {
                            syncTrackingDTO.getLineItems().add(SyncTrackingLineItemDTO.builder()
                                .trackingNumber(lineItem.getTrackingNumber())
                                .trackingUrl(lineItem.getTrackingUrl())
                                .lineItemSku(lineItem.getSku())
                                .build());
                        }
                    }
                });
            });
        }
        orderRepository.saveAll(orders);

        //Sync tracking
        for (Map.Entry<String, SyncTrackingDTO> entry : syncTrackingMap.entrySet()) {
            if (!entry.getValue().getLineItems().isEmpty()) {
                orderService.sendShopifySyncTrackingMessages(entry.getValue());
            }
        }

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
        orderService.sendTrackingMoreMessages(trackingMap);
        orderService.sendSupplierBalanceMessages(supplierBalanceMap);
    }

    @GetMapping("/admin/statistic")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<LineItemStatistic> getLineItemStatisticForAdmin() {
        log.debug("Get statistic status for admin");

        return new ResponseEntity<>(lineItemStatisticRepository.findById(RoleEnum.ROLE_ADMIN_CONSTANT)
            .orElseThrow(() -> new ObjectNotFoundException("line_item_statistic")), HttpStatus.OK);
    }

    @GetMapping("/statistic")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\")")
    public ResponseEntity<LineItemStatistic> getLineItemStatistic() {
        log.debug("Get statistic status");

        return new ResponseEntity<>(lineItemStatisticRepository.findById(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("line_item_statistic")), HttpStatus.OK);
    }

    @GetMapping("/supplier/statistic")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<LineItemStatistic> getLineItemStatisticForSupplier() {
        log.debug("Get statistic status for supplier");

        User user = getCurrentUser();
        return new ResponseEntity<>(lineItemStatisticRepository.findById(user.getId())
            .orElseThrow(() -> new ObjectNotFoundException("line_item_statistic")), HttpStatus.OK);
    }

    private boolean verifyWebHookData(String secret, String data, String sign) throws
        NoSuchAlgorithmException, InvalidKeyException {
        SecretKeySpec keySpec = new SecretKeySpec(
            secret.getBytes(),
            "HmacSHA256");

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(keySpec);
        byte[] result = mac.doFinal(data.getBytes());

        Base64 encoder = new Base64();
        return new String(encoder.encode(result)).equals(sign);
    }

    private Page<Order> getOrdersPagination(User user, Pageable pageable, Map<String, String> params,
                                            List<LineItemDTO> lineItemDTOs, boolean isAdmin) {
        String keyword = params.get("keyword") != null ? params.get("keyword") : "";
        keyword = keyword.replace("#", "");
        String seller = params.get("seller");
        String supplierId = params.get("supplierId");
        ObjectId siteId = StringUtils.isEmpty(params.get("siteId")) ? null : new ObjectId(params.get("siteId"));
        String productTypeId = params.get("productTypeId");
        String filterStatus = StringUtils.isEmpty(params.get("itemStatus")) ? null : params.get("itemStatus").toUpperCase();
        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));

        Page<Order> orderPage;
        List<String> statuses;
        if (isAdmin) {
            statuses = filterStatus == null || ProduceStatusEnum.COOLING_OFF.name().equals(filterStatus) ? null : Collections.singletonList(filterStatus);
            if (ProduceStatusEnum.CANCELED.name().equals(filterStatus)) {
                statuses = ProduceStatusEnum.getCanceledStatuses();
            }

            orderPage = orderRepository.findAllForAdmin(keyword, seller, supplierId,
                statuses, startDate, endDate, productTypeId,
                ProduceStatusEnum.COOLING_OFF.name().equals(filterStatus) ? Instant.now() : Instant.ofEpochMilli(Long.MIN_VALUE),
                siteId, pageable);
        } else {
            statuses = filterStatus == null ? null : Collections.singletonList(filterStatus);
            if (ProduceStatusEnum.PENDING.name().equals(filterStatus)) {
                statuses = ProduceStatusEnum.getPendingStatuses();
            } else if (ProduceStatusEnum.COOLING_OFF.name().equals(filterStatus)) {
                statuses = ProduceStatusEnum.getCoolingOffStatuses();
            } else if (ProduceStatusEnum.CANCELED.name().equals(filterStatus)) {
                statuses = ProduceStatusEnum.getCanceledStatuses();
            }

            orderPage = orderRepository.findAllForSeller(keyword, user.getEmail(), statuses,
                startDate, endDate, productTypeId,
                ProduceStatusEnum.COOLING_OFF.name().equals(filterStatus) ? Instant.now() : Instant.ofEpochMilli(Long.MIN_VALUE),
                siteId, pageable);
        }
        orderService.filterLineItemWithStatus(orderPage.get(), statuses, supplierId);

        orderPage.get().forEach(this::updateOrderStatus);
        //Solve order data
        if (lineItemDTOs != null && !lineItemDTOs.isEmpty()) {
            return new PageImpl<>(filterLineItemByExistList(orderPage.getContent(), lineItemDTOs), pageable, Integer.MAX_VALUE);
        }
        return orderPage;
    }

    private Page<Order> getOrdersPaginationForSupplier(User user, Pageable pageable, Map<String, String> params, boolean filterByStatus) {
        String keyword = params.get("keyword") != null ? params.get("keyword") : "";
        keyword = keyword.replace("#", "");
        String productTypeId = params.get("productTypeId");
        String itemStatus = StringUtils.isEmpty(params.get("itemStatus")) ? null : params.get("itemStatus").toUpperCase();
        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));

        List<String> statuses = StringUtils.isEmpty(itemStatus)
            ? ProduceStatusEnum.getSupplierStatuses()
            : Collections.singletonList(itemStatus);
        Page<Order> orders = orderRepository.findAllBySupplier(keyword, user.getId(), startDate, endDate, productTypeId,
            statuses, pageable);
        if (filterByStatus) {
            orderService.filterLineItemWithStatus(orders.get(), statuses, null);
            orders.forEach(order -> {
                order.getLineItems().removeIf(lineItem -> !user.getId().equalsIgnoreCase(lineItem.getSupplierId()));
            });
        }

        return orders;
    }

    private InputStreamResource exportOrderForAdminAndSeller(User user, Pageable
        pageable, Map<String, String> params, List<LineItemDTO> lineItemDTOs, boolean isAdmin) throws IOException {
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(isAdmin
            ? exportOrderService.getAdminExportHeader()
            : exportOrderService.getSellerExportHeader()));

        int page = 0;
        while (true) {
            List<Order> orders = getOrdersPagination(user, PageRequest.of(page++, PAGE_SIZE, pageable.getSort()), params, lineItemDTOs, isAdmin).getContent();

            if (orders.isEmpty()) {
                break;
            }

            for (Order order : orders) {
                exportOrderService.resolveDataForAdminAndSellerExport(excelData, order, order.getLineItems(), isAdmin);
            }
        }

        Workbook workbook = excelService.exportExcel("Orders", excelData);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        ByteArrayInputStream in = new ByteArrayInputStream(outputStream.toByteArray());

        return new InputStreamResource(in);
    }

    private Optional<Order> getOrderByOrderId(List<Order> orders, String orderId) {
        return orders.stream()
            .filter(order -> order.getId().equals(orderId))
            .findFirst();
    }

    private User getCurrentUser() {
        return userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
    }

    private void checkStatusToSendMail(Order order, LineItem lineItem) {
        switch (ProduceStatusEnum.getByName(lineItem.getStatus())
            .orElseThrow(() -> new ObjectNotFoundException("line_item_status"))) {
            case PENDING_DESIGN:
            case CHOOSE_SUPPLIER:
            case PROCESSING:
            case ON_HOLD:
            case SHIPPED:
            case CANCELED:
            case REFUNDED:
                amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                break;
        }
    }

    private List<Order> filterLineItemByExistList(List<Order> orders, List<LineItemDTO> lineItemDTOs) {
        Set<String> lineItemExportId = lineItemDTOs.stream()
            .map(lineItemDTO -> lineItemDTO.getOrderId() + "-" + lineItemDTO.getItemSku())
            .collect(Collectors.toSet());

        return orders
            .stream()
            .peek(order -> order.getLineItems()
                .removeIf(lineItem -> !lineItemExportId.contains(order.getId() + "-" + lineItem.getSku())))
            .filter(order -> !order.getLineItems().isEmpty())
            .collect(Collectors.toList());
    }

    private void changeStatusAfterResolve(LineItem lineItem) {
        if (ProduceStatusEnum.PENDING_DESIGN.name().equals(lineItem.getPreStatus())
            && orderService.getNumberMissingDesign(lineItem) == 0) {
            if (StringUtils.isEmpty(lineItem.getSupplierId())) {
                lineItem.setStatus(ProduceStatusEnum.CHOOSE_SUPPLIER.name());
            } else {
                lineItem.setStatus(ProduceStatusEnum.NEED_PAY.name());
            }
        } else if (ProduceStatusEnum.CHOOSE_SUPPLIER.name().equals(lineItem.getPreStatus())
            && !StringUtils.isEmpty(lineItem.getSupplierId())) {
            if (orderService.getNumberMissingDesign(lineItem) != 0) {
                lineItem.setStatus(ProduceStatusEnum.PENDING_DESIGN.name());
            } else {
                lineItem.setStatus(ProduceStatusEnum.NEED_PAY.name());
            }
        } else {
            lineItem.setStatus(lineItem.getPreStatus());
        }
    }
}
