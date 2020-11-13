package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Optional;

@Getter
public enum WooWebhookTopicEnum {
    CREATED("order.created"),
    UPDATED("order.updated"),
    DELETED("order.deleted"),
    RESTORED("order.restored");

    private String value;

    WooWebhookTopicEnum(String value) {
        this.value = value;
    }

    public static Optional<WooWebhookTopicEnum> get(final String enumName) {
        try {
            return Optional.of(WooWebhookTopicEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
