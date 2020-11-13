package com.goofinity.pgc_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OrderImportLineErrorDTO {
    private String orderId;
    private String firstName;
    private String lastName;
    private String company;
    private String address1;
    private String address2;
    private String city;
    private String province;
    private String country;
    private String postcode;
    private String phone;
    private String itemSku;
    private String itemPrice;
    private String itemQuantity;
    private String shippingMethod;
    private String error;
}
