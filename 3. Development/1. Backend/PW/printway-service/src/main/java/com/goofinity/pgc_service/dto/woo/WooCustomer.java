package com.goofinity.pgc_service.dto.woo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class WooCustomer {
    @JsonProperty("date_created")
    private String dateCreated;

    @JsonProperty("date_created_gmt")
    private String dateCreatedGmt;

    @JsonProperty("date_modified")
    private String dateModified;

    @JsonProperty("date_modified_gmt")
    private String dateModifiedGmt;

    private String role;
    private String username;
    private String password;
    private WooAddress billing;
    private WooAddress shipping;

    @JsonProperty("is_paying_customer")
    private Boolean isPayingCustomer;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    @JsonProperty("meta_data")
    private List<WooProperty> metaData;
}
