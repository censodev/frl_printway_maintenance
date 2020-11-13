package com.goofinity.pgc_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductStatisticDTO {
    private boolean isProductType;
    private String id;
}

