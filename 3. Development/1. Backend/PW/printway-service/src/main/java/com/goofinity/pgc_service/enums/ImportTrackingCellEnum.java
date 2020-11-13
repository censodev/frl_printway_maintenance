package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Optional;

public enum ImportTrackingCellEnum {
    ORDER_NAME(0),
    ORDER_ID(1),
    ORDER_STATUS(2),
    SKU(3),
    SHIPPING_METHOD(4),
    TRACKING_NUMBER(5),
    TRACKING_URL(6);

    @Getter
    private int index;

    ImportTrackingCellEnum(int index) {
        this.index = index;
    }

    public static Optional<ImportTrackingCellEnum> getByName(final String enumName) {
        try {
            return Optional.of(ImportTrackingCellEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
