package com.goofinity.pgc_service.dto.shopify;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class UpdateVariantImageDTO {
    private long variantId;
    private long imageId;
    private String url;
    private String accessToken;
}
