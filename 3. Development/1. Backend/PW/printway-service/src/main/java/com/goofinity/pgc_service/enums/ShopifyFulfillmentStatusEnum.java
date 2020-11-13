package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Getter
public enum ShopifyFulfillmentStatusEnum {
    PENDING("pending"),
    FULFILLED("fulfilled"),
    PARTIAL("partial"),
    RESTOCKED("restocked");

    private String value;

    ShopifyFulfillmentStatusEnum(String value) {
        this.value = value;
    }

    public static Optional<ShopifyFulfillmentStatusEnum> get(final String enumName) {
        try {
            return Optional.of(ShopifyFulfillmentStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static List<String> getShopifyFulfillmentFailedStatus() {
        return Arrays.asList(RESTOCKED.value);
    }
}
