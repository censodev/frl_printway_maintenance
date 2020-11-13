const configs = {
    roles: [
        'ROLE_ADMIN',
        'ROLE_SUPPORTER',
        'ROLE_LISTING',
        'ROLE_ACCOUNTING',
        'ROLE_USER',
        'ROLE_SUPPLIER'
    ],
    balanceActions: [
        "DEPOSIT",
        "PAID_ITEM",
        "PAID_SUPPLIER",
        "REFUND",
        "CUSTOM_ADD",
        "CUSTOM_SUBTRACT"
    ],
    balanceStatus: [
        "DEBT",
        "APPROVED",
        "PENDING",
        "REJECTED"
    ],
    ordersProductStatus: [
        "ALL",
        "PROCESSING",
        "IN_PRODUCTION",
        "SHIPPED",
        "CANCELED"
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
        "REPORT_ERROR",
        "CANCEL"
    ]
};

module.exports = configs;
