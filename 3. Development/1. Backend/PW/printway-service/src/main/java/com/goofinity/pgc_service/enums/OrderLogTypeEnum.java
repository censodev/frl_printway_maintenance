package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum OrderLogTypeEnum {
    ORDER_CREATED,
    COOLING_OFF,
    INVALID_SHIPPING_COUNTRY,
    PENDING_DESIGN,
    CHOOSE_SUPPLIER,
    CHOOSE_CARRIER,
    NEED_PAY_COOLING_OFF,
    PAID,
    NOT_ENOUGH_BALANCE,
    PROCESSING,
    WAITING_FOR_ADMIN_APPROVE,
    ACTION_REQUIRE,
    ON_HOLD,
    UPDATE_SHIPPING_ADDRESS,
    UPDATE_DESIGN,
    SOLVE_ON_HOLD,
    SOLVE_ACTION_REQUIRED,
    APPROVED_REQUEST_CANCEL,
    REJECTED_REQUEST_CANCEL,
    IN_PRODUCTION,
    SHIPPED,
    UPDATED_TRACKING,
    SUPPLIER_REQUEST_CANCEL,
    CANCELED,
    AUTO_REFUNDED,
    REFUNDED;

    public static Optional<OrderLogTypeEnum> getByName(final String enumName) {
        try {
            return Optional.of(OrderLogTypeEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
