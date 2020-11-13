package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.LineItemStatisticDTO;
import com.goofinity.pgc_service.event.lineItemStatistic.LineItemStatisticBinding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding(LineItemStatisticBinding.class)
@Service
public class LineItemStatisticService {
    private final Logger log = LoggerFactory.getLogger(LineItemStatisticService.class);

    private final ObjectMapper objectMapper = getObjectMapper();

    private final MessageChannel messageChannel;

    public LineItemStatisticService(final LineItemStatisticBinding lineItemStatisticBinding) {
        this.messageChannel = lineItemStatisticBinding.publisher();
    }

    public void addStatistic(List<LineItemStatisticDTO> statisticDTOList, String key, String status, String preStatus) {
        statisticDTOList.add(LineItemStatisticDTO.builder()
            .userEmail(key)
            .status(status)
            .preStatus(preStatus)
            .build());
    }

    public void sendStatisticStatus(LineItemStatisticDTO dto) {
        try {
            messageChannel.send(MessageBuilder
                .withPayload(objectMapper.writeValueAsString(dto))
                .build());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
