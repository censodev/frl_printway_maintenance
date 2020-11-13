package com.goofinity.pgc_service.event.supplierBalance;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.TransactionHistory;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.domain.UserBalance;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceDTO;
import com.goofinity.pgc_service.dto.supplierBalance.SupplierBalanceOrderDTO;
import com.goofinity.pgc_service.enums.TransactionStatusEnum;
import com.goofinity.pgc_service.enums.TransactionTypeEnum;
import com.goofinity.pgc_service.repository.TransactionHistoryRepository;
import com.goofinity.pgc_service.repository.UserBalanceRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.service.SequenceGeneratorService;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import java.util.List;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;
import static com.goofinity.pgc_service.util.NumberUtil.*;

@EnableBinding({SupplierBalanceBinding.class})
public class SupplierBalanceListener {
    private final ObjectMapper objectMapper = getObjectMapper();

    private final TransactionHistoryRepository transactionHistoryRepository;
    private final UserRepository userRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public SupplierBalanceListener(final TransactionHistoryRepository transactionHistoryRepository,
                                   final UserRepository userRepository,
                                   final UserBalanceRepository userBalanceRepository,
                                   SequenceGeneratorService sequenceGeneratorService) {
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.userRepository = userRepository;
        this.userBalanceRepository = userBalanceRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    @StreamListener(SupplierBalanceBinding.SUPPLIER_BALANCE_RECEIVER_CHANNEL)
    public void processSupplierBalance(String rawData) throws JsonProcessingException {
        SupplierBalanceDTO dto = objectMapper.readValue(rawData, SupplierBalanceDTO.class);

        User supplier = userRepository.findByIdOrEmailIgnoreCase(dto.getSupplierId(), dto.getSupplierEmail()).orElse(null);
        UserBalance supplierBalance = userBalanceRepository.findByIdOrEmailIgnoreCase(dto.getSupplierId(), supplier == null ? "none" : supplier.getEmail())
            .orElse(null);
        if (supplier != null && supplierBalance != null) {
            //Admin paid for supplier and use it to paid debt transaction
            if (dto.isPaid()) {
                supplierBalance.setAvailableAmount(addDouble(supplierBalance.getAvailableAmount(), dto.getTotalAmount()));
                List<TransactionHistory> transactionHistories = transactionHistoryRepository
                    .findAllByEmailIgnoreCaseAndStatusAndType(dto.getSupplierEmail(), TransactionStatusEnum.DEBT.name(),
                        TransactionTypeEnum.PAID_SUPPLIER.name());

                for (TransactionHistory transactionHistory : transactionHistories) {
                    if (toBigDecimalDouble(supplierBalance.getAvailableAmount()).compareTo(toBigDecimalDouble(transactionHistory.getAmount())) >= 0) {
                        supplierBalance.setAvailableAmount(subtractDouble(supplierBalance.getAvailableAmount(), transactionHistory.getAmount()));
                        supplierBalance.setUpcomingAmount(subtractDouble(supplierBalance.getUpcomingAmount(), transactionHistory.getAmount()));
                        supplierBalance.setPaidAmount(addDouble(supplierBalance.getPaidAmount(), transactionHistory.getAmount()));
                        transactionHistory.setStatus(TransactionStatusEnum.APPROVED.name());
                        supplier.setSaleAmount(addDouble(supplier.getSaleAmount(), transactionHistory.getAmount()));
                    }
                }

                transactionHistoryRepository.saveAll(transactionHistories);
            } else {
                if (dto.getOrders() == null || dto.getOrders().isEmpty()) {
                    return;
                }

                for (SupplierBalanceOrderDTO order : dto.getOrders()) {
                    TransactionHistory transactionHistory = TransactionHistory.builder()
                        .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
                        .email(supplier.getEmail())
                        .amount(order.getAmount())
                        .orderId(order.getOrderId())
                        .itemSku(order.getItemSku())
                        .type(TransactionTypeEnum.PAID_SUPPLIER.name())
                        .createdByFullName(dto.getAuthor())
                        .build();
                    if (toBigDecimalDouble(supplierBalance.getAvailableAmount()).compareTo(toBigDecimalDouble(transactionHistory.getAmount())) >= 0) {
                        transactionHistory.setStatus(TransactionStatusEnum.APPROVED.name());
                        supplierBalance.setAvailableAmount(subtractDouble(supplierBalance.getAvailableAmount(), transactionHistory.getAmount()));
                        supplierBalance.setPaidAmount(addDouble(supplierBalance.getPaidAmount(), transactionHistory.getAmount()));
                        supplier.setSaleAmount(addDouble(supplier.getSaleAmount(), transactionHistory.getAmount()));
                    } else {
                        transactionHistory.setStatus(TransactionStatusEnum.DEBT.name());
                        supplierBalance.setUpcomingAmount(addDouble(supplierBalance.getUpcomingAmount(), order.getAmount()));
                    }
                    transactionHistoryRepository.save(transactionHistory);
                    supplier.setTotalOrder(supplier.getTotalOrder() + 1);
                }
            }

            userBalanceRepository.save(supplierBalance);
            userRepository.save(supplier);
        }
    }
}
