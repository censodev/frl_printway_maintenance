package com.goofinity.pgc_service.event.shopifyUpdate;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface ShopifyUpdateBinding {
    String SHOPIFY_UPDATE_RECEIVER_CHANNEL = "shopifyUpdateReceiverChannel";
    String SHOPIFY_UPDATE_PUBLISHER_CHANNEL = "shopifyUpdatePublisherChannel";

    @Input(SHOPIFY_UPDATE_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(SHOPIFY_UPDATE_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
