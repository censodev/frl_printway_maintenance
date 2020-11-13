package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShopifyProductPage {
    private List<ShopifyProductDTO> data;
    private String pageInfo;
    private ShopifyProductDTO product;
}
