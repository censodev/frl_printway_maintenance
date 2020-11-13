package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Getter
public enum EmailTagEnum {
    SUBJECT_PREFIX("[PrintWay]"),
    CUSTOMER_EMAIL("[customer_email]"),
    ADDRESS("[address]"),
    SELLER_EMAIL("[seller_email]"),
    SELLER_PHONE_NUMBER("[seller_phone_number]"),
    SELLER_FIRST_NAME("[seller_first_name]"),
    NEXT_LEVEL("[next_level]"),
    TOTAL_ORDER("[total_order]"),
    TOTAL_ORDER_NEXT_LEVEL("[total_order_next_level]"),
    ORDER_NAME("[order_name]"),
    LINE_ITEM_SKU("[line_item_sku]"),
    IMAGE_URL("[image_url]"),
    IMAGE_SKU("[image_sku]"),
    FIRST_NAME("[first_name]"),
    DEPOSIT_AMOUNT("[deposit_amount]"),
    CURRENCY("[currency]"),
    DEPOSIT_NOTE("[deposit_note]"),
    TRANSACTION_ID("[transaction_id]"),
    REJECTED_REASON("[rejected_reason]"),
    NEWS_CONTENT("[news_content]"),
    NEWS_SUBJECT("[news_subject]"),
    TRACKING_NUMBER("[tracking_number]"),
    TRACKING_URL("[tracking_url]"),
    CARRIER_NAME("[carrier_name]"),
    REFUND_AMOUNT("[refund_amount]");

    private String value;

    EmailTagEnum(String value) {
        this.value = value;
    }

    public static Optional<EmailTagEnum> get(final String enumName) {
        try {
            return Optional.of(EmailTagEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static Optional<EmailTagEnum> findByValue(final String value) {
        for (EmailTagEnum emailTagEnum : values()) {
            if (emailTagEnum.value.equals(value)) {
                return Optional.of(emailTagEnum);
            }
        }

        return Optional.empty();
    }

    public static List<String> getEmailTags() {
        List<String> tags = new ArrayList<>();
        for (EmailTagEnum value : values()) {
            tags.add(value.getValue());
        }
        return tags;
    }
}
