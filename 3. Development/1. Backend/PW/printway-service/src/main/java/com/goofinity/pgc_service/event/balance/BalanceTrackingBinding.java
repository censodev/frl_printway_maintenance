package com.goofinity.pgc_service.event.balance;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface BalanceTrackingBinding {
    String BALANCE_RECEIVER_CHANNEL = "balanceTrackingReceiverChannel";
    String BALANCE_PUBLISHER_CHANNEL = "balanceTrackingPublisherChannel";

    @Input(BALANCE_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(BALANCE_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
