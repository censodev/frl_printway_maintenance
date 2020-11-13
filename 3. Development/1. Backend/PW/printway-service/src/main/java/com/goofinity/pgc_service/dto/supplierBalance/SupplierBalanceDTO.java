package com.goofinity.pgc_service.dto.supplierBalance;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierBalanceDTO {
    private String supplierEmail;
    private String supplierId;
    private boolean isPaid;
    private double totalAmount;
    private String author;
    private List<SupplierBalanceOrderDTO> orders;
}
