package com.goofinity.pgc_service.domain;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductPrintFileDetail {
    private String sku;
    private String uniqueKey;
    private String name;
    private String note;
    private double width;
    private double height;

    @DBRef(lazy = true)
    private ImageUpload image;

    private boolean custom;

    public String getProductTypeSku() {
        return sku.lastIndexOf("-") > 0 ? sku.substring(0, sku.lastIndexOf("-")) : sku;
    }
}
