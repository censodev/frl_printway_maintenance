package com.goofinity.pgc_service.event.trackingMore;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface TrackingMoreBinding {
    String TRACKING_MORE_RECEIVER_CHANNEL = "trackingMoreReceiverChannel";
    String TRACKING_MORE_PUBLISHER_CHANNEL = "trackingMorePublisherChannel";

    @Input(TRACKING_MORE_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(TRACKING_MORE_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
