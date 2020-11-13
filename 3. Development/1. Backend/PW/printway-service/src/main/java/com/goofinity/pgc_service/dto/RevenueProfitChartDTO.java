package com.goofinity.pgc_service.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class RevenueProfitChartDTO {
    private Instant date;
    private double profit;
    private double revenue;
}
