package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Document(collection = "transaction_history")
@TypeAlias("transaction_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionHistory extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Transient
    public static final String SEQUENCE_NAME = "transaction_sequence";

    @Id
    private String id;

    private long number;

    @NotEmpty
    private String createdByFullName;

    @NotNull
    private String email;

    private String supplier;

    @NotNull
    private String type;

    @NotNull
    private String status;

    private String orderId;
    private String itemSku;
    private String note;
    private String transactionId;

    private double discount;
    private double amount;

    @DBRef(lazy = true)
    private Site site;

    private Instant lastChangeStatusDate;
}
