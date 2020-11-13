package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum ImageTypeEnum {
    THUMB,
    ORIGINAL;

    public static Optional<ImageTypeEnum> getByName(final String enumName) {
        try {
            return Optional.of(ImageTypeEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
