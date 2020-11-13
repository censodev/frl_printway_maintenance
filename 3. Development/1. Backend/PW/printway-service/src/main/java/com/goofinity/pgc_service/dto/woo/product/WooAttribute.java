package com.goofinity.pgc_service.dto.woo.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WooAttribute {
    private long id;
    private String name;
    private int position;
    private boolean visible;
    private boolean variation;
    private List<String> options;
    private String option;
}
