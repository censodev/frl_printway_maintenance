package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum OrderStatusEnum {
    PROCESSING,
    COMPLETED;

    public static Optional<OrderStatusEnum> getByName(final String enumName) {
        try {
            return Optional.of(OrderStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
