package com.goofinity.pgc_service.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.TransactionHistory;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.dto.*;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceDTO;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.enums.StatisticFieldEnum;
import com.goofinity.pgc_service.enums.TransactionStatusEnum;
import com.goofinity.pgc_service.enums.TransactionTypeEnum;
import com.goofinity.pgc_service.event.supplierBalance.SupplierBalanceBinding;
import com.goofinity.pgc_service.repository.OrderRepository;
import com.goofinity.pgc_service.repository.TransactionHistoryRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.*;
import com.goofinity.pgc_service.util.DataUtil;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding(SupplierBalanceBinding.class)
@RestController
@RequestMapping("/api/transaction")
public class TransactionHistoryResource {
    @Getter
    private List<String> sellerTransactionExportHeader = Arrays.asList("Order Id", "Amount", "Discount", "Transaction ID",
        "Site", "Created by", "Created Date", "Action", "Note", "Status");

    @Getter
    private List<String> supplierTransactionExportHeader = Arrays.asList("Supplier", "Amount", "Transaction ID",
        "Created by", "Created Date", "Status", "Action");

    private static final Logger log = LoggerFactory.getLogger(TransactionHistoryResource.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final BalanceService balanceService;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final DailyStatisticService dailyStatisticService;
    private final ExcelService excelService;
    private final OrderService orderService;
    private final AmazonSESService amazonSESService;
    private final MessageChannel supplierBalanceChannel;

    public TransactionHistoryResource(final TransactionHistoryRepository transactionHistoryRepository,
                                      final OrderRepository orderRepository,
                                      final UserRepository userRepository,
                                      final UserService userService,
                                      final BalanceService balanceService,
                                      final SequenceGeneratorService sequenceGeneratorService,
                                      final DailyStatisticService dailyStatisticService,
                                      final ExcelService excelService,
                                      final OrderService orderService,
                                      final AmazonSESService amazonSESService,
                                      final SupplierBalanceBinding supplierBalanceBinding) {
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.balanceService = balanceService;
        this.userService = userService;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.dailyStatisticService = dailyStatisticService;
        this.excelService = excelService;
        this.orderService = orderService;
        this.amazonSESService = amazonSESService;
        this.supplierBalanceChannel = supplierBalanceBinding.publisher();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionHistory> getTransactionDetail(@PathVariable String id) {
        log.debug("Get transaction detail: {}", id);
        return new ResponseEntity<>(transactionHistoryRepository.findByIdAndEmailIgnoreCase(id,
            SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user_balance")), HttpStatus.OK);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<TransactionHistory>> getTransactionHistoriesByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                                        @RequestParam Map<String, String> params) {
        log.debug("Get transaction histories with pagination: {}", pageable);

        return new ResponseEntity<>(getTransactionsPagination(pageable, params, false), HttpStatus.OK);
    }

    @GetMapping("/admin/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Page<TransactionHistory>> getTransactionHistoriesByPaginationForAdmin(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                                                @RequestParam Map<String, String> params) {
        log.debug("Get transaction histories with pagination for admin: {}", pageable);

        return new ResponseEntity<>(getTransactionsPagination(pageable, params, true), HttpStatus.OK);
    }

    @GetMapping("/supplier/page")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<Page<TransactionHistory>> getTransactionHistoriesSupplierByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                                                @RequestParam Map<String, String> params) {
        log.debug("Get transaction histories of supplier with pagination: {}", pageable);

        return new ResponseEntity<>(getTransactionsPaginationSupplier(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new), pageable, params), HttpStatus.OK);
    }

    @GetMapping("/admin/supplier/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Page<TransactionHistory>> getTransactionHistoriesSupplierByPaginationForAdmin(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                                                        @RequestParam Map<String, String> params) {
        log.debug("Get transaction histories of supplier with pagination for admin: {}", pageable);

        String supplierEmail = userRepository.findById(StringUtils.defaultString(params.get("supplierId")))
            .orElse(new User()).getEmail();
        return new ResponseEntity<>(getTransactionsPaginationSupplier(supplierEmail, pageable, params), HttpStatus.OK);
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionHistory> makeDeposit(@Valid @RequestBody DepositDTO depositDTO) {
        log.debug("Make deposit: {}", depositDTO);

        if (transactionHistoryRepository.findByTransactionId(depositDTO.getTransactionId()).isPresent()) {
            throw new InvalidDataException("transaction_id_exist");
        }

        if (depositDTO.getAmount() <= 0) {
            throw new InvalidDataException("amount");
        }

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        TransactionHistory transactionHistory = transactionHistoryRepository.save(TransactionHistory.builder()
            .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
            .email(user.getEmail())
            .createdByFullName(userService.getFullName(user.getEmail()))
            .type(TransactionTypeEnum.DEPOSIT.name())
            .transactionId(depositDTO.getTransactionId())
            .amount(depositDTO.getAmount())
            .note(depositDTO.getNote())
            .status(TransactionStatusEnum.PENDING.name())
            .lastChangeStatusDate(Instant.now())
            .build());

        if (user.getRoles().contains(RoleEnum.ROLE_SELLER_CONSTANT)) {
            amazonSESService.sendMailForSellerDeposit(transactionHistory);
        }

        balanceService.updatePendingBalance(user.getEmail(), depositDTO.getAmount());
        balanceService.updatePendingBalance(RoleEnum.ROLE_ADMIN.name(), depositDTO.getAmount());

        return new ResponseEntity<>(transactionHistory, HttpStatus.OK);
    }

    @PutMapping("/deposit")
    public ResponseEntity<TransactionHistory> updateDeposit(@RequestBody TransactionHistory transactionHistory) {
        log.debug("Update deposit: {}", transactionHistory);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        TransactionHistory existTransactionHistory = transactionHistoryRepository
            .findByIdAndEmailIgnoreCase(transactionHistory.getId(), user.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("transaction"));

        if (transactionHistoryRepository.findByTransactionIdAndIdNot(transactionHistory.getTransactionId(),
            transactionHistory.getId()).isPresent()) {
            throw new DuplicateDataException("transaction_id");
        }

        if (!existTransactionHistory.getStatus().equals(TransactionStatusEnum.PENDING.name())) {
            throw new InvalidDataException("transaction_solved");
        }

        if (transactionHistory.getAmount() <= 0) {
            throw new InvalidDataException("amount");
        }

        if (StringUtils.isEmpty(transactionHistory.getTransactionId())) {
            throw new InvalidDataException("transaction_id");
        }

        if (transactionHistory.getAmount() != existTransactionHistory.getAmount()) {
            balanceService.updatePendingBalance(user.getEmail(), -1 * existTransactionHistory.getAmount());
            balanceService.updatePendingBalance(user.getEmail(), transactionHistory.getAmount());
            balanceService.updatePendingBalance(RoleEnum.ROLE_ADMIN.name(), -1 * existTransactionHistory.getAmount());
            balanceService.updatePendingBalance(RoleEnum.ROLE_ADMIN.name(), transactionHistory.getAmount());
        }

        existTransactionHistory.setTransactionId(transactionHistory.getTransactionId());
        existTransactionHistory.setAmount(transactionHistory.getAmount());
        existTransactionHistory.setNote(transactionHistory.getNote());
        transactionHistoryRepository.save(existTransactionHistory);

        if (user.getRoles().contains(RoleEnum.ROLE_SELLER_CONSTANT)) {
            transactionHistory.setStatus(existTransactionHistory.getStatus());
            amazonSESService.sendMailForSellerDeposit(transactionHistory);
        }

        return new ResponseEntity<>(existTransactionHistory, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deletePendingDepositTransaction(@PathVariable String id) {
        log.debug("Delete pending deposit transaction: {}", id);

        TransactionHistory transactionHistory = transactionHistoryRepository.findByIdAndEmailIgnoreCase(id,
            SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("transaction_history"));

        if (!transactionHistory.getType().equals(TransactionTypeEnum.DEPOSIT.name())) {
            throw new InvalidDataException("transaction_type");
        }

        if (!transactionHistory.getStatus().equals(TransactionStatusEnum.PENDING.name())) {
            throw new InvalidDataException("transaction_completed");
        }

        transactionHistoryRepository.delete(transactionHistory);
        balanceService.updatePendingBalance(transactionHistory.getEmail(), -1 * transactionHistory.getAmount());
        balanceService.updatePendingBalance(RoleEnum.ROLE_ADMIN.name(), -1 * transactionHistory.getAmount());
    }

    @PostMapping("/admin/custom")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\")")
    @ResponseStatus(HttpStatus.OK)
    public void customTransaction(@RequestBody CustomTransactionDTO customTransactionDTO) throws JsonProcessingException {
        log.debug("Create custom transaction: {}", customTransactionDTO);

        if (customTransactionDTO.getAmount() <= 0) {
            throw new InvalidDataException("amount");
        }
        double amount = customTransactionDTO.isAdd() ? customTransactionDTO.getAmount() : -1 * customTransactionDTO.getAmount();

        User user = userRepository.findByEmailIgnoreCase(customTransactionDTO.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        String createdByFullName = userService.getFullName(SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new));

        if (user.getRoles().contains(RoleEnum.ROLE_SUPPLIER.name())) {
            try {
                supplierBalanceChannel.send(MessageBuilder.withPayload(objectMapper
                    .writeValueAsString(SupplierBalanceDTO.builder()
                        .supplierEmail(user.getEmail())
                        .supplierId("")
                        .author(createdByFullName)
                        .totalAmount(amount)
                        .isPaid(true)
                        .build())).build());
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }

            transactionHistoryRepository.save(TransactionHistory.builder()
                .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
                .email(user.getEmail())
                .createdByFullName(createdByFullName)
                .type(TransactionTypeEnum.DEPOSIT_SUPPLIER.name())
                .amount(amount)
                .status(TransactionStatusEnum.APPROVED.name())
                .note(customTransactionDTO.getNote())
                .transactionId(customTransactionDTO.getTransactionID())
                .lastChangeStatusDate(Instant.now())
                .build());
        } else {
            balanceService.updateBalance(user.getEmail(), amount);

            String transactionType = customTransactionDTO.isAdd() ? TransactionTypeEnum.CUSTOM_ADD.name() : TransactionTypeEnum.CUSTOM_SUBTRACT.name();
            transactionHistoryRepository.save(TransactionHistory.builder()
                .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
                .email(user.getEmail())
                .createdByFullName(createdByFullName)
                .type(transactionType)
                .amount(customTransactionDTO.getAmount())
                .status(TransactionStatusEnum.APPROVED.name())
                .note(customTransactionDTO.getNote())
                .transactionId(customTransactionDTO.getTransactionID())
                .lastChangeStatusDate(Instant.now())
                .build());

            dailyStatisticService.sendStatistic(user.getEmail(), null, transactionType, amount);
            dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, transactionType, amount);

            dailyStatisticService.sendStatistic(user.getEmail(), null, StatisticFieldEnum.BALANCE.name(), amount);
            dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.BALANCE.name(), amount);
        }
    }

    @GetMapping("/admin/deposit/approve/{transactionId}")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\")")
    public ResponseEntity<TransactionHistory> approveDeposit(@PathVariable String transactionId) throws JsonProcessingException {
        log.debug("Approve transaction: {}", transactionId);

        TransactionHistory transactionHistory = getPendingTransaction(transactionId);
        transactionHistory.setStatus(TransactionStatusEnum.APPROVED.name());
        transactionHistory.setLastChangeStatusDate(Instant.now());
        transactionHistoryRepository.save(transactionHistory);

        balanceService.updatePendingBalance(transactionHistory.getEmail(), -1 * transactionHistory.getAmount());
        balanceService.updateBalance(transactionHistory.getEmail(), transactionHistory.getAmount());
        balanceService.updatePendingBalance(RoleEnum.ROLE_ADMIN.name(), -1 * transactionHistory.getAmount());
        balanceService.updateBalance(RoleEnum.ROLE_ADMIN.name(), transactionHistory.getAmount());

        amazonSESService.sendMailForSellerDeposit(transactionHistory);

        //Resolve debt order
        Set<String> orderDebtIds = transactionHistoryRepository.findAllByEmailIgnoreCaseAndStatus(transactionHistory.getEmail(),
            TransactionStatusEnum.DEBT.name()).stream()
            .map(TransactionHistory::getOrderId)
            .collect(Collectors.toSet());
        for (Order order : orderRepository.findAllByIdIn(new ArrayList<>(orderDebtIds))) {
            orderService.paidForOrder(order);
        }

        dailyStatisticService.sendStatistic(transactionHistory.getEmail(), null, StatisticFieldEnum.BALANCE.name(), transactionHistory.getAmount());
        dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.BALANCE.name(), transactionHistory.getAmount());
        return new ResponseEntity<>(transactionHistory, HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\")")
    @ResponseStatus(HttpStatus.OK)
    public void retryPaid(@RequestParam String orderId) {
        orderService.paidForOrder(orderRepository.findById(orderId).orElseThrow(() -> new ObjectNotFoundException("order")));
    }

    @PostMapping("/admin/deposit/reject")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\")")
    public ResponseEntity<TransactionHistory> rejectDeposit(@RequestBody RejectDepositDTO dto) {
        log.debug("Reject transaction: {}", dto);

        TransactionHistory transactionHistory = getPendingTransaction(dto.getId());
        transactionHistory.setStatus(TransactionStatusEnum.REJECTED.name());
        transactionHistory.setLastChangeStatusDate(Instant.now());
        transactionHistory.setNote(dto.getNote());
        transactionHistoryRepository.save(transactionHistory);

        balanceService.updatePendingBalance(RoleEnum.ROLE_ADMIN.name(), -1 * transactionHistory.getAmount());
        balanceService.updatePendingBalance(transactionHistory.getEmail(), -1 * transactionHistory.getAmount());

        amazonSESService.sendMailForSellerDeposit(transactionHistory);

        return new ResponseEntity<>(transactionHistory, HttpStatus.OK);
    }

    @GetMapping("/admin/export")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<InputStreamResource> exportExcelForAdmin(Pageable pageable,
                                                                   @RequestParam Map<String, String> params) throws IOException {
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(sellerTransactionExportHeader));
        List<TransactionHistory> transactions = getTransactionsPagination(PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort()), params, true).getContent();
        return exportData(true, excelData, transactions);
    }

    @GetMapping("/admin/supplier/export")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<InputStreamResource> exportExcelSupplerForAdmin(Pageable pageable,
                                                                          @RequestParam Map<String, String> params) throws IOException {
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(supplierTransactionExportHeader));
        List<TransactionHistory> transactions = getTransactionsPaginationSupplier(params.get("supplierEmail"), PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort()), params).getContent();
        return exportData(false, excelData, transactions);
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportExcelForSeller(Pageable pageable,
                                                                    @RequestParam Map<String, String> params) throws IOException {
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(sellerTransactionExportHeader));
        List<TransactionHistory> transactions = getTransactionsPagination(PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort()), params, false).getContent();
        return exportData(true, excelData, transactions);
    }

    private ResponseEntity<InputStreamResource> exportData(boolean isSeller, ExcelData excelData, List<TransactionHistory> transactions) throws IOException {
        for (TransactionHistory transaction : transactions) {
            if (isSeller) {
                excelData.getRowData().add(Arrays.asList(
                    transaction.getOrderId(),
                    transaction.getAmount() + "",
                    transaction.getDiscount() + "",
                    transaction.getTransactionId(),
                    transaction.getSite() == null ? "" : transaction.getSite().getUrl(),
                    transaction.getCreatedByFullName(),
                    transaction.getCreatedDate() + "",
                    transaction.getType(),
                    transaction.getNote(),
                    transaction.getStatus()));
            } else {
                excelData.getRowData().add(Arrays.asList(
                    transaction.getSupplier(),
                    transaction.getAmount() + "",
                    transaction.getTransactionId(),
                    transaction.getCreatedByFullName(),
                    transaction.getCreatedDate() + "",
                    transaction.getStatus(),
                    transaction.getType()));
            }
        }
        Workbook workbook = excelService.exportExcel("Transactions", excelData);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        String filename = isSeller ? "seller" : "supplier";
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        headers.add("Content-Disposition", "attachment; filename=" + filename + "-transactions-" + DataUtil.formatter.format(Instant.now()) + ".xlsx");
        ByteArrayInputStream in = new ByteArrayInputStream(outputStream.toByteArray());

        return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
    }

    private Page<TransactionHistory> getTransactionsPagination(Pageable pageable, Map<String, String> params, boolean isAdmin) {
        String email = isAdmin ? params.get("email") : SecurityUtils.getCurrentUserLogin().orElseThrow(SecurityException::new);
        String keyword = params.get("keyword") != null ? params.get("keyword") : "";
        String type = params.get("action") != null ? params.get("action").toUpperCase() : null;
        String status = params.get("status") != null ? params.get("status").toUpperCase() : null;
        ObjectId siteId = params.get("siteId") == null ? null : new ObjectId(params.get("siteId"));
        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate")).truncatedTo(ChronoUnit.DAYS);
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate")).truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS).minus(1, ChronoUnit.SECONDS);

        List<String> types = type == null ? null : Collections.singletonList(type);
        if (TransactionTypeEnum.CUSTOM.name().equalsIgnoreCase(type)) {
            types = Arrays.asList(TransactionTypeEnum.CUSTOM_ADD.name(), TransactionTypeEnum.CUSTOM_SUBTRACT.name());
        }

        return isAdmin
            ? transactionHistoryRepository.findAllForAdmin(keyword, types, status, siteId, email, startDate, endDate, pageable)
            : transactionHistoryRepository.findTransactionHistoryForUser(email, keyword, types, status, startDate, endDate, pageable);
    }

    private Page<TransactionHistory> getTransactionsPaginationSupplier(String supplierEmail, Pageable pageable, Map<String, String> params) {
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        String status = params.get("status") != null ? params.get("status").toUpperCase() : null;
        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));

        return transactionHistoryRepository.findTransactionHistoryForSupplier(supplierEmail, keyword,
            Arrays.asList(TransactionTypeEnum.PAID_SUPPLIER.name()),
            status, startDate, endDate, pageable);
    }

    private TransactionHistory getPendingTransaction(String transactionId) {
        return transactionHistoryRepository.findByIdAndStatusAndType(transactionId,
            TransactionStatusEnum.PENDING.name(), TransactionTypeEnum.DEPOSIT.name())
            .orElseThrow(() -> new ObjectNotFoundException("transaction"));
    }
}
