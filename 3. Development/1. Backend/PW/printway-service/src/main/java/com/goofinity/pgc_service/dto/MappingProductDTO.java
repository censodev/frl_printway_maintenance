package com.goofinity.pgc_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.goofinity.pgc_service.domain.Site;
import com.goofinity.pgc_service.domain.product.ProductTypeGroup;
import com.goofinity.pgc_service.dto.shopify.product.ShopifyProductDTO;
import com.goofinity.pgc_service.dto.woo.product.WooProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MappingProductDTO {
    @NotNull
    private Site site;

    @NotEmpty
    private List<ProductTypeGroup> productTypes;

    private List<WooProduct> wooProducts;
    private List<ShopifyProductDTO> shopifyProducts;

    public List<Object> getProducts() {
        return (List) (wooProducts == null || wooProducts.isEmpty() ? shopifyProducts : wooProducts);
    }
}
