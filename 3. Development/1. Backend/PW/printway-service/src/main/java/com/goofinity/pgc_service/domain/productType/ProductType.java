package com.goofinity.pgc_service.domain.productType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.goofinity.pgc_service.domain.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "product_type")
@TypeAlias("product_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductType extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotEmpty
    private String title;

    @NotEmpty
    private String sku;

    private int priority;

    private String description;

    @DBRef(lazy = true)
    @NotEmpty
    private List<User> suppliers;

    @NotEmpty
    private List<ProductTypeCarrier> carriers;

    @DBRef(lazy = true)
    @NotNull
    private Carrier defaultCarrier;

    @NotNull
    @DBRef(lazy = true)
    private Category category;

    @DBRef(lazy = true)
    private List<ImageUpload> images;

    @NotEmpty
    @Valid
    @Size(max = 3)
    private List<Variant> variants;

    @NotEmpty
    @Valid
    private List<ProductTypeVariantDetail> variantDetails;

    @NotEmpty
    @Valid
    private List<ProductTypePrintFileFormat> printFileFormats;

    @Builder.Default
    private boolean include = true;

    @Builder.Default
    private List<String> countries = new ArrayList<>();

    @Builder.Default
    private boolean active = true;

    @JsonIgnore
    private int totalOrder;
}
