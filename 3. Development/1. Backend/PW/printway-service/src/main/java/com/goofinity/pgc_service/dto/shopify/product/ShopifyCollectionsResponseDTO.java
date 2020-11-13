package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyCollectionsResponseDTO {
    @JsonProperty("custom_collections")
    private List<ShopifyCollectionDTO> customCollections;

    @JsonProperty("smart_collections")
    private List<ShopifyCollectionDTO> smartCollections;
}
