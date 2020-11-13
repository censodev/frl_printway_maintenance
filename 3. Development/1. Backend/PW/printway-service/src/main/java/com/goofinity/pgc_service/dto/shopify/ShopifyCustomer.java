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
public class ShopifyCustomer {
    @JsonProperty("accepts_marketing")
    private boolean acceptsMarketing;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;

    @JsonProperty("orders_count")
    private Long ordersCount;

    private String state;

    @JsonProperty("total_spent")
    private String totalSpent;

    @JsonProperty("last_order_id")
    private Long lastOrderId;

    private String note;

    private String email;

    @JsonProperty("verified_email")
    private Boolean verifiedEmail;

    @JsonProperty("multipass_identifier")
    private String multipassIdentifier;

    @JsonProperty("tax_exempt")
    private Boolean taxExempt;

    private String tags;

    @JsonProperty("last_order_name")
    private String lastOrderName;

    private String currency;

    @JsonProperty("accepts_marketing_updated_at")
    private String acceptsMarketingUpdatedAt;

    @JsonProperty("marketing_opt_in_level")
    private String marketingOptInLevel;

    @JsonProperty("default_address")
    private ShopifyAddress defaultAddress;
}
