package com.goofinity.pgc_service.dto.woo.variant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.goofinity.pgc_service.dto.woo.product.WooAttribute;
import com.goofinity.pgc_service.dto.woo.product.WooImage;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WooVariant {
    private Long id;

    @JsonProperty("regular_price")
    private Double regularPrice;

    @JsonProperty("sale_price")
    private Double salePrice;

    private String sku;
    private WooImage image;
    private List<WooAttribute> attributes;
}
