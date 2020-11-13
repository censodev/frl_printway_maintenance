package com.goofinity.pgc_service.dto.shopify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShopifyRefund {
    private Long id;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("processed_at")
    private String processedAt;

    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("user_id")
    private Long userId;

    private String note;

    @JsonProperty("refund_line_items")
    private List<ShopifyLineItem> refundLineItems;

    private List<ShopifyTransaction> transactions;

    @JsonProperty("order_adjustments")
    private List<ShopifyAdjustment> orderAdjustments;
}
