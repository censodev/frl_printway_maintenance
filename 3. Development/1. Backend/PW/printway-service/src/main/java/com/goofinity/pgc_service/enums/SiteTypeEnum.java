package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum SiteTypeEnum {
    WOO,
    SHOPIFY,
    VIRTUAL;

    public static Optional<SiteTypeEnum> getByName(final String enumName) {
        try {
            return Optional.of(SiteTypeEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
