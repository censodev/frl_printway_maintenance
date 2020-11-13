package com.goofinity.pgc_service.event.supplierBalance;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface SupplierBalanceBinding {
    String SUPPLIER_BALANCE_RECEIVER_CHANNEL = "supplierBalanceReceiverChannel";
    String SUPPLIER_BALANCE_PUBLISHER_CHANNEL = "supplierBalancePublisherChannel";

    @Input(SUPPLIER_BALANCE_RECEIVER_CHANNEL)
    SubscribableChannel receiver();

    @Output(SUPPLIER_BALANCE_PUBLISHER_CHANNEL)
    MessageChannel publisher();
}
