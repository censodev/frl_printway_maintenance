package com.goofinity.pgc_service.crons;

import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.enums.ProduceStatusEnum;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.LineItemStatisticRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
public class ResetOrderStatisticCron {
    private final Logger log = LoggerFactory.getLogger(ResetOrderStatisticCron.class);

    private final int PAGE_SIZE = 200;
    private final UserRepository userRepository;
    private final LineItemStatisticRepository lineItemStatisticRepository;
    private final OrderService orderService;

    public ResetOrderStatisticCron(final UserRepository userRepository,
                                   final LineItemStatisticRepository lineItemStatisticRepository,
                                   final OrderService orderService) {
        this.userRepository = userRepository;
        this.lineItemStatisticRepository = lineItemStatisticRepository;
        this.orderService = orderService;
    }

    @Scheduled(cron = "${application.cron.resetOrderStatistic}")
    private void resetOrderStatistic() {
        // Reset for ADMIN
        lineItemStatisticRepository.findById(RoleEnum.ROLE_ADMIN_CONSTANT).ifPresent(lineItemStatistic -> {
            for (Map.Entry<String, Long> statusEntry : lineItemStatistic.getStatistic().entrySet()) {
                if (statusEntry.getKey().equals(ProduceStatusEnum.ALL.name())) {
                    statusEntry.setValue((long) orderService.countAllForAdmin());
                } else {
                    statusEntry.setValue((long) orderService.countForAdminByStatus(statusEntry.getKey()));
                }
            }
            lineItemStatisticRepository.save(lineItemStatistic);
        });

        int page = 0;
        while (true) {
            List<User> users = userRepository.findAllByListRoles(
                Stream.of(RoleEnum.ROLE_SELLER_CONSTANT, RoleEnum.ROLE_SUPPLIER_CONSTANT).collect(Collectors.toSet()),
                PageRequest.of(page++, PAGE_SIZE));

            if (users.isEmpty()) {
                break;
            }

            for (User user : users) {
                // Reset for SELLER
                if (user.getRoles().contains(RoleEnum.ROLE_SELLER_CONSTANT)) {
                    lineItemStatisticRepository.findById(user.getEmail()).ifPresent(lineItemStatistic -> {
                        for (Map.Entry<String, Long> statusEntry : lineItemStatistic.getStatistic().entrySet()) {
                            if (statusEntry.getKey().equals(ProduceStatusEnum.ALL.name())) {
                                statusEntry.setValue((long) orderService.countAllForSeller(user.getEmail()));
                            } else {
                                statusEntry.setValue((long) orderService.countForSellerByStatus(user.getEmail(), statusEntry.getKey()));
                            }
                        }
                        lineItemStatisticRepository.save(lineItemStatistic);
                    });
                } else {
                    // Reset for SUPPLIER
                    lineItemStatisticRepository.findById(user.getId()).ifPresent(lineItemStatistic -> {
                        for (Map.Entry<String, Long> statusEntry : lineItemStatistic.getStatistic().entrySet()) {
                            if (statusEntry.getKey().equals(ProduceStatusEnum.ALL.name())) {
                                statusEntry.setValue((long) orderService.countAllForSupplier(user.getId()));
                            } else {
                                statusEntry.setValue((long) orderService.countForSupplierByStatus(user.getId(), statusEntry.getKey()));
                            }
                        }
                        lineItemStatisticRepository.save(lineItemStatistic);
                    });
                }
            }
        }
    }
}
