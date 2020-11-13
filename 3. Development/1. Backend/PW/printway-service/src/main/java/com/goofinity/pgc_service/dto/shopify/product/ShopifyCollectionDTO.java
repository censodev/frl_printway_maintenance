package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyCollectionDTO {
    private String id;
    private String title;

    @JsonProperty("sort_order")
    private String sortOrder;

    @JsonProperty("admin_graphql_api_id")
    private String adminGraphqlApiId;
}
