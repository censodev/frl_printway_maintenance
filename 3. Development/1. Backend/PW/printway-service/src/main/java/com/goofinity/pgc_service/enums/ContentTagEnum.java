package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum ContentTagEnum {
    PHONE_NUMBER,
    EMAIL,
    SITE_URL,

    ORDER_ID,
    ORDER_NAME,
    ORDER_CREATED_DATE,
    ORDER_UPDATED_DATE,
    ORDER_GATEWAY,
    ORDER_TOTAL,
    ORDER_SUB_TOTAL,
    ORDER_CURRENCY,
    ORDER_ITEMS_COUNT,
    FINANCIAL_STATUS,
    FULFILLMENT_STATUS,

    BILLING_FIRST_NAME,
    BILLING_LAST_NAME,
    BILLING_PHONE,
    BILLING_COUNTRY,
    BILLING_CITY,
    BILLING_PROVINCE,
    BILLING_ADDRESS,

    SHIPPING_FIRST_NAME,
    SHIPPING_LAST_NAME,
    SHIPPING_PHONE,
    SHIPPING_COUNTRY,
    SHIPPING_CITY,
    SHIPPING_PROVINCE,
    SHIPPING_ADDRESS,

    REFUND_CREATED_DATE,
    REFUND_PROCESS_DATE,
    REFUND_NOTE,
    REFUND_USER_ID;

    public static Optional<ContentTagEnum> get(final String enumName) {
        try {
            return Optional.of(ContentTagEnum.valueOf(enumName.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
