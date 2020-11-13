package com.goofinity.pgc_service.dto.trackingMore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TrackingMoreWebhookDTO {
    private TrackingMoreDTO data;
}
