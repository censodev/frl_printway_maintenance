package com.goofinity.pgc_service.crons;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.enums.ProduceStatusEnum;
import com.goofinity.pgc_service.event.balance.BalanceTrackingBinding;
import com.goofinity.pgc_service.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;
import java.util.List;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding(BalanceTrackingBinding.class)
@Configuration
public class CoolingOfPaymentCron {
    private final Logger log = LoggerFactory.getLogger(CoolingOfPaymentCron.class);
    private final int PAGE_SIZE = 200;

    private final OrderRepository orderRepository;
    private final MessageChannel messageChannel;
    private final ObjectMapper objectMapper = getObjectMapper();

    public CoolingOfPaymentCron(final OrderRepository orderRepository,
                                final BalanceTrackingBinding balanceTrackingBinding) {
        this.orderRepository = orderRepository;
        this.messageChannel = balanceTrackingBinding.publisher();
    }

    @Scheduled(cron = "${application.cron.coolingOfPayment}")
    private void checkOrderHolding() {
        int page = 0;
        while (true) {
            List<Order> orders = orderRepository.findAllByCoolingOffExpBeforeAndLineItems_Status(
                Instant.now(),
                ProduceStatusEnum.NEED_PAY.name(),
                PageRequest.of(page++, PAGE_SIZE));

            if (orders.isEmpty()) {
                break;
            }

            orders.forEach(order -> {
                try {
                    messageChannel.send(MessageBuilder
                        .withPayload(objectMapper.writeValueAsString(order))
                        .build());
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            });
        }
    }
}
