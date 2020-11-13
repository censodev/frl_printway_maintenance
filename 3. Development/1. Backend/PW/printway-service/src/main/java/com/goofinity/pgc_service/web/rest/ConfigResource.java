package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.Config;
import com.goofinity.pgc_service.domain.NotificationSetting;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.enums.ConfigEnum;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.ConfigRepository;
import com.goofinity.pgc_service.repository.NotificationSettingRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/config")
public class ConfigResource {
    private static final Logger log = LoggerFactory.getLogger(ConfigResource.class);
    private final ConfigRepository configRepository;
    private final NotificationSettingRepository notificationSettingRepository;
    private final UserRepository userRepository;

    public ConfigResource(final ConfigRepository configRepository,
                          final NotificationSettingRepository notificationSettingRepository,
                          final UserRepository userRepository) {
        this.configRepository = configRepository;
        this.notificationSettingRepository = notificationSettingRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/content")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<Config>> getContentSetting() {
        log.debug("Get content configs");

        return new ResponseEntity<>(configRepository.findAllByKeyIn(Arrays.asList(
            ConfigEnum.PENDING_DESIGN_6_HOURS.name(),
            ConfigEnum.PENDING_DESIGN_24_HOURS.name(),
            ConfigEnum.PENDING_DESIGN_48_HOURS.name(),
            ConfigEnum.PENDING_DESIGN_72_HOURS.name(),
            ConfigEnum.ACTION_REQUIRED_6_HOURS.name(),
            ConfigEnum.ACTION_REQUIRED_24_HOURS.name(),
            ConfigEnum.ACTION_REQUIRED_48_HOURS.name(),
            ConfigEnum.ACTION_REQUIRED_72_HOURS.name(),
            ConfigEnum.NEED_PAY_6_HOURS.name(),
            ConfigEnum.NEED_PAY_24_HOURS.name(),
            ConfigEnum.NEED_PAY_48_HOURS.name(),
            ConfigEnum.NEED_PAY_72_HOURS.name(),
            ConfigEnum.SELLER_NEXT_LEVEL.name()
        )), HttpStatus.OK);
    }

    @GetMapping("/admin/notification")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<NotificationSetting> getAdminNotificationSetting() {
        log.debug("Get notification configs");

        return new ResponseEntity<>(notificationSettingRepository.findById(RoleEnum.ROLE_ADMIN_CONSTANT)
            .orElseThrow(() -> new ObjectNotFoundException("notification_setting")), HttpStatus.OK);
    }

    @GetMapping("/notification")
    public ResponseEntity<NotificationSetting> getNotificationSetting() {
        log.debug("Get notification configs");

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);

        return new ResponseEntity<>(notificationSettingRepository.findById(user.getId())
            .orElseThrow(() -> new ObjectNotFoundException("notification_setting")), HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<Config> updateAdminConfig(@Valid @RequestBody Config config) {
        log.debug("Update admin config: {}", config);

        Config existConfig = configRepository.findByKey(config.getKey())
            .orElseThrow(() -> new ObjectNotFoundException("admin_config"));
        switch (ConfigEnum.valueOf(config.getKey())) {
            case AUTO_APPROVE:
                existConfig.setValue(Boolean.parseBoolean(config.getValue()) + "");
                break;
            case PENDING_DESIGN_6_HOURS:
            case PENDING_DESIGN_24_HOURS:
            case PENDING_DESIGN_48_HOURS:
            case PENDING_DESIGN_72_HOURS:
            case ACTION_REQUIRED_6_HOURS:
            case ACTION_REQUIRED_24_HOURS:
            case ACTION_REQUIRED_48_HOURS:
            case ACTION_REQUIRED_72_HOURS:
            case NEED_PAY_6_HOURS:
            case NEED_PAY_24_HOURS:
            case NEED_PAY_48_HOURS:
            case NEED_PAY_72_HOURS:
            case SELLER_NEXT_LEVEL:
                if (StringUtils.isEmpty(config.getValue())) {
                    throw new InvalidDataException("value");
                } else {
                    existConfig.setValue(config.getValue());
                }
                break;
        }
        configRepository.save(existConfig);

        return new ResponseEntity<>(existConfig, HttpStatus.OK);
    }

    @PutMapping("/content")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<Config>> updateContentAdminConfig(@Valid @RequestBody List<Config> configs) {
        log.debug("Update bulk admin config: {}", configs);

        configs.forEach(adminConfig -> {
            Config existConfig = configRepository.findByKey(adminConfig.getKey())
                .orElseThrow(() -> new ObjectNotFoundException("admin_config"));
            switch (ConfigEnum.valueOf(adminConfig.getKey())) {
                case PENDING_DESIGN_6_HOURS:
                case PENDING_DESIGN_24_HOURS:
                case PENDING_DESIGN_48_HOURS:
                case PENDING_DESIGN_72_HOURS:
                case ACTION_REQUIRED_6_HOURS:
                case ACTION_REQUIRED_24_HOURS:
                case ACTION_REQUIRED_48_HOURS:
                case ACTION_REQUIRED_72_HOURS:
                case NEED_PAY_6_HOURS:
                case NEED_PAY_24_HOURS:
                case NEED_PAY_48_HOURS:
                case NEED_PAY_72_HOURS:
                case SELLER_NEXT_LEVEL:
                    if (StringUtils.isEmpty(adminConfig.getValue())) {
                        throw new InvalidDataException("value");
                    } else {
                        existConfig.setValue(adminConfig.getValue());
                    }
                    break;
            }
            configRepository.save(existConfig);
        });

        return new ResponseEntity<>(configs, HttpStatus.OK);
    }

    @PutMapping("/admin/notification")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<List<Config>> updateAdminNotificationSetting(@Valid @RequestBody List<Config> configs) {
        log.debug("Update admin notification config: {}", configs);

        NotificationSetting notificationSetting = notificationSettingRepository.findById(RoleEnum.ROLE_ADMIN_CONSTANT)
            .orElseThrow(() -> new ObjectNotFoundException("notification_setting"));

        updateConfig(configs, notificationSetting);

        return new ResponseEntity<>(configs, HttpStatus.OK);
    }

    @PutMapping("/notification")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_SELLER_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPLIER_CONSTANT + "\")")
    public ResponseEntity<List<Config>> updateNotificationSetting(@Valid @RequestBody List<Config> configs) {
        log.debug("Update notification config: {}", configs);

        User user = userRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(SecurityException::new);

        NotificationSetting notificationSetting = notificationSettingRepository.findById(user.getId())
            .orElseThrow(() -> new ObjectNotFoundException("notification_setting"));

        updateConfig(configs, notificationSetting);

        return new ResponseEntity<>(configs, HttpStatus.OK);
    }

    private void updateConfig(List<Config> configs, NotificationSetting notificationSetting) {
        configs.forEach(config -> {
            switch (ConfigEnum.valueOf(config.getKey())) {
                case NEWS_UPDATE_EMAIL:
                case NEWS_UPDATE_PUSH:
                case ORDER_NEW_EMAIL:
                case ORDER_NEW_PUSH:
                case ORDER_UPDATE_PENDING_DESIGN_EMAIL:
                case ORDER_UPDATE_PENDING_DESIGN_PUSH:
                case ORDER_UPDATE_PENDING_EMAIL:
                case ORDER_UPDATE_PENDING_PUSH:
                case ORDER_UPDATE_PROCESSING_EMAIL:
                case ORDER_UPDATE_PROCESSING_PUSH:
                case ORDER_UPDATE_ON_HOLD_EMAIL:
                case ORDER_UPDATE_ON_HOLD_PUSH:
                case ORDER_UPDATE_SHIPPED_EMAIL:
                case ORDER_UPDATE_SHIPPED_PUSH:
                case ORDER_UPDATE_CANCEL_EMAIL:
                case ORDER_UPDATE_CANCEL_PUSH:
                case ORDER_UPDATE_REFUND_EMAIL:
                case ORDER_UPDATE_REFUND_PUSH:
                case BALANCE_UPDATE_EMAIL:
                case BALANCE_UPDATE_PUSH:
                    if (StringUtils.isEmpty(config.getValue())) {
                        throw new InvalidDataException("value");
                    } else {
                        notificationSetting.getConfigs().forEach(setting -> {
                            if (config.getKey().equals(setting.getKey())) {
                                setting.setValue(config.getValue());
                            }
                        });
                    }
                    break;
            }
        });
        notificationSettingRepository.save(notificationSetting);
    }
}
