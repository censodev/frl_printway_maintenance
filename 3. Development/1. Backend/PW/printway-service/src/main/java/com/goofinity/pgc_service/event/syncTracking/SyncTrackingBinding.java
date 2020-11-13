package com.goofinity.pgc_service.event.syncTracking;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface SyncTrackingBinding {
    String SYNC_TRACKING_RECEIVER_CHANNEL = "syncTrackingReceiverChannel";
    String SYNC_TRACKING_PUBLISHER_CHANNEL = "syncTrackingPublisherChannel";

    @Input(SYNC_TRACKING_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(SYNC_TRACKING_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
