package com.goofinity.pgc_service.domain.productType;

import com.goofinity.pgc_service.domain.User;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductTypeVariantSupplierCost {
    @DBRef(lazy = true)
    @NotNull
    private User supplier;

    @Min(0)
    private double cost;
}
