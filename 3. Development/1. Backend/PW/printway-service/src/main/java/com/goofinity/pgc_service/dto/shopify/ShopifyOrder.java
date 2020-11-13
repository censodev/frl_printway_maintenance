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
public class ShopifyOrder {
    private String id;

    private String email;

    @JsonProperty("closed_at")
    private String closedAt;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;

    private String note;
    private String token;
    private String gateway;
    private boolean test;

    @JsonProperty("total_price")
    private String totalPrice;

    @JsonProperty("abandoned_checkout_url")
    private String abandonedCheckoutUrl;

    @JsonProperty("subtotal_price")
    private String subtotalPrice;

    @JsonProperty("total_weight")
    private double totalWeight;

    @JsonProperty("total_tax")
    private String totalTax;

    @JsonProperty("taxes_included")
    private boolean taxesIncluded;

    private String currency;

    @JsonProperty("financial_status")
    private String financialStatus;

    private boolean confirmed;

    @JsonProperty("total_discounts")
    private String totalDiscounts;

    @JsonProperty("total_line_items_price")
    private String totalLineItemsPrice;

    @JsonProperty("cart_token")
    private String cartToken;

    @JsonProperty("buyer_accepts_marketing")
    private String buyerAcceptsMarketing;

    @JsonProperty("referring_site")
    private String referringSite;

    @JsonProperty("landing_site")
    private String landingSite;

    @JsonProperty("cancelled_at")
    private String cancelledAt;

    @JsonProperty("cancel_reason")
    private String cancelReason;

    @JsonProperty("total_price_usd")
    private String totalPriceUsd;

    @JsonProperty("checkout_token")
    private String checkoutToken;

    private String reference;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("location_id")
    private Long locationId;

    @JsonProperty("source_identifier")
    private String sourceIdentifier;

    @JsonProperty("source_url")
    private String sourceUrl;

    @JsonProperty("processed_at")
    private String processedAt;

    @JsonProperty("device_id")
    private String deviceId;

    private String phone;

    @JsonProperty("customer_locale")
    private String customerLocale;

    @JsonProperty("app_id")
    private Long appId;

    @JsonProperty("browser_ip")
    private String browserIp;

    @JsonProperty("landing_site_ref")
    private String landingSiteRef;

    @JsonProperty("order_number")
    private Long orderNumber;

    @JsonProperty("discount_applications")
    private List<ShopifyDiscountApplication> discountApplications;

    @JsonProperty("discount_codes")
    private List<ShopifyCode> discountCodes;

    @JsonProperty("note_attributes")
    private List<ShopifyAttribute> noteAttributes;

    @JsonProperty("payment_gateway_names")
    private List<String> paymentGatewayNames;

    @JsonProperty("processing_method")
    private String processingMethod;

    @JsonProperty("checkout_id")
    private Long checkoutId;

    @JsonProperty("source_name")
    private String sourceName;

    @JsonProperty("fulfillment_status")
    private String fulfillmentStatus;

    @JsonProperty("tax_lines")
    private List<ShopifyTax> taxLines;

    private String tags;

    @JsonProperty("contact_email")
    private String contactEmail;

    @JsonProperty("order_status_url")
    private String orderStatusUrl;

    @JsonProperty("presentment_currency")
    private String presentmentCurrency;

    @JsonProperty("total_line_items_price_set")
    private ShopifyItemPriceSet totalLineItemsPriceSet;

    @JsonProperty("total_discounts_set")
    private ShopifyItemPriceSet totalDiscountsSet;

    @JsonProperty("total_shipping_price_set")
    private ShopifyItemPriceSet totalShippingPriceSet;

    @JsonProperty("subtotal_price_set")
    private ShopifyItemPriceSet subtotalPriceSet;

    @JsonProperty("total_price_set")
    private ShopifyItemPriceSet totalPriceSet;

    @JsonProperty("total_tax_set")
    private ShopifyItemPriceSet totalTaxSet;

    @JsonProperty("line_items")
    private List<ShopifyItem> lineItems = new ArrayList<>();

    @JsonProperty("shipping_lines")
    private List<ShopifyLine> shippingLines = new ArrayList<>();

    @JsonProperty("billing_address")
    private ShopifyAddress billingAddress;

    @JsonProperty("shipping_address")
    private ShopifyAddress shippingAddress;

    private List<ShopifyFulfillment> fulfillments;
    private List<ShopifyRefund> refunds;

    private ShopifyCustomer customer;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyDiscountApplication {
    private String type;
    private String value;

    @JsonProperty("value_type")
    private String valueType;

    @JsonProperty("allocation_method")
    private String allocationMethod;

    @JsonProperty("target_selection")
    private String targetSelection;

    @JsonProperty("target_type")
    private String targetType;

    private String description;
    private String title;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyItemPriceSet {
    @JsonProperty("shop_money")
    private ShopifyPriceSet shopMoney;

    @JsonProperty("presentment_money")
    private ShopifyPriceSet presentmentMoney;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyPriceSet {
    private String amount;

    @JsonProperty("currency_code")
    private String currencyCode;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyLine {
    private String id;
    private String title;
    private String price;
    private String code;
    private String source;
    private String phone;

    @JsonProperty("variant_id")
    private String variantId;

    @JsonProperty("requested_fulfillment_service_id")
    private String requestedFulfillmentServiceId;

    @JsonProperty("delivery_category")
    private String deliveryCategory;

    @JsonProperty("carrier_identifier")
    private String carrierIdentifier;

    @JsonProperty("discounted_price")
    private String discountedPrice;

    @JsonProperty("price_set")
    private ShopifyItemPriceSet priceSet;

    @JsonProperty("discounted_price_set")
    private ShopifyItemPriceSet discountedPriceSet;

    @JsonProperty("discount_allocations")
    private List<ShopifyAllocation> discountAllocations;

    @JsonProperty("tax_lines")
    private List<ShopifyTax> taxLines;

    @JsonProperty("id")
    public void setId(Object id) {
        this.id = id instanceof Float ? id + "" : id.toString();
    }
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyAllocation {
    private String amount;

    @JsonProperty("discount_application_index")
    private Long discountApplicationIndex;

    @JsonProperty("amount_set")
    private ShopifyItemPriceSet amountSet;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyCode {
    private String code;
    private String amount;
    private String type;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyAttribute {
    private String name;
    private String value;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyTax {
    private String title;
    private String price;
    private double rate;

    @JsonProperty("price_set")
    private ShopifyItemPriceSet priceSet;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyTransaction {
    @JsonProperty("parent_id")
    private Long parentId;

    private String amount;
    private String kind;
    private String gateway;
}

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class ShopifyAdjustment {
    private Long id;

    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("refund_id")
    private Long refundId;

    private String amount;
    private String kind;
    private String reason;

    @JsonProperty("tax_amount")
    private String taxAmount;

    @JsonProperty("amount_set")
    private ShopifyItemPriceSet amountSet;

    @JsonProperty("tax_amount_set")
    private ShopifyItemPriceSet taxAmountSet;
}
