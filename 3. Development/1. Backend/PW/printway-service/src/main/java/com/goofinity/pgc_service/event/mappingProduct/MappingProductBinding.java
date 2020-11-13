package com.goofinity.pgc_service.event.mappingProduct;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface MappingProductBinding {
    String MAPPING_PRODUCT_RECEIVER_CHANNEL = "mappingProductReceiverChannel";
    String MAPPING_PRODUCT_PUBLISHER_CHANNEL = "mappingProductPublisherChannel";

    @Input(MAPPING_PRODUCT_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(MAPPING_PRODUCT_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
