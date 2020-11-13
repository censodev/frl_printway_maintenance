package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;

@Document(collection = "seller_level")
@TypeAlias("seller_level")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"target"})
public class SellerLevel extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotEmpty
    private String name;

    private int totalSeller;

    private int totalOrder;

    private double discountInUsd;

    private double percentToAlert;
}
