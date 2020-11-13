package com.goofinity.pgc_service.crons;

import com.goofinity.pgc_service.domain.LineItem;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.dto.SendMailRequestDTO;
import com.goofinity.pgc_service.enums.ConfigEnum;
import com.goofinity.pgc_service.enums.EmailTagEnum;
import com.goofinity.pgc_service.enums.NotificationSettingEnum;
import com.goofinity.pgc_service.enums.ProduceStatusEnum;
import com.goofinity.pgc_service.repository.ConfigRepository;
import com.goofinity.pgc_service.repository.OrderRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.service.AmazonSESService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class CheckSendNotificationCron {
    private final Logger log = LoggerFactory.getLogger(CheckSendNotificationCron.class);

    private final int PAGE_SIZE = 200;
    private final OrderRepository orderRepository;
    private final ConfigRepository configRepository;
    private final UserRepository userRepository;
    private final AmazonSESService amazonSESService;

    public CheckSendNotificationCron(final OrderRepository orderRepository,
                                     final ConfigRepository configRepository,
                                     final UserRepository userRepository,
                                     final AmazonSESService amazonSESService) {
        this.orderRepository = orderRepository;
        this.configRepository = configRepository;
        this.userRepository = userRepository;
        this.amazonSESService = amazonSESService;
    }

    @Scheduled(cron = "${application.cron.checkSendNotification}")
    private void checkOrderHolding() {
        int page = 0;
        while (true) {
            List<String> filterStatus = Arrays.asList(
                ProduceStatusEnum.PENDING_DESIGN.name(),
                ProduceStatusEnum.ACTION_REQUIRED.name(),
                ProduceStatusEnum.NEED_PAY.name()
            );

            List<Order> orders = orderRepository.findAllByLineItems_StatusIn(
                filterStatus,
                PageRequest.of(page++, PAGE_SIZE));

            if (orders.isEmpty()) {
                break;
            }

            for (Order order : orders) {
                order.getLineItems().stream()
                    .filter(lineItem -> filterStatus.contains(lineItem.getStatus()))
                    .forEach(lineItem -> {
                        Instant now = Instant.now();

                        NotificationSettingEnum notificationSettingEnum =
                            NotificationSettingEnum.findByValue(lineItem.getLastSentSpreadHour()).get();
                        switch (notificationSettingEnum) {
                            case FIRST_TIME:
                            case SECOND_TIME:
                            case THIRD_TIME:
                            case FOUR_TIME:
                            case FINAL_TIME:
                                checkLastSent(order, lineItem, now, notificationSettingEnum.getNextValue());
                                break;
                        }
                    });

            }
            orderRepository.saveAll(orders);
        }
    }

    private void checkLastSent(Order order, LineItem lineItem, Instant now, int hour) {
        if (lineItem.getLastSentNotification()
            .plus(hour, ChronoUnit.HOURS).compareTo(now) <= 0) {
            sentNotification(order, lineItem, now, hour);
        }
    }

    private void sentNotification(Order order, LineItem lineItem, Instant now, int hour) {
        ConfigEnum.getByStatusAndHour(lineItem.getStatus(), hour).ifPresent(configEnum -> {
            configRepository.findByKey(configEnum.name()).ifPresent(config -> {
                String subject = EmailTagEnum.SUBJECT_PREFIX.getValue() + " ";
                switch (configEnum) {
                    case PENDING_DESIGN_6_HOURS:
                    case PENDING_DESIGN_24_HOURS:
                    case PENDING_DESIGN_48_HOURS:
                    case PENDING_DESIGN_72_HOURS:
                        subject += "Need upload design files";
                        break;
                    case NEED_PAY_6_HOURS:
                    case NEED_PAY_24_HOURS:
                    case NEED_PAY_48_HOURS:
                    case NEED_PAY_72_HOURS:
                        subject += "Order has not been paid for " + hour + " hours";
                        break;
                    case ACTION_REQUIRED_6_HOURS:
                    case ACTION_REQUIRED_24_HOURS:
                    case ACTION_REQUIRED_48_HOURS:
                    case ACTION_REQUIRED_72_HOURS:
                        subject += "Order is in \"Action required\" in " + hour + " hours";
                        break;
                }

                Map<String, String> tags = new HashMap<>();
                userRepository.findByEmailIgnoreCase(order.getSellerEmail()).ifPresent(user -> {
                    tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                });
                tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());
                tags.put(EmailTagEnum.LINE_ITEM_SKU.getValue(), lineItem.getSku());

                // Send notification here
                amazonSESService.requestSendMail(SendMailRequestDTO.builder()
                    .subject(subject)
                    .htmlText(config.getValue())
                    .toAddress(order.getSellerEmail())
                    .tags(tags)
                    .build());
            });

            lineItem.setLastSentNotification(now);
            lineItem.setLastSentSpreadHour(hour);
        });
    }
}
