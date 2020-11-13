package com.goofinity.pgc_service.domain;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Variant {
    @NotEmpty
    private String name;

    @NotEmpty
    private List<String> options;
}
