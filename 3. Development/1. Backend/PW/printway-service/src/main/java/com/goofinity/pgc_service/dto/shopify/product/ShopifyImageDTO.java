package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShopifyImageDTO {
    private long id;
    private String attachment;
    private String src;
    private Integer position;
}
