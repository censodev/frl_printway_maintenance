package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.config.ApplicationProperties;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreDTO;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreResponseDTO;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@Service
public class TrackingMoreService {
    private final int MAX_SIZE_BODY = 4000000;
    private final ObjectMapper objectMapper = getObjectMapper();
    private final ApplicationProperties properties;

    public TrackingMoreService(final ApplicationProperties properties) {
        this.properties = properties;
    }

    public TrackingMoreResponseDTO createTrackingMoreTracking(List<TrackingMoreDTO> trackingMoreDtos) throws IOException {
        String result = Jsoup.connect("https://api.trackingmore.com/v2/trackings/batch")
            .timeout(120000)
            .method(Connection.Method.POST)
            .requestBody(objectMapper.writeValueAsString(trackingMoreDtos))
            .header("Content-Type", "application/json")
            .header("Trackingmore-Api-Key", properties.getTrackingMoreApiKey())
            .ignoreContentType(true)
            .maxBodySize(MAX_SIZE_BODY)
            .followRedirects(false)
            .execute().body();
        return objectMapper.readValue(result, TrackingMoreResponseDTO.class);
    }
}
