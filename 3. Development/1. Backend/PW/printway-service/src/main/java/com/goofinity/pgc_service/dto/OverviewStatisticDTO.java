package com.goofinity.pgc_service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OverviewStatisticDTO {
    private int totalOrder;
    private int totalSeller;
    private double totalRevenue;
    private double totalProfit;
    private double totalBalance;
    private double totalCustomBalance;

    private int todayTotalOrders;
    private int todayTotalSeller;
    private double todayTotalRevenue;
    private double todayTotalProfit;
    private double todayTotalBalance;
    private double todayCustomBalance;

    private List<RevenueProfitChartDTO> revenueProfitChart;
}
