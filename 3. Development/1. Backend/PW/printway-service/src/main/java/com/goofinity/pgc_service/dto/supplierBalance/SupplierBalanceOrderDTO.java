package com.goofinity.pgc_service.dto.supplierBalance;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierBalanceOrderDTO {
    private double amount;
    private String transactionId;
    private String orderId;
    private String itemSku;
}
