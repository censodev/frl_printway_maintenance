package com.goofinity.pgc_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.goofinity.pgc_service.domain.SellerLevel;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;

/**
 * A DTO representing a user, with his authorities.
 **/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private String id;

    @NotEmpty
    @Email
    @Size(min = 5, max = 254)
    private String email;

    @Size(max = 50)
    @NotEmpty
    private String firstName;

    @Size(max = 50)
    @NotEmpty
    private String lastName;

    @Size(max = 256)
    private String imageUrl;

    private boolean activated = false;

    private String createdBy;

    private Instant createdDate;

    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private Set<String> roles;

    private String phone;

    private String address;

    private String fbLink;

    private Instant dob;

    private String note;

    private String timeZone;

    private Boolean autoApprove;

    private int orderHoldingHour;

    private SellerLevel sellerLevel;
}
