package com.goofinity.pgc_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderShippingAddressDTO {
    @NotEmpty
    private String orderId;

    private String firstName;

    private String lastName;

    private String company;

    private String address1;

    private String address2;

    private String city;

    private String province;

    @NotEmpty
    private String country;

    private String postcode;

    private String phone;
}
