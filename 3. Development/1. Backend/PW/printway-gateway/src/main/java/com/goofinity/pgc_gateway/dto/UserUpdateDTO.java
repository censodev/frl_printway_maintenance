package com.goofinity.pgc_gateway.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder(toBuilder = true)
public class UserUpdateDTO {
    @NotEmpty
    private String email;

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

    @NotEmpty
    private Set<String> roles;

    private String phone;
    private String address;
    private String fbLink;
    private Instant dob;
    private String note;
    private String password;
    private SellerLevelDTO sellerLevel;
    private int orderHoldingHour;
}
