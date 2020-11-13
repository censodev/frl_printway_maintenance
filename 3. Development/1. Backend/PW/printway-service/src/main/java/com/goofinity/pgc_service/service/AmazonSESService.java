package com.goofinity.pgc_service.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.*;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.dto.SendMailRequestDTO;
import com.goofinity.pgc_service.enums.*;
import com.goofinity.pgc_service.event.notification.SendEmailBinding;
import com.goofinity.pgc_service.repository.NotificationSettingRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding(SendEmailBinding.class)
@Service
public class AmazonSESService {
    private final Logger log = LoggerFactory.getLogger(AmazonSESService.class);

    private final int PAGE_SIZE = 200;

    private final ObjectMapper objectMapper = getObjectMapper();

    private final String newOrderContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " has been successfully approved by PrintWay system. Kindly make sure its design files are updated correctly and your available amount is sufficient. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String orderUpdateDesignContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>We have just updated design(s) below:</p>\n" +
        "<p>- Order: #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ")</p>\n\n" +
        "<p>-<a href=\"" + EmailTagEnum.IMAGE_URL.getValue() + "\"> Link view image</a></p>\n" +
        "<p>Kindly go to PrintWay app and download the newest one. Thank you!</p>\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String orderPendingDesignContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") is design files have not been uploaded completely. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";


    private final String orderProcessingContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") is in processing. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String orderShippedContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been added tracking number:</p>\n" +
        "<p>Tracking number: <a href=\"" + EmailTagEnum.TRACKING_URL.getValue() + "\">" + EmailTagEnum.TRACKING_NUMBER.getValue() + "</a></p>\n" +
        "<p>Carrier: " + EmailTagEnum.CARRIER_NAME.getValue() + "</p>\n" +
        "<p>Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String orderOnHoldContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been placed on hold. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String orderCanceledContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been canceled successfully. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String orderRefundedContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been refunded successfully.</p>\n" +
        "<p>" + EmailTagEnum.REFUND_AMOUNT.getValue() + " " + EmailTagEnum.CURRENCY.getValue() + " has been back into you available amount.</p>\n" +
        "<p>Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String sellerDepositForAdminContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>" + EmailTagEnum.SELLER_FIRST_NAME.getValue() + " has just make a deposit:</p>\n" +
        "<p>Seller email: " + EmailTagEnum.SELLER_EMAIL.getValue() + "</p>\n" +
        "<p>Deposit amount: " + EmailTagEnum.DEPOSIT_AMOUNT.getValue() + " " + EmailTagEnum.CURRENCY.getValue() + "</p>\n" +
        "<p>Transaction ID: " + EmailTagEnum.TRANSACTION_ID.getValue() + "</p>\n" +
        "<p>Note: " + EmailTagEnum.DEPOSIT_NOTE.getValue() + "</p>\n" +
        "<p>Kindly go to PrintWay app and handle as soon as possible.</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String sellerMakeDepositContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>You have just make a deposit as below into PrintWay system:</p>\n" +
        "<p>Deposit amount: " + EmailTagEnum.DEPOSIT_AMOUNT.getValue() + " " + EmailTagEnum.CURRENCY.getValue() + "</p>\n" +
        "<p>Transaction ID: " + EmailTagEnum.TRANSACTION_ID.getValue() + "</p>\n" +
        "<p>Note: " + EmailTagEnum.DEPOSIT_NOTE.getValue() + "</p>\n" +
        "<p>The deposit is pending now. Kindly wait for our checking and dealing. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String sellerApprovedDepositContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your deposit with details below is approved and turn into available amount in PrintWay system:</p>\n" +
        "<p>Deposit amount: " + EmailTagEnum.DEPOSIT_AMOUNT.getValue() + " " + EmailTagEnum.CURRENCY.getValue() + "</p>\n" +
        "<p>Transaction ID: " + EmailTagEnum.TRANSACTION_ID.getValue() + "</p>\n" +
        "<p>Note: " + EmailTagEnum.DEPOSIT_NOTE.getValue() + "</p>\n" +
        "<p>Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    private final String sellerRejectedDepositContent = "<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n\n" +
        "<p>Your deposit with details below is REJECTED and can NOT turn into available amount in PrintWay system:</p>\n" +
        "<p>Deposit amount: " + EmailTagEnum.DEPOSIT_AMOUNT.getValue() + " " + EmailTagEnum.CURRENCY.getValue() + "</p>\n" +
        "<p>Transaction ID: " + EmailTagEnum.TRANSACTION_ID.getValue() + "</p>\n" +
        "<p>Note: " + EmailTagEnum.DEPOSIT_NOTE.getValue() + "</p>\n" +
        "<p><p>Rejected Reason: " + EmailTagEnum.REJECTED_REASON.getValue() + "</p>\n" +
        "<p>Any question, kindly contact us at support@pgcfulfillment.com. Thank you!</p>\n\n" +
        "<p>Kind regards,</p>\n" +
        "<p>PrintWay Team.</p>";

    @Value("${cloud.aws.access-key}")
    private String accessKey;

    @Value("${cloud.aws.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region}")
    private String region;

    @Value("${cloud.aws.amazon-ses.configuration-set}")
    private String configurationSet;

    @Value("${cloud.aws.amazon-ses.from}")
    private String fromAddress;

    private AmazonSimpleEmailService sesClient;

    private final MessageChannel messageChannel;

    private final NotificationSettingRepository notificationSettingRepository;
    private final UserRepository userRepository;

    public AmazonSESService(final SendEmailBinding sendEmailBinding,
                            final NotificationSettingRepository notificationSettingRepository,
                            final UserRepository userRepository) {
        this.notificationSettingRepository = notificationSettingRepository;
        this.userRepository = userRepository;
        this.messageChannel = sendEmailBinding.publisher();
    }

    @PostConstruct
    public void connect() {
        if (sesClient == null) {
            AWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
            sesClient = AmazonSimpleEmailServiceClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withRegion(region)
                .build();
        }
    }

    public void requestSendMail(SendMailRequestDTO sendMailRequestDTO) {
        try {
            messageChannel.send(MessageBuilder
                .withPayload(objectMapper.writeValueAsString(sendMailRequestDTO))
                .build());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    public void sendMail(SendMailRequestDTO sendMailRequestDTO) {
        // Construct an object to contain the recipient address.
        Destination destination = new Destination().withToAddresses(sendMailRequestDTO.getToAddress());
        // Create the subject and body of the message.
        Content subject = new Content().withData(sendMailRequestDTO.getSubject());
        Content textBody = new Content().withData(sendMailRequestDTO.getHtmlText());
        Body body = new Body().withHtml(textBody);

        // Create a message with the specified subject and body.
        Message message = new Message().withSubject(subject).withBody(body);
        // Assemble the email.
        SendEmailRequest request = new SendEmailRequest()
            .withConfigurationSetName(configurationSet)
            .withSource(fromAddress)
            .withReplyToAddresses(fromAddress)
            .withDestination(destination)
            .withMessage(message);
        // Send the email.
        SendEmailResult result = sesClient.sendEmail(request);
        log.debug("Sent success with MessageId: {}", result.getMessageId());
    }

    public void sendEmailForNewsUpdated(boolean isAdmin, User user, News news) {
        notificationSettingRepository.findById(isAdmin ? RoleEnum.ROLE_ADMIN_CONSTANT : user.getId()).ifPresent(notificationSetting -> {
            for (Config config : notificationSetting.getConfigs()) {
                if (ConfigEnum.NEWS_UPDATE_EMAIL.name().equals(config.getKey())
                    && Boolean.parseBoolean(config.getValue())) {
                    requestSendMail(SendMailRequestDTO.builder()
                        .toAddress(user.getEmail())
                        .subject(EmailTagEnum.SUBJECT_PREFIX.getValue() + " " + news.getTitle())
                        .htmlText(news.getContent())
                        .build());
                    break;
                }
            }
        });
    }

    public void sendEmailAfterChangeStatusForAdmin(Order order, LineItem lineItem) {
        notificationSettingRepository.findById(RoleEnum.ROLE_ADMIN_CONSTANT).ifPresent(adminSetting -> {
            String subject = EmailTagEnum.SUBJECT_PREFIX.getValue();
            Map<String, String> tags = new HashMap<>();
            userRepository.findByEmailIgnoreCase(order.getSellerEmail())
                .ifPresent(user -> tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName()));
            tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());
            tags.put(EmailTagEnum.LINE_ITEM_SKU.getValue(), lineItem.getSku());
            switch (ProduceStatusEnum.getByName(lineItem.getStatus()).orElseThrow(() -> new ObjectNotFoundException("status"))) {
                case PROCESSING:
                    subject += " Your order is in processing";
                    sendMailBySettingForAdmin(subject, orderProcessingContent, tags, adminSetting, ConfigEnum.ORDER_UPDATE_PROCESSING_EMAIL);
                    break;
                case ON_HOLD:
                    subject += " Your order has been placed on hold";
                    sendMailBySettingForAdmin(subject, orderOnHoldContent, tags, adminSetting, ConfigEnum.ORDER_UPDATE_ON_HOLD_EMAIL);
                    break;
                case CANCELED:
                    subject += " Your order has been canceled";
                    sendMailBySettingForAdmin(subject, orderCanceledContent, tags, adminSetting, ConfigEnum.ORDER_UPDATE_CANCEL_EMAIL);
                    break;
                case REFUNDED:
                    subject += " Your order has been refunded";
                    tags.put(EmailTagEnum.REFUND_AMOUNT.getValue(), order.getOrderLogs().get(order.getOrderLogs().size() - 1).getData());
                    tags.put(EmailTagEnum.CURRENCY.getValue(), order.getCurrency());
                    sendMailBySettingForAdmin(subject, orderCanceledContent, tags, adminSetting, ConfigEnum.ORDER_UPDATE_REFUND_EMAIL);
                    break;
            }
        });
    }

    public void sendEmailAfterNewOrderForSeller(Order order) {
        userRepository.findByEmailIgnoreCase(order.getSellerEmail())
            .flatMap(user -> notificationSettingRepository.findById(user.getId()))
            .ifPresent(userSetting -> {
                for (Config config : userSetting.getConfigs()) {
                    if (ConfigEnum.ORDER_NEW_EMAIL.name().equals(config.getKey())
                        && Boolean.parseBoolean(config.getValue())) {
                        Map<String, String> tags = new HashMap<>();
                        userRepository.findByEmailIgnoreCase(order.getSellerEmail())
                            .ifPresent(user -> tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName()));
                        tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());

                        requestSendMail(SendMailRequestDTO.builder()
                            .toAddress(order.getSellerEmail())
                            .subject(EmailTagEnum.SUBJECT_PREFIX.getValue() + " New order is approved")
                            .htmlText(newOrderContent)
                            .tags(tags)
                            .build());
                        break;
                    }
                }
            });
    }

    public void sendEmailAfterChangeStatusForSeller(Order order, LineItem lineItem) {
        userRepository.findByEmailIgnoreCase(order.getSellerEmail())
            .ifPresent(user -> notificationSettingRepository.findById(user.getId())
                .ifPresent(userSetting -> {
                    String subject = EmailTagEnum.SUBJECT_PREFIX.getValue();
                    Map<String, String> tags = new HashMap<>();
                    tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                    tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());
                    tags.put(EmailTagEnum.LINE_ITEM_SKU.getValue(), lineItem.getSku());

                    switch (ProduceStatusEnum.getByName(lineItem.getStatus())
                        .orElseThrow(() -> new ObjectNotFoundException("status"))) {
                        case PENDING_DESIGN:
                            subject += " Need upload design files";
                            sendMailByConfigForUser(user.getEmail(), subject, orderPendingDesignContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_PENDING_DESIGN_EMAIL);
                            break;
                        case CHOOSE_SUPPLIER:
                        case PROCESSING:
                        case REQUEST_CANCEL:
                            subject += " Your order is in pending";
                            sendMailByConfigForUser(user.getEmail(), subject, orderProcessingContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_PENDING_EMAIL);
                            break;
                        case ON_HOLD:
                            subject += " Your order has been placed on hold";
                            sendMailByConfigForUser(user.getEmail(), subject, orderOnHoldContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_ON_HOLD_EMAIL);
                            break;
                        case CANCELED:
                            subject += " Your order has been canceled";
                            sendMailByConfigForUser(user.getEmail(), subject, orderCanceledContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_CANCEL_EMAIL);
                            break;
                        case REFUNDED:
                            subject += " Your order has been refunded";
                            tags.put(EmailTagEnum.REFUND_AMOUNT.getValue(), order.getOrderLogs().get(order.getOrderLogs().size() - 1).getData());
                            tags.put(EmailTagEnum.CURRENCY.getValue(), order.getCurrency());
                            sendMailByConfigForUser(user.getEmail(), subject, orderRefundedContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_REFUND_EMAIL);
                            break;
                        case SHIPPED:
                            subject += " Your order has been added Tracking number";
                            tags.put(EmailTagEnum.TRACKING_NUMBER.getValue(), lineItem.getTrackingNumber());
                            tags.put(EmailTagEnum.TRACKING_URL.getValue(), lineItem.getTrackingUrl());
                            tags.put(EmailTagEnum.CARRIER_NAME.getValue(), lineItem.getCarrier());
                            sendMailByConfigForUser(user.getEmail(), subject, orderShippedContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_SHIPPED_EMAIL);
                            break;
                    }
                }));
    }

    public void sendEmailAfterChangeStatusForSupplier(Order order, LineItem lineItem) {
        if (!StringUtils.isEmpty(lineItem.getSupplierId())) {
            userRepository.findById(lineItem.getSupplierId())
                .ifPresent(user -> notificationSettingRepository.findById(user.getId())
                    .ifPresent(userSetting -> {
                        String subject = EmailTagEnum.SUBJECT_PREFIX.getValue();
                        Map<String, String> tags = new HashMap<>();
                        tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                        tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());
                        tags.put(EmailTagEnum.LINE_ITEM_SKU.getValue(), lineItem.getSku());

                        switch (ProduceStatusEnum.getByName(lineItem.getStatus())
                            .orElseThrow(() -> new ObjectNotFoundException("status"))) {
                            case PROCESSING:
                                subject += " Your order is in processing";
                                sendMailByConfigForUser(user.getEmail(), subject, orderProcessingContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_PROCESSING_EMAIL);
                                break;
                            case SHIPPED:
                                subject += " Your order has been added Tracking number";
                                tags.put(EmailTagEnum.TRACKING_NUMBER.getValue(), lineItem.getTrackingNumber());
                                tags.put(EmailTagEnum.TRACKING_URL.getValue(), lineItem.getTrackingUrl());
                                tags.put(EmailTagEnum.CARRIER_NAME.getValue(), lineItem.getCarrier());
                                sendMailByConfigForUser(user.getEmail(), subject, orderShippedContent, tags, userSetting, ConfigEnum.ORDER_UPDATE_SHIPPED_EMAIL);
                                break;
                        }
                    }));
        }
    }

    public void sendMailAfterUpdateDesignForSupplier(Order order, LineItem lineItem, String imageUrl) {
        Map<String, String> tags = new HashMap<>();
        tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());
        tags.put(EmailTagEnum.LINE_ITEM_SKU.getValue(), lineItem.getSku());
        tags.put(EmailTagEnum.IMAGE_URL.getValue(), imageUrl);

        if (!StringUtils.isEmpty(lineItem.getSupplierId())) {
            userRepository.findById(lineItem.getSupplierId())
                .ifPresent(user -> notificationSettingRepository.findById(user.getId())
                    .ifPresent(userSetting -> {
                        tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());

                        requestSendMail(SendMailRequestDTO.builder()
                            .toAddress(user.getEmail())
                            .subject(EmailTagEnum.SUBJECT_PREFIX.getValue() + " Updated design")
                            .htmlText(orderUpdateDesignContent)
                            .tags(tags)
                            .build());
                    }));
        }

        int page = 0;
        while (true) {
            List<User> users = userRepository.findAllByListRoles(
                Stream.of(RoleEnum.ROLE_ADMIN_CONSTANT, RoleEnum.ROLE_SUPPORTER_CONSTANT).collect(Collectors.toSet()),
                PageRequest.of(page++, PAGE_SIZE));

            if (users.isEmpty()) {
                break;
            }

            users.forEach(user -> {
                tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                requestSendMail(SendMailRequestDTO.builder()
                    .toAddress(user.getEmail())
                    .subject(EmailTagEnum.SUBJECT_PREFIX.getValue() + " Updated design")
                    .htmlText(orderUpdateDesignContent)
                    .tags(tags)
                    .build());
            });
        }
    }

    public void sendMailForBalanceUpdated(TransactionHistory transactionHistory) {
        String subject = transactionHistory.getNumber()
            + " - " + transactionHistory.getType()
            + " - " + transactionHistory.getStatus();
        String body = transactionHistory.getNumber()
            + " - " + transactionHistory.getAmount()
            + " - " + transactionHistory.getDiscount()
            + " - " + transactionHistory.getTransactionId()
            + (transactionHistory.getSite() != null ? " - " + transactionHistory.getSite().getUrl() : "")
            + " - " + transactionHistory.getCreatedByFullName()
            + " - " + transactionHistory.getCreatedDate()
            + " - " + transactionHistory.getType()
            + " - " + transactionHistory.getStatus()
            + " - " + transactionHistory.getNote();

        // Send mail to user (Seller/Supplier)
        requestSendMail(SendMailRequestDTO.builder()
            .toAddress(transactionHistory.getEmail())
            .subject(subject)
            .htmlText(body)
            .build());

        // Send mail to all admin users
        userRepository.findAllByActivatedTrueAndRolesContains(RoleEnum.ROLE_ADMIN_CONSTANT)
            .forEach(user -> requestSendMail(SendMailRequestDTO.builder()
                .toAddress(user.getEmail())
                .subject(subject)
                .htmlText(body)
                .build()));
    }

    public void sendMailAfterUpdateDesignForAdmin(Order order, LineItem lineItem, String imageUrl) {
        if (!StringUtils.isEmpty(lineItem.getSupplierId())) {
            userRepository.findById(lineItem.getSupplierId())
                .ifPresent(user -> notificationSettingRepository.findById(user.getId())
                    .ifPresent(userSetting -> {
                        Map<String, String> tags = new HashMap<>();
                        tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                        tags.put(EmailTagEnum.ORDER_NAME.getValue(), order.getOrderName());
                        tags.put(EmailTagEnum.LINE_ITEM_SKU.getValue(), lineItem.getSku());
                        tags.put(EmailTagEnum.IMAGE_URL.getValue(), imageUrl);

                        requestSendMail(SendMailRequestDTO.builder()
                            .toAddress(user.getEmail())
                            .subject(EmailTagEnum.SUBJECT_PREFIX.getValue() + " Updated design")
                            .htmlText(orderUpdateDesignContent)
                            .tags(tags)
                            .build());
                    }));
        }
    }

    public void sendMailForSellerDeposit(TransactionHistory transactionHistory) {
        String subject = EmailTagEnum.SUBJECT_PREFIX.getValue();
        Map<String, String> tags = new HashMap<>();
        tags.put(EmailTagEnum.FIRST_NAME.getValue(), transactionHistory.getCreatedByFullName());
        tags.put(EmailTagEnum.SELLER_FIRST_NAME.getValue(), transactionHistory.getCreatedByFullName());
        tags.put(EmailTagEnum.SELLER_EMAIL.getValue(), transactionHistory.getEmail());
        tags.put(EmailTagEnum.DEPOSIT_AMOUNT.getValue(), transactionHistory.getAmount() + "");
        tags.put(EmailTagEnum.CURRENCY.getValue(), "USD");
        tags.put(EmailTagEnum.TRANSACTION_ID.getValue(), "#" + transactionHistory.getNumber() + " - " + transactionHistory.getTransactionId());
        tags.put(EmailTagEnum.DEPOSIT_NOTE.getValue(), transactionHistory.getNote());
        tags.put(EmailTagEnum.REJECTED_REASON.getValue(), transactionHistory.getNote());

        switch (TransactionStatusEnum.getByName(transactionHistory.getStatus()).get()) {
            case PENDING:
                // Send mail for seller after make deposit
                requestSendMail(SendMailRequestDTO.builder()
                    .toAddress(transactionHistory.getEmail())
                    .subject(subject + " Your deposit is pending")
                    .htmlText(sellerMakeDepositContent)
                    .tags(tags)
                    .build());

                // Send mail for admin, accounting when seller make deposit
                int page = 0;
                while (true) {
                    List<User> users = userRepository.findAllByListRoles(
                        Stream.of(RoleEnum.ROLE_ADMIN_CONSTANT, RoleEnum.ROLE_ACCOUNTING_CONSTANT).collect(Collectors.toSet()),
                        PageRequest.of(page++, PAGE_SIZE));

                    if (users.isEmpty()) {
                        break;
                    }

                    users.forEach(user -> {
                        tags.put(EmailTagEnum.FIRST_NAME.getValue(), user.getFirstName());
                        requestSendMail(SendMailRequestDTO.builder()
                            .toAddress(user.getEmail())
                            .subject(subject + " New Deposit is pending")
                            .htmlText(sellerDepositForAdminContent)
                            .tags(tags)
                            .build());
                    });
                }
                break;
            case APPROVED:
                requestSendMail(SendMailRequestDTO.builder()
                    .toAddress(transactionHistory.getEmail())
                    .subject(subject + " Your deposit is approved")
                    .htmlText(sellerApprovedDepositContent)
                    .tags(tags)
                    .build());
                break;
            case REJECTED:
                requestSendMail(SendMailRequestDTO.builder()
                    .toAddress(transactionHistory.getEmail())
                    .subject(subject + " Your deposit is Rejected")
                    .htmlText(sellerRejectedDepositContent)
                    .tags(tags)
                    .build());
                break;
        }
    }

    private void sendMailBySettingForAdmin(String subject,
                                           String body,
                                           Map<String, String> tags,
                                           NotificationSetting adminSetting,
                                           ConfigEnum configEmail) {
        for (Config config : adminSetting.getConfigs()) {
            if (configEmail.name().equals(config.getKey())
                && Boolean.parseBoolean(config.getValue())) {
                userRepository.findAllByActivatedTrueAndRolesContains(RoleEnum.ROLE_ADMIN_CONSTANT)
                    .forEach(user -> sendMailByStatus(user.getEmail(), subject, body, tags));
                break;
            }
        }
    }

    private void sendMailByConfigForUser(String toAddress,
                                         String subject, String body,
                                         Map<String, String> tags,
                                         NotificationSetting userSetting,
                                         ConfigEnum configEmail) {
        for (Config config : userSetting.getConfigs()) {
            if (configEmail.name().equals(config.getKey())
                && Boolean.parseBoolean(config.getValue())) {
                sendMailByStatus(toAddress, subject, body, tags);
                break;
            }
        }
    }

    private void sendMailByStatus(String toAddress, String subject, String body, Map<String, String> tags) {
        requestSendMail(SendMailRequestDTO.builder()
            .toAddress(toAddress)
            .subject(subject)
            .htmlText(body)
            .tags(tags)
            .build());
    }
}
