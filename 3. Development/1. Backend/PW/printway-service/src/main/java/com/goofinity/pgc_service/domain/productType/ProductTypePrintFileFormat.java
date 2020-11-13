package com.goofinity.pgc_service.domain.productType;

import com.goofinity.pgc_service.domain.ImageUpload;
import lombok.*;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductTypePrintFileFormat {
    @Transient
    public static final String SALT = "1SVqujy7IylV1QNumZyx";

    @DBRef
    private ImageUpload thumb;

    @NotEmpty
    private String name;

    @Min(1)
    private int width;

    @Min(1)
    private int height;

    private String note;

    private String sku;

    private String uniqueKey;
}
