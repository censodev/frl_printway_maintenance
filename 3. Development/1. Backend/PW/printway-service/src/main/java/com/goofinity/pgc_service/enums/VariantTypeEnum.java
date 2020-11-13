package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Optional;

public enum VariantTypeEnum {
    TYPE("Type"),
    SIZE("Size"),
    GENDER("Gender"),
    COLOR("Color"),
    PACK("Pack"),
    EXTRA("Extra");

    @Getter
    private String value;

    VariantTypeEnum(String value) {
        this.value = value;
    }

    public static Optional<VariantTypeEnum> get(final String enumName) {
        try {
            return Optional.of(VariantTypeEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
