package com.goofinity.pgc_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomTransactionDTO {
    private double amount;
    private String note;
    private String transactionID;
    private boolean add;
    private String email;
}
