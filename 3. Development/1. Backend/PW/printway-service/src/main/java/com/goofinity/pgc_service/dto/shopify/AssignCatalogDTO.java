package com.goofinity.pgc_service.dto.shopify;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssignCatalogDTO {
    private long productId;
    private String collectionId;
    private String url;
    private String accessToken;
}
