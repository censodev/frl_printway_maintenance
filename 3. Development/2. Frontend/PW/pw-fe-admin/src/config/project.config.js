const configs = {
    roles: [
        'ROLE_ADMIN',
        'ROLE_SUPPORTER',
        'ROLE_LISTING',
        'ROLE_ACCOUNTING',
        'ROLE_SELLER',
        'ROLE_SUPPLIER'
    ],
    balanceActions: [
        "DEPOSIT",
        "PAID_ITEM",
        "REFUND",
        "CUSTOM_TRANSACTION",
    ],
    balanceStatus: [
        "DEBT",
        "APPROVED",
        "PENDING",
        "REJECTED"
    ],
    balanceProductStatus:[
        "ALL_STATUS",
        "ORDER_CREATED",
        "PENDING_DESIGN",
        "CHARGING",
        "AWAIT",
        "PROCESSING",
        "IN-PRODUCTION",
        "SHIPPED",
    ],
    ordersProductStatus: [
        "ALL",
        "COOLING_OFF",
        "PENDING_DESIGN",
        "NEED_PAY",
        "CHOOSE_SUPPLIER",
        "ON_HOLD",
        "PROCESSING",
        "IN_PRODUCTION",
        "SHIPPED",
        "REQUEST_CANCEL",
        "CANCELED",
        "ACTION_REQUIRED"
    ],
    ordersProductStatus2: [
        "ORDER_CREATED",
        "PENDING_DESIGN",
        "CHARGING",
        "AWAIT",
        "PROCESSING",
        "IN_PRODUCTION",
        "SHIPPED",
        "ON_HOLD"
    ],
    orderAction: [
        "ACTION_REQUIRED",
        "RESEND",
        "REFUND",
        "CANCEL",
        "EDIT_TRACKING"
    ]
};

module.exports = configs;
