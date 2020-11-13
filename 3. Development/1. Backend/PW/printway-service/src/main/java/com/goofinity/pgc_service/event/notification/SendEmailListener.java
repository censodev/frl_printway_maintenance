package com.goofinity.pgc_service.event.notification;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.dto.SendMailRequestDTO;
import com.goofinity.pgc_service.service.AmazonSESService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import java.util.Map;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding({SendEmailBinding.class})
public class SendEmailListener {
    private static final Logger log = LoggerFactory.getLogger(SendEmailListener.class);

    private final ObjectMapper objectMapper = getObjectMapper();

    private final AmazonSESService amazonSESService;

    public SendEmailListener(final AmazonSESService amazonSESService) {
        this.amazonSESService = amazonSESService;

        amazonSESService.connect();
    }

    @StreamListener(SendEmailBinding.SEND_EMAIL_RECEIVER_CHANNEL)
    public void processSendEmail(String rawData) throws JsonProcessingException {
        SendMailRequestDTO dto = objectMapper.readValue(rawData, SendMailRequestDTO.class);

        try {
            String body = dto.getHtmlText();
            for (Map.Entry<String, String> entry : dto.getTags().entrySet()) {
                body = body.replace(entry.getKey(), StringUtils.defaultString(entry.getValue(), ""));
            }
            dto.setHtmlText(body);

            // Using Amazon SES to send email
            amazonSESService.sendMail(dto);
        } catch (Exception ex) {
            log.error("Error send email: {}", rawData);
            log.error(ex.getMessage(), ex);
        }
    }
}
