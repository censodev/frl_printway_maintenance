package com.goofinity.pgc_service.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class CollectionDTO {
    private String id;
    private String name;
}
