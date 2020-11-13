package com.goofinity.pgc_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LineItemDTO {
    private String orderId;
    private String itemSku;
    private String note;
    private String assignId;
    private String trackingNumber;
    private String trackingUrl;
}
