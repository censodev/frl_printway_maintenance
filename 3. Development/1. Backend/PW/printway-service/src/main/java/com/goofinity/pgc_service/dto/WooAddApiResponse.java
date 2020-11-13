package com.goofinity.pgc_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WooAddApiResponse {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("consumer_key")
    private String consumerKey;

    @JsonProperty("consumer_secret")
    private String consumerSecret;
}
