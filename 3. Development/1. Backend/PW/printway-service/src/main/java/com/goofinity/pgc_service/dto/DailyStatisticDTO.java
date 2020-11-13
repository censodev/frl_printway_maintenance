package com.goofinity.pgc_service.dto;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class DailyStatisticDTO {
    @NotNull
    private Instant statisticDate;

    private String user;
    private String site;

    @NotEmpty
    private String statisticField;

    private double value;
}
