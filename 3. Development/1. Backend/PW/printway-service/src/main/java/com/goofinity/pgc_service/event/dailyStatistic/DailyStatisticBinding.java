package com.goofinity.pgc_service.event.dailyStatistic;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface DailyStatisticBinding {
    String DAILY_STATISTIC_RECEIVER_CHANNEL = "dailyStatisticReceiverChannel";
    String DAILY_STATISTIC_PUBLISHER_CHANNEL = "dailyStatisticPublisherChannel";

    @Input(DAILY_STATISTIC_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(DAILY_STATISTIC_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
