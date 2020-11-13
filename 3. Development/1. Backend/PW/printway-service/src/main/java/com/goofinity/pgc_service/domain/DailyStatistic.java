package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "daily_statistic")
@TypeAlias("daily_statistic")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DailyStatistic extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private String user;
    private String site;
    private Instant statisticDate;
    private int totalOrders;
    private int totalUsers;
    private int totalSites;
    private double totalBalance;
    private double revenue;
    private double profit;
    private double customBalance;
}
