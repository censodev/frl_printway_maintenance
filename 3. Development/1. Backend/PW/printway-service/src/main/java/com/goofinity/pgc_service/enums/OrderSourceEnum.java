package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum OrderSourceEnum {
    SITE,
    IMPORT,
    DUPLICATE;

    public static Optional<OrderSourceEnum> get(final String enumName) {
        try {
            return Optional.of(OrderSourceEnum.valueOf(enumName.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
