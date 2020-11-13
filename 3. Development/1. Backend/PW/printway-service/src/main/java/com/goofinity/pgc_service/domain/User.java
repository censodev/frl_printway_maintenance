package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.Set;

@Document(collection = "user")
@TypeAlias("user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"target"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User extends AbstractAuditingEntity {
    @Transient
    public static final String SALT = "JVF0umtgJhNBe1ZtPIQ6";

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotEmpty
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

    private int totalOrder;

    private boolean sentMailNextLevel;

    private double saleAmount;

    private String uniqueKey;

    @DBRef(lazy = true)
    private SellerLevel sellerLevel;

    @DBRef(lazy = true)
    private SellerLevel forceSellerLevel;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
