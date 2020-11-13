package com.goofinity.pgc_service.event.balance;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.service.BalanceService;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({BalanceTrackingBinding.class})
public class BalanceTrackingListener {
    private final ObjectMapper objectMapper = getObjectMapper();

    private final BalanceService balanceService;

    public BalanceTrackingListener(final BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @StreamListener(BalanceTrackingBinding.BALANCE_RECEIVER_CHANNEL)
    public void processTrackingBalance(String rawData) throws JsonProcessingException {
        Order order = objectMapper.readValue(rawData, Order.class);
        balanceService.paidForOrder(order);
    }
}
