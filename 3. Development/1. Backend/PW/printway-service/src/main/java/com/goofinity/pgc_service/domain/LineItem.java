package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Transient;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LineItem {
    private Long id;
    private Long productId;
    private Long variantId;
    private String name;
    private String baseSku;
    private String sku;
    private String status;
    private String preStatus;
    private String statusNote;
    private String price;
    private Integer quantity;
    private boolean sellerEdit;
    private String imageId;
    private String productTypeId;
    private String productTypeTitle;
    private int numberDesignMissing;
    private String supplierId;
    private String supplier;
    private double supplierCost;
    private double baseCost;
    private String carrierId;
    private String carrier;
    private String carrierCode;
    private double carrierCost;
    private String exportOrderId;
    private Instant lastStatusDate;

    private Instant lastSentNotification;
    private int lastSentSpreadHour;

    private String trackingNumber;
    private String trackingUrl;
    private String trackingStatus;
    private boolean paid;
    private double paidAmount;

    @JsonIgnore
    private Long fulfillmentId;

    @Transient
    private boolean changeToProd;

    public void setStatus(String status) {
        this.status = status;
        this.lastStatusDate = Instant.now();
    }

    @Builder.Default
    List<ProductPrintFileDetail> printFileImages = new ArrayList<>();
}

