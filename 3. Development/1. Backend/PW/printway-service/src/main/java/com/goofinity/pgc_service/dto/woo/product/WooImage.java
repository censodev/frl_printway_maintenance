package com.goofinity.pgc_service.dto.woo.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class WooImage {
    private Long id;
    private String src;
    private String alt;
}
