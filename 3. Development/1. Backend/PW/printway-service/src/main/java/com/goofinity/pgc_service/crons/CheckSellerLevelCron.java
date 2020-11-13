package com.goofinity.pgc_service.crons;

import com.goofinity.pgc_service.domain.SellerLevel;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.dto.SendMailRequestDTO;
import com.goofinity.pgc_service.enums.ConfigEnum;
import com.goofinity.pgc_service.enums.EmailTagEnum;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.ConfigRepository;
import com.goofinity.pgc_service.repository.SellerLevelRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.service.AmazonSESService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class CheckSellerLevelCron {
    private final Logger log = LoggerFactory.getLogger(CheckSellerLevelCron.class);

    private final int PAGE_SIZE = 200;
    private final UserRepository userRepository;
    private final SellerLevelRepository sellerLevelRepository;
    private final ConfigRepository configRepository;
    private final AmazonSESService amazonSESService;

    public CheckSellerLevelCron(final UserRepository userRepository,
                                final SellerLevelRepository sellerLevelRepository,
                                final ConfigRepository configRepository,
                                final AmazonSESService amazonSESService) {
        this.userRepository = userRepository;
        this.sellerLevelRepository = sellerLevelRepository;
        this.configRepository = configRepository;
        this.amazonSESService = amazonSESService;
    }

    @Scheduled(cron = "${application.cron.checkSellerLevel}")
    private void checkSellerLevel() {
        List<SellerLevel> levels = sellerLevelRepository.findAll(Sort.by(Sort.Direction.DESC, "totalOrder"));

        int page = 0;
        while (true) {
            List<User> users = userRepository.findAllByActivatedTrueAndRolesContains(
                RoleEnum.ROLE_SELLER_CONSTANT,
                PageRequest.of(page++, PAGE_SIZE));

            if (users.isEmpty()) {
                break;
            }

            users.forEach(user -> {
                for (SellerLevel level : levels) {
                    if ((1.0 * user.getTotalOrder() / level.getTotalOrder()) * 100 >= level.getPercentToAlert()
                        && !user.isSentMailNextLevel()) {
                        configRepository.findByKey(ConfigEnum.SELLER_NEXT_LEVEL.name()).ifPresent(config -> {
                            Map<String, String> tags = new HashMap<>();
                            tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                            tags.put(EmailTagEnum.NEXT_LEVEL.getValue(), level.getName());
                            tags.put(EmailTagEnum.TOTAL_ORDER.getValue(), user.getTotalOrder() + "");
                            tags.put(EmailTagEnum.TOTAL_ORDER_NEXT_LEVEL.getValue(), level.getTotalOrder() + "");

                            // Send mail alert next level here
                            amazonSESService.requestSendMail(SendMailRequestDTO.builder()
                                .subject(EmailTagEnum.SUBJECT_PREFIX.getValue() + " Prepare to level up")
                                .htmlText(config.getValue())
                                .toAddress(user.getEmail())
                                .tags(tags)
                                .build());
                            user.setSentMailNextLevel(true);
                        });
                        break;
                    }
                    if (!(user.getForceSellerLevel() != null
                        && user.getForceSellerLevel().getTotalOrder() > level.getTotalOrder())
                        && user.getTotalOrder() >= level.getTotalOrder()) {
                        if (user.getSellerLevel() == null || !user.getSellerLevel().getId().equals(level.getId())) {
                            user.setSentMailNextLevel(false);
                        }
                        user.setSellerLevel(level);
                        break;
                    }
                }
            });
            userRepository.saveAll(users);
        }
    }
}
