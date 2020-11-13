package com.goofinity.pgc_service.dto.shopify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShopifyFulfillment {
    private Long id;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;

    @JsonProperty("order_id")
    private Long orderId;

    private String status;

    @JsonProperty("tracking_company")
    private String trackingCompany;

    @JsonProperty("tracking_number")
    private String trackingNumber;

    @JsonProperty("tracking_url")
    private String trackingUrl;
}
