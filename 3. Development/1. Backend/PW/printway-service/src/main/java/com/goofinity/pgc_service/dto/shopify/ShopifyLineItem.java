package com.goofinity.pgc_service.dto.shopify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShopifyLineItem {
    @JsonProperty("line_item_id")
    private Long lineItemId;

    @JsonProperty("location_id")
    private Long locationId;

    @JsonProperty("restock_type")
    private String restockType;

    private Long quantity;
}
