package com.goofinity.pgc_service.domain.productType;

import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductTypeVariantDetail {
    @NotEmpty
    private String option1;

    private String option2;

    @NotEmpty
    private String sku;

    @Builder.Default
    private boolean enable = true;

    @Min(0)
    private double baseCost;

    @Min(0)
    private double retailCost;

    @Min(0)
    private double saleCost;

    @NotEmpty
    @Valid
    private List<ProductTypeVariantSupplierCost> supplierCosts;
}
