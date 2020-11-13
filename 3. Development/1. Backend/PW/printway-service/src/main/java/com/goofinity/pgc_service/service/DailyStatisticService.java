package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.DailyStatisticDTO;
import com.goofinity.pgc_service.event.dailyStatistic.DailyStatisticBinding;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@Service
@EnableBinding(DailyStatisticBinding.class)
public class DailyStatisticService {
    private final ObjectMapper objectMapper = getObjectMapper();
    private final MessageChannel messageChannel;

    public DailyStatisticService(final DailyStatisticBinding dailyStatisticBinding) {
        this.messageChannel = dailyStatisticBinding.publisher();
    }

    public void sendStatistic(String user, String site, String statisticField) throws JsonProcessingException {
        sendStatistic(user, site, statisticField, 0);
    }

    public void sendStatistic(String user, String site, String statisticField, double value) throws JsonProcessingException {
        messageChannel.send(MessageBuilder.withPayload(
            objectMapper.writeValueAsString(DailyStatisticDTO.builder()
                .user(user)
                .site(site)
                .statisticDate(Instant.now().truncatedTo(ChronoUnit.DAYS))
                .statisticField(statisticField)
                .value(value)
                .build())
        ).build());
    }
}
