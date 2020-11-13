package com.goofinity.pgc_service.dto.woo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class WooOrder {
    private String id;

    @JsonProperty("parent_id")
    private Long parentId;

    private String number;

    @JsonProperty("order_key")
    private String orderKey;

    @JsonProperty("created_via")
    private String createdVia;

    private String version;
    private String status;
    private String currency;

    @JsonProperty("date_created")
    private String dateCreated;

    @JsonProperty("date_created_gmt")
    private String dateCreatedGmt;

    @JsonProperty("date_modified")
    private String dateModified;

    @JsonProperty("date_modified_gmt")
    private String dateModifiedGmt;

    @JsonProperty("discount_total")
    private String discountTotal;

    @JsonProperty("discount_tax")
    private String discountTax;

    @JsonProperty("shipping_total")
    private String shippingTotal;

    @JsonProperty("shipping_tax")
    private String shippingTax;

    @JsonProperty("cart_tax")
    private String cartTax;

    private String total;

    @JsonProperty("total_tax")
    private String totalTax;

    @JsonProperty("prices_include_tax")
    private Boolean pricesIncludeTax;

    @JsonProperty("customer_id")
    private Long customerId;

    @JsonProperty("customer_ip_address")
    private String customerIpAddress;

    @JsonProperty("customer_user_agent")
    private String customerUserAgent;

    @JsonProperty("customer_note")
    private String customerNote;

    @DBRef
    private WooCustomer customer;

    private WooAddress billing;
    private WooAddress shipping;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("payment_method_title")
    private String paymentMethodTitle;

    @JsonProperty("transaction_id")
    private String transactionId;

    @JsonProperty("date_paid")
    private String datePaid;

    @JsonProperty("date_paid_gmt")
    private String datePaidGmt;

    @JsonProperty("date_completed")
    private String dateCompleted;

    @JsonProperty("date_completed_gmt")
    private String dateCompletedGmt;

    @JsonProperty("cart_hash")
    private String cartHash;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;

    @JsonProperty("line_items")
    private List<WooLine> lineItems;

    @JsonProperty("tax_lines")
    private List<WooTax> taxLines;

    @JsonProperty("shipping_lines")
    private List<WooShippingLine> shippingLines;

    @JsonProperty("fee_lines")
    private List<WooFeeLine> feeLines;

    @JsonProperty("coupon_lines")
    private List<WooCouponLine> couponLines;

    private List<WooRefundLine> refunds;

    private boolean checkingAbandonedCheckout;
}

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class WooCouponLine implements Serializable {
    private Long id;
    private String code;
    private String discount;

    @JsonProperty("discount_tax")
    private String discountTax;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;
}

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class WooFeeLine implements Serializable {
    private Long id;
    private String name;

    @JsonProperty("tax_class")
    private String taxClass;

    @JsonProperty("tax_status")
    private String taxStatus;

    private String total;

    @JsonProperty("total_tax")
    private String totalTax;

    private List<WooTax> taxes;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;
}

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class WooRefundLine implements Serializable {
    private Long id;
    private String reason;
    private String total;
}

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class WooShippingLine implements Serializable {
    private Long id;

    @JsonProperty("method_title")
    private String methodTitle;

    @JsonProperty("method_id")
    private String methodId;

    private String total;

    @JsonProperty("total_tax")
    private String totalTax;

    private List<WooTax> taxes;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;
}

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
class WooTax implements Serializable {
    private Long id;

    @JsonProperty("rate_code")
    private String rateCode;

    @JsonProperty("rate_id")
    private String rateId;

    private String label;
    private Boolean compound;

    @JsonProperty("tax_total")
    private String taxTotal;

    @JsonProperty("shipping_tax_total")
    private String shippingTaxTotal;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;
}
