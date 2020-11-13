package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.goofinity.pgc_service.domain.*;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.dto.LineItemStatisticDTO;
import com.goofinity.pgc_service.enums.*;
import com.goofinity.pgc_service.repository.*;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.goofinity.pgc_service.util.NumberUtil.*;

@Service
public class BalanceService {
    private final UserBalanceRepository userBalanceRepository;
    private final UserRepository userRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final ConfigRepository configRepository;
    private final OrderRepository orderRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final LineItemStatisticService lineItemStatisticService;
    private final AmazonSESService amazonSESService;
    private final DailyStatisticService dailyStatisticService;

    public BalanceService(final UserBalanceRepository userBalanceRepository,
                          final UserRepository userRepository,
                          final TransactionHistoryRepository transactionHistoryRepository,
                          final ConfigRepository configRepository,
                          final OrderRepository orderRepository,
                          final SequenceGeneratorService sequenceGeneratorService,
                          final LineItemStatisticService lineItemStatisticService,
                          final AmazonSESService amazonSESService,
                          final DailyStatisticService dailyStatisticService) {
        this.userBalanceRepository = userBalanceRepository;
        this.userRepository = userRepository;
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.configRepository = configRepository;
        this.orderRepository = orderRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.lineItemStatisticService = lineItemStatisticService;
        this.amazonSESService = amazonSESService;
        this.dailyStatisticService = dailyStatisticService;
    }

    public UserBalance updatePendingBalance(String email, double amount) {
        UserBalance balance = getBalanceOfUser(email);
        balance.setPendingAmount(addDouble(balance.getPendingAmount(), amount));
        return userBalanceRepository.save(balance);
    }

    public UserBalance updateBalance(String email, double amount) {
        UserBalance balance = getBalanceOfUser(email);
        balance.setAvailableAmount(addDouble(balance.getAvailableAmount(), amount));
        return userBalanceRepository.save(balance);
    }

    public UserBalance getBalanceOfUser(String email) {
        return userBalanceRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ObjectNotFoundException("user"));
    }

    public void paidForOrder(Order order) {
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        UserBalance adminBalance = userBalanceRepository.findByEmailIgnoreCase(RoleEnum.ROLE_ADMIN.name()).get();
        UserBalance userBalance = userBalanceRepository.findByEmailIgnoreCase(order.getSellerEmail()).get();
        User seller = userRepository.findByEmailIgnoreCase(order.getSellerEmail()).get();
        int numberPaid = 0;
        BigDecimal amountPaid = BigDecimal.valueOf(0.0);
        for (LineItem lineItem : order.getLineItems()) {
            if (lineItem.getStatus().equals(ProduceStatusEnum.NEED_PAY.name()) && !lineItem.isPaid()) {
                BigDecimal amount = new BigDecimal(String.valueOf(lineItem.getBaseCost()))
                    .add(new BigDecimal(String.valueOf(lineItem.getCarrierCost())))
                    .subtract(BigDecimal.valueOf(order.getDiscount()))
                    .multiply(new BigDecimal(String.valueOf(lineItem.getQuantity())))
                    .max(BigDecimal.valueOf(0));
                BigDecimal userBalanceTemp = toBigDecimalDouble(userBalance.getAvailableAmount());
                if (userBalanceTemp.compareTo(amount) >= 0) {
                    userBalance.setAvailableAmount(userBalanceTemp.subtract(amount).doubleValue());
                    userBalance.setPaidAmount(addDouble(userBalance.getPaidAmount(), amount));
                    adminBalance.setPaidAmount(addDouble(adminBalance.getPaidAmount(), amount));
                    Optional<TransactionHistory> transactionHistory = transactionHistoryRepository.findByOrderIdAndItemSkuAndType(order.getId(), lineItem.getSku(), TransactionTypeEnum.PAID_ITEM.name());
                    if (transactionHistory.isPresent()
                        && transactionHistory.get().getStatus().equalsIgnoreCase(TransactionStatusEnum.DEBT.name())) {
                        transactionHistory.get().setStatus(TransactionStatusEnum.APPROVED.name());
                        transactionHistory.get().setLastChangeStatusDate(Instant.now());
                        transactionHistoryRepository.save(transactionHistory.get());
                        userBalance.setUpcomingAmount(subtractDouble(userBalance.getUpcomingAmount(), amount));
                        adminBalance.setUpcomingAmount(subtractDouble(adminBalance.getUpcomingAmount(), amount));
                    } else {
                        transactionHistoryRepository.save(TransactionHistory.builder()
                            .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
                            .email(userBalance.getEmail())
                            .createdByFullName("System")
                            .amount(amount.doubleValue())
                            .discount(order.getDiscount())
                            .type(TransactionTypeEnum.PAID_ITEM.name())
                            .status(TransactionStatusEnum.APPROVED.name())
                            .orderId(order.getId())
                            .itemSku(lineItem.getSku())
                            .site(order.getSite())
                            .note("Paid for order #" + order.getOrderName() + " - Line item: " + lineItem.getSku())
                            .lastChangeStatusDate(Instant.now())
                            .build());
                    }
                    lineItem.setPaid(true);
                    lineItem.setPaidAmount(amount.doubleValue());
                    statisticForSellerAndAdmin(order, lineItem);
                    order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.PAID.name(), amount.doubleValue() + "");

                    // Send mail for balance updated

                    //Get config admin approve
                    Config configAutoApprove = configRepository.findByKey(ConfigEnum.AUTO_APPROVE.name()).orElse(new Config());
                    if (Boolean.parseBoolean(configAutoApprove.getValue())) {
                        lineItem.setStatus(ProduceStatusEnum.PROCESSING.name());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.PROCESSING.name(), null);

                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            lineItem.getStatus(), null);
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            ProduceStatusEnum.ALL.name(), null);

                        amazonSESService.sendEmailAfterChangeStatusForSeller(order, lineItem);
                        amazonSESService.sendEmailAfterChangeStatusForSupplier(order, lineItem);
                    } else {
                        lineItem.setStatus(ProduceStatusEnum.ACTION_REQUIRED.name());
                        lineItem.setPreStatus(ProduceStatusEnum.PROCESSING.name());
                        lineItem.setStatusNote(OrderLogTypeEnum.WAITING_FOR_ADMIN_APPROVE.name());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.WAITING_FOR_ADMIN_APPROVE.name(), null);
                    }

                    lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                        lineItem.getStatus(), ProduceStatusEnum.NEED_PAY.name());

                    numberPaid++;
                    amountPaid = amountPaid.add(amount);
                } else if (!transactionHistoryRepository.findByOrderIdAndItemSkuAndType(order.getId(), lineItem.getSku(),
                    TransactionTypeEnum.PAID_ITEM.name()).isPresent()) {
                    userBalance.setUpcomingAmount(addDouble(userBalance.getUpcomingAmount(), amount));
                    adminBalance.setUpcomingAmount(addDouble(adminBalance.getUpcomingAmount(), amount));
                    transactionHistoryRepository.save(TransactionHistory.builder()
                        .number(sequenceGeneratorService.generateSequence(TransactionHistory.SEQUENCE_NAME))
                        .email(userBalance.getEmail())
                        .createdByFullName("System")
                        .amount(amount.doubleValue())
                        .discount(order.getDiscount())
                        .type(TransactionTypeEnum.PAID_ITEM.name())
                        .status(TransactionStatusEnum.DEBT.name())
                        .orderId(order.getId())
                        .itemSku(lineItem.getSku())
                        .site(order.getSite())
                        .note("Paid for order #" + order.getOrderNumber() + " - Line item: " + lineItem.getSku())
                        .lastChangeStatusDate(Instant.now())
                        .build());
                    order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.NOT_ENOUGH_BALANCE.name(), amount + "");
                    lineItem.setStatus(ProduceStatusEnum.NEED_PAY.name());
                }
            }

            if (order.isCoolingOff() && Instant.now().compareTo(order.getCoolingOffExp()) > 0) {
                lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                    null, ProduceStatusEnum.COOLING_OFF.name());
            }
        }
        userBalanceRepository.saveAll(Arrays.asList(userBalance, adminBalance));

        if (order.isCoolingOff() && Instant.now().compareTo(order.getCoolingOffExp()) > 0) {
            order.setCoolingOff(false);
        }
        orderRepository.save(order);

        if (numberPaid > 0 || amountPaid.doubleValue() > 0) {
            seller.setTotalOrder(seller.getTotalOrder() + numberPaid);
            seller.setSaleAmount(addDouble(seller.getSaleAmount(), amountPaid));
            userRepository.save(seller);
        }

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    private void statisticForSellerAndAdmin(Order order, LineItem lineItem) {
        //Daily statistic
        try {
            double saleCost = (Double.parseDouble(lineItem.getPrice()) - order.getDiscount() + lineItem.getCarrierCost()) * lineItem.getQuantity();
            double baseCost = (lineItem.getBaseCost() - order.getDiscount() + lineItem.getCarrierCost()) * lineItem.getQuantity();
            double supplierCost = lineItem.getSupplierCost() * lineItem.getQuantity();

            //Statistic for site
            dailyStatisticService.sendStatistic(null, order.getSite().getId(), StatisticFieldEnum.REVENUE.name(), saleCost);
            dailyStatisticService.sendStatistic(null, order.getSite().getId(), StatisticFieldEnum.PROFIT.name(), saleCost - baseCost);

            //Statistic for seller
            dailyStatisticService.sendStatistic(order.getSellerEmail(), null, StatisticFieldEnum.REVENUE.name(), saleCost);
            dailyStatisticService.sendStatistic(order.getSellerEmail(), null, StatisticFieldEnum.PROFIT.name(), saleCost - baseCost);

            //Statistic for admin
            dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.REVENUE.name(), baseCost);
            dailyStatisticService.sendStatistic(RoleEnum.ROLE_ADMIN.name(), null, StatisticFieldEnum.PROFIT.name(), baseCost - supplierCost);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
