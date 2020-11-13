package com.goofinity.pgc_service.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.goofinity.pgc_service.domain.ProductPrintFileDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductTypeGroup {
    @DBRef(lazy = true)
    private ProductType productType;

    private List<ProductVariantDetail> variantDetails;
    private List<ProductPrintFileDetail> printFileImages;
    private boolean fullDesign;
}
