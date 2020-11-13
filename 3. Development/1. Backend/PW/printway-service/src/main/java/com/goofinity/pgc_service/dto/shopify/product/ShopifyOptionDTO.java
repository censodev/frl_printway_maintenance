package com.goofinity.pgc_service.dto.shopify.product;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyOptionDTO {
    private String name;
    private Set<String> values;
}
