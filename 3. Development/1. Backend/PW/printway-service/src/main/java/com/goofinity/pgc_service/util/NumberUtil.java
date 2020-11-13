package com.goofinity.pgc_service.util;

import java.math.BigDecimal;
import java.math.MathContext;

public class NumberUtil {
    public static BigDecimal toBigDecimalDouble(double value) {
        return new BigDecimal(value, MathContext.DECIMAL32);
    }

    public static double addDouble(double valueA, double valueB) {
        return toBigDecimalDouble(valueA).add(toBigDecimalDouble(valueB)).doubleValue();
    }

    public static double addDouble(double valueA, BigDecimal valueB) {
        return toBigDecimalDouble(valueA).add(valueB).doubleValue();
    }

    public static double subtractDouble(double valueA, double valueB) {
        return toBigDecimalDouble(valueA).subtract(toBigDecimalDouble(valueB)).doubleValue();
    }

    public static double subtractDouble(double valueA, BigDecimal valueB) {
        return toBigDecimalDouble(valueA).subtract(valueB).doubleValue();
    }
}
