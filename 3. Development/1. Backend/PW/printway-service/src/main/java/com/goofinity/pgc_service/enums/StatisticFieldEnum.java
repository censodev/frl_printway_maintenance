package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum StatisticFieldEnum {
    ORDER,
    USER,
    SITE,
    BALANCE,
    REVENUE,
    PROFIT,
    CUSTOM_ADD,
    CUSTOM_SUBTRACT;

    public static Optional<StatisticFieldEnum> getByName(final String enumName) {
        try {
            return Optional.of(StatisticFieldEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
