package com.goofinity.pgc_gateway.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.goofinity.pgc_gateway.dto.SellerLevelDTO;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.index.Indexed;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * A user.
 */
@org.springframework.data.mongodb.core.mapping.Document(collection = "jhi_user")
@TypeAlias("user")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class User extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Email
    @Size(min = 5, max = 254)
    @Indexed
    private String email;

    private String phone;

    private String address;

    private String fbLink;

    private Instant dob;

    private String note;

    @JsonIgnore
    @NotNull
    @Size(min = 60, max = 60)
    private String password;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    private boolean activated = false;

    @Size(max = 256)
    private String imageUrl;

    @Size(max = 20)
    @JsonIgnore
    private String activationKey;

    @Size(max = 20)
    @JsonIgnore
    private String resetKey;

    private Instant resetDate = null;

    @JsonIgnore
    private Set<String> roles;

    @Transient
    private SellerLevelDTO sellerLevel;

    @Transient
    private int orderHoldingHour;
}
