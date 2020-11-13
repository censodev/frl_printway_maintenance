package com.goofinity.pgc_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Pgc Service.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
@Getter
@Setter
public class ApplicationProperties {
    private String securityKey;
    private String url;
    private String shopifyAppApiKey;
    private String shopifyAppApiSecret;
    private String skuJoinSymbol;
    private String wooWebhookKey;
    private int uniqueKeyLength;
    private String trackingMoreApiKey;
}
