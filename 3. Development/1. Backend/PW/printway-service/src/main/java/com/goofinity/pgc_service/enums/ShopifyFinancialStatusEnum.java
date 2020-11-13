package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Getter
public enum ShopifyFinancialStatusEnum {
    PENDING("pending"),
    AUTHORIZED("authorized"),
    PARTIALLY_PAID("partially_paid"),
    PAID("paid"),
    PARTIALLY_REFUNDED("partially_refunded"),
    REFUNDED("refunded"),
    VOIDED("voided");

    private String value;

    ShopifyFinancialStatusEnum(String value) {
        this.value = value;
    }

    public static Optional<ShopifyFinancialStatusEnum> get(final String enumName) {
        try {
            return Optional.of(ShopifyFinancialStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static List<String> getShopifyFinanciaFailedStatus() {
        return Arrays.asList(PARTIALLY_REFUNDED.value, REFUNDED.value, VOIDED.value);
    }
}
