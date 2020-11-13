package com.goofinity.pgc_service.dto.shopify.product;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyProductResponseDTO {
    private ShopifyProductDetailResponseDTO product;
    private List<ShopifyProductDTO> products;
}
