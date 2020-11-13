package com.goofinity.pgc_service.dto.trackingMore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TrackingMoreDTO {
    private String id;

    @JsonProperty("tracking_number")
    private String trackingNumber;

    @JsonProperty("carrier_code")
    private String carrierCode;

    private String title;
    private String comment;
    private String status;

    @JsonProperty("order_id")
    private String orderId;
}
