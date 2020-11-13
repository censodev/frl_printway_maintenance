package com.goofinity.pgc_service.dto;

import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class DepositDTO {
    @NotEmpty
    private String transactionId;

    private double amount;
    private String note;
}
