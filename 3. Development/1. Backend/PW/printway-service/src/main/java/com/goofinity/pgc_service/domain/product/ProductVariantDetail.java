package com.goofinity.pgc_service.domain.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductVariantDetail {
    private long id;
    private String imageId;

    private String option1Type;
    private String option2Type;
    private String option1;
    private String option2;

    @NotEmpty
    private String baseSku;

    @NotNull
    private String sku;

    private boolean enable;

    @Min(0)
    private double baseCost;

    @Min(0)
    private double regularPrice;

    @Min(0)
    private double salePrice;

    private int imagePosition;
}
