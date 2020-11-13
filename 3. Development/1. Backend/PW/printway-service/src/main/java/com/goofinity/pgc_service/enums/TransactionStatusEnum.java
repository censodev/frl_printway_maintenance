package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum TransactionStatusEnum {
    APPROVED,
    REJECTED,
    PENDING,
    DEBT;

    public static Optional<TransactionStatusEnum> getByName(final String enumName) {
        try {
            return Optional.of(TransactionStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
