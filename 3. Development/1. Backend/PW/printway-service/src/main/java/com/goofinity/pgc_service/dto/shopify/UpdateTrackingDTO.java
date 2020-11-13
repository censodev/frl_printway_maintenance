package com.goofinity.pgc_service.dto.shopify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateTrackingDTO {
    private Long id;

    @JsonProperty("location_id")
    private Long locationId;

    @JsonProperty("tracking_number")
    private String trackingNumber;

    @JsonProperty("tracking_urls")
    private List<String> trackingUrls;

    @JsonProperty("line_items")
    private List<Map<String, Long>> lineItems;

    @JsonProperty("notify_customer")
    private boolean notifyCustomer;
}
