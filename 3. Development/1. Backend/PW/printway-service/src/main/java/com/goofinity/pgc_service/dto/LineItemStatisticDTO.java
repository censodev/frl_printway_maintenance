package com.goofinity.pgc_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class LineItemStatisticDTO {
    private String userEmail;
    private String status;
    private String preStatus;
}
