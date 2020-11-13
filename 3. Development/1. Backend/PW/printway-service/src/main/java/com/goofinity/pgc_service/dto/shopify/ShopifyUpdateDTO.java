package com.goofinity.pgc_service.dto.shopify;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyUpdateDTO {
    private UpdateVariantImageDTO updateVariantImageDTO;
    private AssignCatalogDTO assignCatalogDTO;
}
