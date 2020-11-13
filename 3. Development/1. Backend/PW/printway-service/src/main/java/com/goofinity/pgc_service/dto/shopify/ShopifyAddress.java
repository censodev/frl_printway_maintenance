package com.goofinity.pgc_service.dto.shopify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShopifyAddress {
    private Long id;

    @JsonProperty("customer_id")
    private Long customerId;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    private String company;
    private String address1;
    private String address2;
    private String city;
    private String province;
    private String country;
    private String zip;
    private String phone;
    private String name;

    @JsonProperty("province_code")
    private String provinceCode;

    @JsonProperty("country_code")
    private String countryCode;

    @JsonProperty("country_name")
    private String countryName;

    private String latitude;
    private String longitude;

    @JsonProperty("default")
    private boolean isDefault;

    @Override
    public boolean equals(Object obj) {
        ShopifyAddress address = (ShopifyAddress) obj;
        return address != null
            && Objects.equals(address.getFirstName(), firstName)
            && Objects.equals(address.getLastName(), lastName)
            && Objects.equals(address.getAddress1(), address1)
            && Objects.equals(address.getCity(), city)
            && Objects.equals(address.getProvince(), province)
            && Objects.equals(address.getCountry(), country)
            && Objects.equals(address.getPhone(), phone);
    }
}

