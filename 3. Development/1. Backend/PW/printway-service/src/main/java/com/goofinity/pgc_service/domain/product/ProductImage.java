package com.goofinity.pgc_service.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.goofinity.pgc_service.domain.ImageUpload;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductImage {
    @DBRef(lazy = true)
    private ImageUpload image;

    private int imagePosition;
    private Long imageId;
}
