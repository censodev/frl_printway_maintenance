package com.goofinity.pgc_service.domain.productType;

import com.goofinity.pgc_service.domain.Carrier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductTypeCarrier {
    @DBRef(lazy = true)
    private Carrier carrier;

    private double cost;
}
