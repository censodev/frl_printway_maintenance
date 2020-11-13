package com.goofinity.pgc_service.enums;

import java.util.Optional;

public enum SiteStatusEnum {
    ACTIVE,
    IN_ACTIVE,
    REMOVE;

    public static Optional<SiteStatusEnum> getByName(final String enumName) {
        try {
            return Optional.of(SiteStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
