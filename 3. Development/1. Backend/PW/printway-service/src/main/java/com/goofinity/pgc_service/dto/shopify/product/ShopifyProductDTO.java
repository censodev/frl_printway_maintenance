package com.goofinity.pgc_service.dto.shopify.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShopifyProductDTO {
    private long id;

    private String title;

    private String handle;

    @JsonProperty("body_html")
    private String bodyHtml;

    private String vendor;

    @JsonProperty("product_type")
    private String productType;

    private List<String> tags;

    @Builder.Default
    private boolean published = true;

    private String status;

    private List<ShopifyVariantDTO> variants = new ArrayList<>();
    private List<ShopifyOptionDTO> options = new ArrayList<>();
    private List<ShopifyImageDTO> images = new ArrayList<>();

    public void setTags(Object tags) {
        if (tags instanceof String) {
            this.tags = Arrays.asList(((String) tags).split(", "));
        } else {
            this.tags = (List<String>) tags;
        }
    }
}
