package com.goofinity.pgc_service.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.goofinity.pgc_service.domain.AbstractAuditingEntity;
import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.domain.User;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@org.springframework.data.mongodb.core.mapping.Document(collection = "product")
@TypeAlias("product")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"target"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Product extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private String email;

    @DBRef(lazy = true)
    @JsonIgnore
    private User user;

    private long productId;

    @NotEmpty
    private String title;

    @DBRef(lazy = true)
    @NotNull
    private Site site;

    @NotEmpty
    private String description;

    private List<String> categories;

    private List<String> tags;

    //    @NotEmpty
    private List<ProductImage> images;

    @NotEmpty
    private List<ProductTypeGroup> productTypes;

    private boolean synced;

    private boolean activated;

    private String parentId;

    private String url;

    private String uniqueKey;

    @JsonIgnore
    private int totalOrder;

    @Transient
    private boolean draft;

    @Transient
    private String fullName;

    @Transient
    private List<Long> variantIds;

    public boolean equalForUpdate(Product product) {
        AtomicBoolean isUpdateVariant = new AtomicBoolean(false);
        for (ProductTypeGroup pg : this.productTypes) {
            product.getProductTypes()
                .stream()
                .filter(ptg -> ptg.getProductType().getId().equals(pg.getProductType().getId()))
                .findFirst()
                .ifPresent(uv -> {
                    for (ProductVariantDetail vd : pg.getVariantDetails()) {
                        ProductVariantDetail pvd = uv.getVariantDetails()
                            .stream()
                            .filter(uvd -> uvd.getBaseSku().equals(vd.getBaseSku()))
                            .findFirst()
                            .orElse(null);
                        if (pvd != null
                            && (vd.getRegularPrice() != pvd.getRegularPrice()
                            || vd.getSalePrice() != pvd.getSalePrice()
                            || vd.isEnable() != pvd.isEnable()
                            || !Objects.equals(vd.getImageId(), pvd.getImageId()))) {
                            isUpdateVariant.set(true);
                            break;
                        }
                    }
                });
        }

        boolean isUpdateImage = this.getImages().stream()
            .map(productImage -> productImage.getImage().getId())
            .collect(Collectors.toList())
            .containsAll(product.getImages().stream()
                .map(productImage -> productImage.getImage().getId())
                .collect(Collectors.toList()));


        return Objects.equals(this.title, product.getTitle())
            && Objects.equals(this.description, product.getDescription())
            && Objects.equals(this.tags, product.getTags())
            && Objects.equals(this.categories, product.getCategories())
            && this.productTypes.size() == product.getProductTypes().size()
            && !isUpdateImage
            && !isUpdateVariant.get();
    }
}
