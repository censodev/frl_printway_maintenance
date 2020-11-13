package com.goofinity.pgc_service.event.dailyStatistic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.DailyStatistic;
import com.goofinity.pgc_service.dto.DailyStatisticDTO;
import com.goofinity.pgc_service.enums.StatisticFieldEnum;
import com.goofinity.pgc_service.repository.DailyStatisticRepository;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import java.time.temporal.ChronoUnit;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({DailyStatisticBinding.class})
public class DailyStatisticListener {
    private static final Logger log = LoggerFactory.getLogger(DailyStatisticListener.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final DailyStatisticRepository dailyStatisticRepository;

    public DailyStatisticListener(final DailyStatisticRepository dailyStatisticRepository) {
        this.dailyStatisticRepository = dailyStatisticRepository;
    }

    @StreamListener(DailyStatisticBinding.DAILY_STATISTIC_RECEIVER_CHANNEL)
    public void processDailyStatistic(String rawData) throws JsonProcessingException {
        log.debug("Process daily statistic: {}", rawData);
        DailyStatisticDTO dto = objectMapper.readValue(rawData, DailyStatisticDTO.class);
        StatisticFieldEnum statisticFieldEnum = StatisticFieldEnum.getByName(dto.getStatisticField())
            .orElseThrow(() -> new ObjectNotFoundException("statistic_field"));

        if (!StringUtils.isEmpty(dto.getUser()) || !StringUtils.isEmpty(dto.getSite())) {
            DailyStatistic dailyStatistic = (!StringUtils.isEmpty(dto.getUser())
                ? dailyStatisticRepository.findByUserAndStatisticDate(dto.getUser(), dto.getStatisticDate().truncatedTo(ChronoUnit.DAYS))
                : dailyStatisticRepository.findBySiteAndStatisticDate(dto.getSite(), dto.getStatisticDate().truncatedTo(ChronoUnit.DAYS)))
                .orElse(DailyStatistic.builder()
                    .user(dto.getUser())
                    .site(dto.getSite())
                    .statisticDate(dto.getStatisticDate().truncatedTo(ChronoUnit.DAYS))
                    .build());

            switch (statisticFieldEnum) {
                case SITE:
                    dailyStatistic.setTotalSites(dailyStatistic.getTotalSites() + 1);
                    break;
                case USER:
                    dailyStatistic.setTotalUsers(dailyStatistic.getTotalUsers() + 1);
                    break;
                case ORDER:
                    dailyStatistic.setTotalOrders(dailyStatistic.getTotalOrders() + 1);
                    break;
                case BALANCE:
                    dailyStatistic.setTotalBalance(dailyStatistic.getTotalBalance() + dto.getValue());
                    break;
                case REVENUE:
                    dailyStatistic.setRevenue(dailyStatistic.getRevenue() + dto.getValue());
                    break;
                case PROFIT:
                    dailyStatistic.setProfit(dailyStatistic.getProfit() + dto.getValue());
                    break;
                case CUSTOM_ADD:
                case CUSTOM_SUBTRACT:
                    dailyStatistic.setCustomBalance(dailyStatistic.getCustomBalance() + dto.getValue());
                    break;
            }

            dailyStatisticRepository.save(dailyStatistic);
        }
    }
}
