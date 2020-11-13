package com.goofinity.pgc_service.dto.woo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class WooAddress implements Serializable {
    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    private String company;

    @JsonProperty("address_1")
    private String address1;

    @JsonProperty("address_2")
    private String address2;

    private String city;
    private String state;
    private String postcode;
    private String country;
    private String email;
    private String phone;

    @Override
    public boolean equals(Object obj) {
        WooAddress address = (WooAddress) obj;
        return address != null
            && Objects.equals(address.getFirstName(), firstName)
            && Objects.equals(address.getLastName(), lastName)
            && Objects.equals(address.getAddress1(), address1)
            && Objects.equals(address.getCity(), city)
            && Objects.equals(address.getState(), state)
            && Objects.equals(address.getPostcode(), postcode)
            && Objects.equals(address.getCountry(), country)
            && Objects.equals(address.getPhone(), phone);
    }
}
