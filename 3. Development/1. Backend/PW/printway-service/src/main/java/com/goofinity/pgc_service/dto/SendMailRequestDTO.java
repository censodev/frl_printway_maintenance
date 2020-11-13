package com.goofinity.pgc_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SendMailRequestDTO {
    @Builder.Default
    private Map<String, String> tags = new HashMap<>();
    private String toAddress;
    private String subject;
    private String htmlText;
}
