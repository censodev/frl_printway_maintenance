package com.goofinity.pgc_service.event.productStatistic;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface ProductStatisticBinding {
    String PRODUCT_STATISTIC_RECEIVER_CHANNEL = "productStatisticReceiverChannel";
    String PRODUCT_STATISTIC_PUBLISHER_CHANNEL = "productStatisticPublisherChannel";

    @Input(PRODUCT_STATISTIC_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(PRODUCT_STATISTIC_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
