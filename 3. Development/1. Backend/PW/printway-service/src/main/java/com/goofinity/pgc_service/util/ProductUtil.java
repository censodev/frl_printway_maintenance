package com.goofinity.pgc_service.util;

import com.goofinity.pgc_service.domain.productType.ProductTypeVariantDetail;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import org.apache.commons.lang3.StringUtils;

public class ProductUtil {
    public static String getVariantName(ProductTypeVariantDetail variantDetail) {
        return (StringUtils.isEmpty(variantDetail.getOption2())
            ? variantDetail.getOption1()
            : variantDetail.getOption1() + "/" + variantDetail.getOption2()).toLowerCase();
    }

    public static String getVariantName(ProductVariantDetail variantDetail) {
        return (StringUtils.isEmpty(variantDetail.getOption2())
            ? variantDetail.getOption1()
            : variantDetail.getOption1() + "/" + variantDetail.getOption2()).toLowerCase();
    }
}
