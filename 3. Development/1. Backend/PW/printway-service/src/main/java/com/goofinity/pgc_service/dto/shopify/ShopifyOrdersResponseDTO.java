package com.goofinity.pgc_service.dto.shopify;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyOrdersResponseDTO {
    private List<ShopifyOrder> orders;
}
