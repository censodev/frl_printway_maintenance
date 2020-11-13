package com.goofinity.pgc_service.enums;

import lombok.Getter;

import java.util.Optional;

public enum ImportOrderCellEnum {
    ORDER_ID(0, "Order Id"),
    FIRST_NAME(1, "First Name"),
    LAST_NAME(2, "Last Name"),
    COMPANY(3, "Company"),
    ADDRESS_1(4, "Address 1"),
    ADDRESS_2(5, "Address 2"),
    CITY(6, "City"),
    PROVINCE(7, "Province"),
    COUNTRY(8, "Country"),
    POSTCODE(9, "Postcode"),
    PHONE(10, "Phone"),
    ITEM_SKU(11, "Item sku"),
    ITEM_PRICE(12, "Item price"),
    ITEM_QUANTITY(13, "Item quantity"),
    SHIPPING_METHOD(14, "Shipping method"),
    ERROR(15, "Error"),;

    @Getter
    private int index;

    @Getter
    private String title;

    ImportOrderCellEnum(int index, String title) {
        this.index = index;
        this.title = title;
    }

    public static Optional<ImportOrderCellEnum> getByName(final String enumName) {
        try {
            return Optional.of(ImportOrderCellEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
