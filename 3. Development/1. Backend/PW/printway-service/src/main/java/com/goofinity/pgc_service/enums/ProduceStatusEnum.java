package com.goofinity.pgc_service.enums;

import java.util.*;

public enum ProduceStatusEnum {
    ALL,
    COOLING_OFF,
    PENDING,
    PENDING_DESIGN,
    NEED_PAY,
    CHOOSE_SUPPLIER,
    CHOOSE_CARRIER,
    PROCESSING,
    IN_PRODUCTION,
    SHIPPED,
    ACTION_REQUIRED,
    SOLVE_ACTION_REQUIRED,
    ON_HOLD,
    SOLVE_ON_HOLD,
    REQUEST_CANCEL,
    CANCELED,
    REFUNDED;

    public static Optional<ProduceStatusEnum> getByName(final String enumName) {
        try {
            return Optional.of(ProduceStatusEnum.valueOf(enumName));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public static List<String> getBeforeProcessingStatuses() {
        return Arrays.asList(PENDING_DESIGN.name(), NEED_PAY.name(), CHOOSE_SUPPLIER.name(), ACTION_REQUIRED.name(),
            ON_HOLD.name(), CANCELED.name(), REFUNDED.name());
    }

    public static List<String> getCoolingOffStatuses() {
        return Arrays.asList(PENDING_DESIGN.name(), NEED_PAY.name(), CHOOSE_SUPPLIER.name(), ACTION_REQUIRED.name(),
            ON_HOLD.name());
    }

    public static List<String> getSupplierStatuses() {
        return Arrays.asList(PROCESSING.name(), IN_PRODUCTION.name(), SHIPPED.name(), REQUEST_CANCEL.name(), CANCELED.name());
    }

    public static List<String> getAfterInProductionStatuses() {
        return Arrays.asList(IN_PRODUCTION.name(), SHIPPED.name(), REQUEST_CANCEL.name(), CANCELED.name());
    }

    public static List<String> getExcludeChangeCarrierStatus() {
        return Arrays.asList(SHIPPED.name(), REQUEST_CANCEL.name(), CANCELED.name());
    }

    public static List<String> getFinishOrderStatuses() {
        return Arrays.asList(SHIPPED.name(), CANCELED.name(), REFUNDED.name());
    }

    public static List<String> getCanceledStatuses() {
        return Arrays.asList(CANCELED.name(), REFUNDED.name());
    }

    public static Map<String, Long> initStatusStatistic() {
        Map<String, Long> statistic = new HashMap<>();
        statistic.put(ProduceStatusEnum.ALL.name(), (long) 0);
        statistic.put(ProduceStatusEnum.COOLING_OFF.name(), (long) 0);
        statistic.put(ProduceStatusEnum.PENDING_DESIGN.name(), (long) 0);
        statistic.put(ProduceStatusEnum.NEED_PAY.name(), (long) 0);
        statistic.put(ProduceStatusEnum.CHOOSE_SUPPLIER.name(), (long) 0);
        statistic.put(ProduceStatusEnum.CHOOSE_CARRIER.name(), (long) 0);
        statistic.put(ProduceStatusEnum.PROCESSING.name(), (long) 0);
        statistic.put(ProduceStatusEnum.IN_PRODUCTION.name(), (long) 0);
        statistic.put(ProduceStatusEnum.SHIPPED.name(), (long) 0);
        statistic.put(ProduceStatusEnum.ACTION_REQUIRED.name(), (long) 0);
        statistic.put(ProduceStatusEnum.SOLVE_ACTION_REQUIRED.name(), (long) 0);
        statistic.put(ProduceStatusEnum.ON_HOLD.name(), (long) 0);
        statistic.put(ProduceStatusEnum.SOLVE_ON_HOLD.name(), (long) 0);
        statistic.put(ProduceStatusEnum.REQUEST_CANCEL.name(), (long) 0);
        statistic.put(ProduceStatusEnum.CANCELED.name(), (long) 0);
        statistic.put(ProduceStatusEnum.REFUNDED.name(), (long) 0);

        return statistic;
    }

    public static List<String> getPendingStatuses() {
        return Arrays.asList(PROCESSING.name(), CHOOSE_SUPPLIER.name(), REQUEST_CANCEL.name());
    }

    public static List<String> getOnHoldStatuses() {
        return Arrays.asList(ON_HOLD.name(), ACTION_REQUIRED.name());
    }

    public static List<String> getUpdateDesignStatuses() {
        return Arrays.asList(PENDING_DESIGN.name(), NEED_PAY.name(), CHOOSE_SUPPLIER.name(), ProduceStatusEnum.PROCESSING.name(),
            ACTION_REQUIRED.name(), ON_HOLD.name(), REQUEST_CANCEL.name(), IN_PRODUCTION.name());
    }
}
