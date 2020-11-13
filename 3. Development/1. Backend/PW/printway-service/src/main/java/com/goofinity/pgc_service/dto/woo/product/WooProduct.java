package com.goofinity.pgc_service.dto.woo.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WooProduct {
    private Long id;
    private String name;
    private String type;
    private String permalink;

    @JsonProperty("regular_price")
    private String regularPrice;

    private String description;

    @JsonProperty("short_description")
    private String shortDescription;

    private String status;

    private List<WooImage> images;
    private List<WooCategory> categories;
    private List<WooAttribute> attributes;
    private List<Long> variations;
}
