package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum ConfigEnum {
    AUTO_APPROVE,
    PENDING_DESIGN_6_HOURS,
    PENDING_DESIGN_24_HOURS,
    PENDING_DESIGN_48_HOURS,
    PENDING_DESIGN_72_HOURS,
    ACTION_REQUIRED_6_HOURS,
    ACTION_REQUIRED_24_HOURS,
    ACTION_REQUIRED_48_HOURS,
    ACTION_REQUIRED_72_HOURS,
    NEED_PAY_6_HOURS,
    NEED_PAY_24_HOURS,
    NEED_PAY_48_HOURS,
    NEED_PAY_72_HOURS,
    SELLER_NEXT_LEVEL,
    NEWS_UPDATE_EMAIL,
    NEWS_UPDATE_PUSH,
    ORDER_NEW_EMAIL,
    ORDER_NEW_PUSH,
    ORDER_UPDATE_PROCESSING_EMAIL,
    ORDER_UPDATE_PROCESSING_PUSH,
    ORDER_UPDATE_ON_HOLD_EMAIL,
    ORDER_UPDATE_ON_HOLD_PUSH,
    ORDER_UPDATE_CANCEL_EMAIL,
    ORDER_UPDATE_CANCEL_PUSH,
    ORDER_UPDATE_REFUND_EMAIL,
    ORDER_UPDATE_REFUND_PUSH,
    ORDER_UPDATE_SHIPPED_EMAIL,
    ORDER_UPDATE_SHIPPED_PUSH,
    ORDER_UPDATE_PENDING_DESIGN_EMAIL,
    ORDER_UPDATE_PENDING_DESIGN_PUSH,
    ORDER_UPDATE_PENDING_EMAIL,
    ORDER_UPDATE_PENDING_PUSH,
    BALANCE_UPDATE_EMAIL,
    BALANCE_UPDATE_PUSH;

    public static Optional<ConfigEnum> getByName(final String enumName) {
        try {
            return Optional.of(ConfigEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static Optional<ConfigEnum> getByStatusAndHour(final String status, final int hour) {
        switch (ProduceStatusEnum.getByName(status).get())  {
            case PENDING_DESIGN:
                return getConfigEnum(hour, PENDING_DESIGN_6_HOURS, PENDING_DESIGN_24_HOURS, PENDING_DESIGN_48_HOURS,
                    PENDING_DESIGN_72_HOURS);
            case ACTION_REQUIRED:
                return getConfigEnum(hour, ACTION_REQUIRED_6_HOURS, ACTION_REQUIRED_24_HOURS, ACTION_REQUIRED_48_HOURS,
                    ACTION_REQUIRED_72_HOURS);
            case NEED_PAY:
                return getConfigEnum(hour, NEED_PAY_6_HOURS, NEED_PAY_24_HOURS, NEED_PAY_48_HOURS, NEED_PAY_72_HOURS);
            default:
                return Optional.empty();
        }
    }

    private static Optional<ConfigEnum> getConfigEnum(int hour, ConfigEnum config6Hours, ConfigEnum config24Hours,
                                                      ConfigEnum config48Hours, ConfigEnum config72Hours) {
        switch (hour) {
            case 6:
                return Optional.of(config6Hours);
            case 24:
                return Optional.of(config24Hours);
            case 48:
                return Optional.of(config48Hours);
            case 72:
                return Optional.of(config72Hours);
            default:
                return Optional.empty();
        }
    }
}
