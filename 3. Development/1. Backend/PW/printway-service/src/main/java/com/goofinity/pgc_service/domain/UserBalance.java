package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;

@Document(collection = "user_balance")
@TypeAlias("user_balance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserBalance extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    private String email;

    private double availableAmount;
    private double pendingAmount;
    private double paidAmount;
    private double upcomingAmount;
}
