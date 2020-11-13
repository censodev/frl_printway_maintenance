package com.goofinity.pgc_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TopItemDTO {
    private String title;
    private int value;
}
