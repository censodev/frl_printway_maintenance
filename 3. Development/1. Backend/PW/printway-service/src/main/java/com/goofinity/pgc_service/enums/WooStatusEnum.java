package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Getter
public enum WooStatusEnum {
    PENDING("pending"),
    PROCESSING("processing"),
    ON_HOLD("on-hold"),
    COMPLETED("completed"),
    CANCELLED("cancelled"),
    REFUNDED("refunded"),
    FAILED("failed"),
    TRASH("trash"),
    NONE("none");

    private String value;

    WooStatusEnum(String value) {
        this.value = value;
    }

    public static Optional<WooStatusEnum> get(final String enumName) {
        try {
            return Optional.of(WooStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static Optional<WooStatusEnum> findByValue(final String value) {
        for (WooStatusEnum statusEnum : values()) {
            if (statusEnum.value.equals(value)) {
                return Optional.of(statusEnum);
            }
        }

        return Optional.empty();
    }

    public static List<String> getWooFailedStatuses() {
        return Arrays.asList(CANCELLED.value, REFUNDED.value, FAILED.value);
    }

    public static List<String> getWooStatuses() {
        List<String> statuses = new ArrayList<>();
        for (WooStatusEnum value : values()) {
            statuses.add(value.getValue());
        }
        return statuses;
    }
}
