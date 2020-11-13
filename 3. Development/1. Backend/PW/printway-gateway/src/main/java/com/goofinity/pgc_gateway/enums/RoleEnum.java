package com.goofinity.pgc_gateway.enums;

import java.util.Optional;

public enum RoleEnum {
    ROLE_ADMIN,
    ROLE_SUPPORTER,
    ROLE_LISTING,
    ROLE_ACCOUNTING,
    ROLE_SELLER,
    ROLE_SUPPLIER;

    public final static String ROLE_ADMIN_CONSTANT = "ROLE_ADMIN";
    public final static String ROLE_SUPPORTER_CONSTANT = "ROLE_SUPPORTER";
    public final static String ROLE_LISTING_CONSTANT = "ROLE_LISTING";
    public final static String ROLE_ACCOUNTING_CONSTANT = "ROLE_ACCOUNTING";
    public final static String ROLE_SELLER_CONSTANT = "ROLE_SELLER";
    public final static String ROLE_SUPPLIER_CONSTANT = "ROLE_SUPPLIER";

    public static Optional<RoleEnum> getByName(final String enumName) {
        try {
            return Optional.of(RoleEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
