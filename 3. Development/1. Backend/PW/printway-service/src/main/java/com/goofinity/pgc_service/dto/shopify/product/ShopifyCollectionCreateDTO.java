package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyCollectionCreateDTO {
    @JsonProperty("custom_collection")
    private ShopifyCollectionDTO customCollection;
}
