package com.goofinity.pgc_service.config;

import com.goofinity.pgc_service.security.error.ValidatorException;
import io.sentry.spring.SentryExceptionResolver;
import io.sentry.spring.SentryServletContextInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * Configures the sentry to capture error
 */
@Configuration
public class SentryConfiguration {
    private static final Logger log = LoggerFactory.getLogger(SentryConfiguration.class);
    @Bean
    public HandlerExceptionResolver sentryExceptionResolver() {
        return new SentryExceptionResolver() {
            @Override
            public ModelAndView resolveException(HttpServletRequest request,
                                                 HttpServletResponse response,
                                                 Object handler,
                                                 Exception ex) {
                Throwable rootCause = ex;

                while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
                    rootCause = rootCause.getCause();
                }

                if (!(ex instanceof ValidatorException) && !(ex instanceof SecurityException)) {
                    super.resolveException(request, response, handler, ex);
                }

                return null;
            }

        };
    }

    @Bean
    public ServletContextInitializer sentryServletContextInitializer() {
        return new SentryServletContextInitializer();
    }

    @Bean
    public TaskScheduler taskScheduler() {
        ConcurrentTaskScheduler scheduler = new ConcurrentTaskScheduler();
        scheduler.setErrorHandler(throwable -> {
            /* custom handler */
            log.error("Scheduled task threw an exception: {}", throwable.getMessage(), throwable);
        });
        return scheduler;
    }
}
