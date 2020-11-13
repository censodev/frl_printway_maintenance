package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum NewsTypeEnum {
    NEWS,
    URGENT_NOTE;

    public static Optional<NewsTypeEnum> getByName(final String enumName) {
        try {
            return Optional.of(NewsTypeEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
