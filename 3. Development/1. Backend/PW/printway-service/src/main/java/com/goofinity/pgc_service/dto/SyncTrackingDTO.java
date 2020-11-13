package com.goofinity.pgc_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SyncTrackingDTO {
    private String siteId;
    private String originalOrderId;
    private String orderId;
    private List<SyncTrackingLineItemDTO> lineItems;
}
