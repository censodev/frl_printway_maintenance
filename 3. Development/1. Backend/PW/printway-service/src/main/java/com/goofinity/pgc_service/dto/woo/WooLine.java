package com.goofinity.pgc_service.dto.woo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class WooLine implements Serializable {
    private Long id;
    private String name;

    @JsonProperty("product_id")
    private Long productId;

    @JsonProperty("variation_id")
    private Long variationId;

    private Integer quantity;

    @JsonProperty("tax_class")
    private String taxClass;

    private String subtotal;

    @JsonProperty("subtotal_tax")
    private String subtotalTax;

    private String total;

    @JsonProperty("total_tax")
    private String totalTax;

    private String sku;
    private String price;

    private List<WooTax> taxes;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;
}
