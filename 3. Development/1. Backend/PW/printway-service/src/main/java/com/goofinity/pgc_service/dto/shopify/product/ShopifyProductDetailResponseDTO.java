package com.goofinity.pgc_service.dto.shopify.product;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ShopifyProductDetailResponseDTO {
    private long id;
    private String handle;
    private List<ShopifyVariantDTO> variants = new ArrayList<>();

    @Builder.Default
    private List<ShopifyOptionDTO> options = new ArrayList<>();

    @Builder.Default
    private List<ShopifyImageDTO> images = new ArrayList<>();
}
