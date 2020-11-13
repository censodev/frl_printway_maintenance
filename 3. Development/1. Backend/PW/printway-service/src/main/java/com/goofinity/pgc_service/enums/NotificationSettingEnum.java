package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Optional;

@Getter
public enum NotificationSettingEnum {
    FIRST_TIME(0, 6),
    SECOND_TIME(6, 24),
    THIRD_TIME(24, 48),
    FOUR_TIME(48, 72),
    FINAL_TIME(72, 72);

    private final int value;
    private final int nextValue;

    NotificationSettingEnum(int value, int nextValue) {
        this.value = value;
        this.nextValue = nextValue;
    }

    public static Optional<NotificationSettingEnum> get(final String enumName) {
        try {
            return Optional.of(NotificationSettingEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static Optional<NotificationSettingEnum> findByValue(final int hour) {
        for (NotificationSettingEnum notificationSettingEnum : values()) {
            if (notificationSettingEnum.value == hour) {
                return Optional.of(notificationSettingEnum);
            }
        }

        return Optional.empty();
    }
}
