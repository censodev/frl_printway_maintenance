package com.goofinity.pgc_service.dto.shopify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShopifyItem {
    private Long id;

    @JsonProperty("variant_id")
    private Long variantId;

    private String title;
    private Integer quantity;
    private String sku;

    @JsonProperty("variant_title")
    private String variantTitle;

    private String vendor;

    @JsonProperty("fulfillment_service")
    private String fulfillmentService;

    @JsonProperty("product_id")
    private Long productId;

    @JsonProperty("requires_shipping")
    private boolean requiresShipping;

    private boolean taxable;

    @JsonProperty("gift_card")
    private boolean giftCard;

    private String name;

    @JsonProperty("variant_inventory_management")
    private String variantInventoryManagement;

    private List<ShopifyAttribute> properties;

    @JsonProperty("product_exists")
    private boolean productExists;

    @JsonProperty("fulfillable_quantity")
    private Long fulfillableQuantity;

    private float grams;
    private String price;

    @JsonProperty("total_discount")
    private String total_discount;

    @JsonProperty("fulfillment_status")
    private String fulfillmentStatus;

    @JsonProperty("price_set")
    private ShopifyItemPriceSet priceSet;

    @JsonProperty("total_discount_set")
    private ShopifyItemPriceSet totalDiscountSet;

    @JsonProperty("discount_allocations")
    private List<ShopifyAllocation> discountAllocations = new ArrayList<>();

    @JsonProperty("tax_lines")
    private List<ShopifyTax> taxLines;
}
