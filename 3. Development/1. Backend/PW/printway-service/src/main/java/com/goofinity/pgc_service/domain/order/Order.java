package com.goofinity.pgc_service.domain.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.goofinity.pgc_service.domain.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@org.springframework.data.mongodb.core.mapping.Document(collection = "order")
@TypeAlias("order")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"target"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Order extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotEmpty
    private String orderId;

    private String orderName;

    @NotEmpty
    private String orderNumber;

    @NotEmpty
    private String siteType;

    @DBRef(lazy = true)
    @NotNull
    private Site site;

    @NotEmpty
    private String sellerEmail;

    @DBRef(lazy = true)
    private User seller;

    private String status;

    private String currency;

    private double total;

    private double totalBaseCost;

    private double discount;

    private List<LineItem> lineItems = new ArrayList<>();

    private Address billingAddress;

    private Address shippingAddress;

    private boolean coolingOff;

    private Instant coolingOffExp;

    private String note;

    private boolean importOrder;

    private int numberOfDuplicated;

    private int indexDuplicate;

    private String parentId;

    private String source;

    @Builder.Default
    private List<OrderLog> orderLogs = new ArrayList<>();

    public void addOrderLog(String sku, String type, String data) {
        addOrderLog(sku, type, data, "System");
    }

    public void addOrderLog(String sku, String type, String data, String author) {
        orderLogs.add(OrderLog.builder()
            .time(Instant.now())
            .itemSku(sku)
            .type(type)
            .data(data)
            .author(author)
            .build());
    }
}
