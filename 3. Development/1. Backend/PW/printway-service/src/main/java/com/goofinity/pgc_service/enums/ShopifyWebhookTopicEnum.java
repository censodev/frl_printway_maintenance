package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Optional;

@Getter
public enum ShopifyWebhookTopicEnum {
    CANCELLED("orders/cancelled"),
    CREATE("orders/create"),
    FULFILLED("orders/fulfilled"),
    PAID("orders/paid"),
    PARTIALLY_FULFILLED("orders/partially_fulfilled"),
    UPDATED("orders/updated"),
    DELETE("orders/delete");

    private String value;

    ShopifyWebhookTopicEnum(String value) {
        this.value = value;
    }

    public static Optional<ShopifyWebhookTopicEnum> get(final String enumName) {
        try {
            return Optional.of(ShopifyWebhookTopicEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
