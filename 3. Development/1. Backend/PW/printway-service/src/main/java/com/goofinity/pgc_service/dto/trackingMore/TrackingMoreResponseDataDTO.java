package com.goofinity.pgc_service.dto.trackingMore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TrackingMoreResponseDataDTO {
    private int submitted;
    private int added;
    private List<TrackingMoreDTO> trackings;
    private List<TrackingMoreDTO> errors;
}
