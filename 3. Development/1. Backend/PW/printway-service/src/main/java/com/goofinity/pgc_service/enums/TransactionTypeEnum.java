package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum TransactionTypeEnum {
    DEPOSIT,
    PAID_ITEM,
    PAID_SUPPLIER,
    DEPOSIT_SUPPLIER,
    REFUND,
    CUSTOM,
    CUSTOM_ADD,
    CUSTOM_SUBTRACT;

    public static Optional<TransactionTypeEnum> getByName(final String enumName) {
        try {
            return Optional.of(TransactionTypeEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
