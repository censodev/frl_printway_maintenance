package com.goofinity.pgc_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ImportTrackingErrorDTO {
    private int lineNumber;
    private String orderName;
    private String orderId;
    private String sku;
    private String error;
}
