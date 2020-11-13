package com.goofinity.pgc_service.event.trackingMore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.LineItem;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreDTO;
import com.goofinity.pgc_service.dto.trackingMore.TrackingMoreResponseDTO;
import com.goofinity.pgc_service.repository.OrderRepository;
import com.goofinity.pgc_service.service.TrackingMoreService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import java.util.List;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({TrackingMoreBinding.class})
public class TrackingMoreListener {
    private static final Logger log = LoggerFactory.getLogger(TrackingMoreListener.class);
    private final ObjectMapper objectMapper = getObjectMapper();

    private final OrderRepository orderRepository;
    private final TrackingMoreService trackingMoreService;

    public TrackingMoreListener(final OrderRepository orderRepository,
                                final TrackingMoreService trackingMoreService) {
        this.orderRepository = orderRepository;
        this.trackingMoreService = trackingMoreService;
    }

    @StreamListener(TrackingMoreBinding.TRACKING_MORE_RECEIVER_CHANNEL)
    public void processTrackingBalance(String rawData) throws JsonProcessingException {
        List<TrackingMoreDTO> dtos = objectMapper.readValue(rawData, new TypeReference<List<TrackingMoreDTO>>() {
        });

        try {
            TrackingMoreResponseDTO responseDTO = trackingMoreService.createTrackingMoreTracking(dtos);
            for (TrackingMoreDTO tracking : responseDTO.getData().getTrackings()) {
                String trackingNumber = tracking.getTrackingNumber();
                String carrierCode = tracking.getCarrierCode();
                List<Order> orders = orderRepository.findByLineItemTrackingNumber(trackingNumber, carrierCode);
                for (Order order : orders) {
                    for (LineItem lineItem : order.getLineItems()) {
                        if (StringUtils.equals(lineItem.getTrackingNumber(), trackingNumber)
                            && StringUtils.equals(lineItem.getCarrierCode(), carrierCode)) {
                            lineItem.setTrackingStatus(tracking.getStatus());
                        }
                    }
                }

                orderRepository.saveAll(orders);
            }
        } catch (Exception ex) {
            log.error("Add tracking more error: {}", ex.getMessage());
        }
    }
}
