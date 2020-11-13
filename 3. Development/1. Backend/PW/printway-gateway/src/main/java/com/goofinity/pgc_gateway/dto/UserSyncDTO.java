package com.goofinity.pgc_gateway.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSyncDTO {
    private String email;

    private String firstName;

    private String lastName;

    private String phone;

    private String address;

    private Set<String> roles;

    private Instant dob;

    private String fbLink;

    private String note;

    private boolean activated;

    private SellerLevelDTO sellerLevel;

    private int orderHoldingHour;
}
