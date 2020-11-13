package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyVariantDTO {
    private Long id;
    private Long position;

    private String option1;
    private String option2;
    private String option3;
    private String price;
    private String sku;
    private String imageId;

    @JsonProperty("inventory_policy")
    private String inventoryPolicy;

    @JsonProperty("compare_at_price")
    private String compareAtPrice;
}
