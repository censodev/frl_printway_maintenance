package com.goofinity.pgc_service.event.lineItemStatistic;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface LineItemStatisticBinding {
    String LINE_ITEM_STATISTIC_RECEIVER_CHANNEL = "lineItemStatisticReceiverChannel";
    String LINE_ITEM_STATISTIC_PUBLISHER_CHANNEL = "lineItemStatisticPublisherChannel";

    @Input(LINE_ITEM_STATISTIC_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(LINE_ITEM_STATISTIC_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
