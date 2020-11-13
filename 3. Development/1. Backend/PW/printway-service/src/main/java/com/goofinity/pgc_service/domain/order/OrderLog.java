package com.goofinity.pgc_service.domain.order;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OrderLog {
    private Instant time;
    private String itemSku;
    private String type;
    private String data;
    private String author;
}
