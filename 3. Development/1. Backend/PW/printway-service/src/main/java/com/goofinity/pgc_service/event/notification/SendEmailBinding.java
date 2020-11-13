package com.goofinity.pgc_service.event.notification;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface SendEmailBinding {
    String SEND_EMAIL_RECEIVER_CHANNEL = "sendEmailReceiverChannel";
    String SEND_EMAIL_PUBLISHER_CHANNEL = "sendEmailPublisherChannel";

    @Input(SEND_EMAIL_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(SEND_EMAIL_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
