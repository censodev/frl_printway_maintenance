package com.goofinity.pgc_service.event.lineItemStatistic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.LineItemStatisticDTO;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.LineItemStatisticRepository;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.util.StringUtils;

import java.util.Map;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({LineItemStatisticBinding.class})
public class LineItemStatisticListener {
    private final ObjectMapper objectMapper = getObjectMapper();

    final LineItemStatisticRepository lineItemStatisticRepository;

    public LineItemStatisticListener(final LineItemStatisticRepository lineItemStatisticRepository) {
        this.lineItemStatisticRepository = lineItemStatisticRepository;
    }

    @StreamListener(LineItemStatisticBinding.LINE_ITEM_STATISTIC_RECEIVER_CHANNEL)
    public void processStatistic(String rawData) throws JsonProcessingException {
        LineItemStatisticDTO dto = objectMapper.readValue(rawData, LineItemStatisticDTO.class);

        // Update statistic for seller
        updateStatistic(dto.getUserEmail(), dto);

        // Update statistic for admin
        // Statistic from Seller -> id = seller email
        // Statistic from Supplier -> id = supplier id
        if (dto.getUserEmail().contains("@")) {
            updateStatistic(RoleEnum.ROLE_ADMIN_CONSTANT, dto);
        }
    }

    private void updateStatistic(String id, LineItemStatisticDTO dto) {
        lineItemStatisticRepository.findById(id).ifPresent(lineItemStatistic -> {
            if (!StringUtils.isEmpty(dto.getStatus())) {
                for (Map.Entry<String, Long> statusEntry : lineItemStatistic.getStatistic().entrySet()) {
                    if (statusEntry.getKey().equals(dto.getStatus())) {
                        statusEntry.setValue(statusEntry.getValue() + 1);
                        break;
                    }
                }
            }

            if (!StringUtils.isEmpty(dto.getPreStatus())) {
                for (Map.Entry<String, Long> statusEntry : lineItemStatistic.getStatistic().entrySet()) {
                    if (statusEntry.getKey().equals(dto.getPreStatus()) && statusEntry.getValue() > 0) {
                        statusEntry.setValue(statusEntry.getValue() - 1);
                        break;
                    }
                }
            }

            lineItemStatisticRepository.save(lineItemStatistic);
        });
    }
}
