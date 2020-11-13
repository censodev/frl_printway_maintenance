package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.goofinity.pgc_service.enums.SiteTypeEnum;
import lombok.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@org.springframework.data.mongodb.core.mapping.Document(collection = "site")
@TypeAlias("site")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"target"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Site extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Transient
    public static final String SALT = "Pi97hcvYOWb6JpLObZxk";

    @Transient
    public static final String SEQUENCE_NAME = "site_sequence";

    @Id
    private String id;

    private String email;

    private long number;

    @NotEmpty
    private String title;

    @NotEmpty
    private String url;

    @JsonIgnoreProperties
    private String shopUrl;

    @NotEmpty
    private String siteType;

    @JsonIgnoreProperties
    private String accessKey;

    @JsonIgnoreProperties
    private String consumerKey;

    @JsonIgnoreProperties
    private String consumerSecret;

    private String uniqueKey;

    private boolean active;

    @Transient
    @JsonProperty("fullName")
    private String fullName;

    private boolean virtual;

    private boolean sync;

    private boolean deleted;

    private Instant connectDate;

    private Instant lastSyncOrderDate;

    @JsonIgnore
    private String webhook;

    private Long locationId;

    @Min(0)
    private int orderHoldingHour;

    private Instant deletedDate;

    public boolean checkActive() {
        return virtual || (siteType.equals(SiteTypeEnum.SHOPIFY.name())
            ? !StringUtils.isEmpty(accessKey)
            : !StringUtils.isEmpty(consumerKey) && !StringUtils.isEmpty(consumerSecret));
    }

    public boolean isSync() {
        return checkActive();
    }
}
