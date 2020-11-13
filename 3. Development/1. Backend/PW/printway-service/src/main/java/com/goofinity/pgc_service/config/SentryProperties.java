package com.goofinity.pgc_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Properties specific to Pgc Service.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "sentry", ignoreUnknownFields = true)
@Getter
@Setter
public class SentryProperties {
    private boolean enabled;
    private String dsn;
    private List<String> stacktraceAppPackages;
}
