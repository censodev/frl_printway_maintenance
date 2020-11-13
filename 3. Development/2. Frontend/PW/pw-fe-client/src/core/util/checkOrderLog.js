import capitalize from './capitalize';

const checkOrderLogs = ({author, type, itemSku, data}) => {
    switch (type) {
        case "ORDER_CREATED":
            return capitalize(type)
        case "COOLING_OFF":
            return 'Order was cooling-off'
        case "INVALID_SHIPPING_COUNTRY":
            return `Order invalid shipping country${itemSku ? `,item "${itemSku}"` : ""}`
        case "PENDING_DESIGN":
            return `Pending design ${itemSku ? `,item "${itemSku}"` : ""}`
        case "CHOOSE_SUPPLIER":
            return `${author || ""} choosed supplier for item "${itemSku ? itemSku : ""}"`
        case "CHOOSE_CARRIER":
            return `${author || ""} choosed carrier for item "${itemSku ? itemSku : ""}"`
        case "NEED_PAY_COOLING_OFF":
            return `Need pay ${itemSku ? `for item "${itemSku}"` : ""}`
        case "PAID":
            return `Paid ${itemSku ? `for item "${itemSku}"` : ""}`
        case "NOT_ENOUGH_BALANCE":
            return `Not enough balance ${itemSku ? `for item "${itemSku}"` : ""}`
        case "PROCESSING":
            return `Processing ${itemSku ? `item "${itemSku}"` : ""}`
        case "WAITING_FOR_ADMIN_APPROVE":
            return `Waiting for admin prove ${itemSku ? `item "${itemSku}"` : ""}`
        case "ACTION_REQUIRE":
            return `${author || ""} setted action require for item "${itemSku ? itemSku : ""}"`
        case "ON_HOLD":
            return `${author || ""} on hold for item "${itemSku ? itemSku : ""}"`
        case "UPDATE_SHIPPING_ADDRESS":
            return `${author || ""} update shipping address for item "${itemSku ? itemSku : ""}"`
        case "UPDATE_DESIGN":
            return `${author || ""} update design for item "${itemSku ? itemSku : ""}"`
        case "SOLVE_ON_HOLD":
            return `${author || ""} solve on hold for item "${itemSku ? itemSku : ""}"`
        case "SOLVE_ACTION_REQUIRED":
            return `${author || ""} solve action required for item "${itemSku ? itemSku : ""}"`
        case "APPROVED_REQUEST_CANCEL":
            return `${author || ""} approved request cancel for item "${itemSku ? itemSku : ""}"`
        case "REJECTED_REQUEST_CANCEL":
            return `${author || ""} rejected request cancel for item "${itemSku ? itemSku : ""}"`
        case "IN_PRODUCTION":
            return `Item "${itemSku}" in production`
        case "SHIPPED":
            return `Item "${itemSku}" shipped`
        case "UPDATED_TRACKING":
            return `${author || ""} update tracking for item "${itemSku ? itemSku : ""}"`
        case "SUPPLIER_REQUEST_CANCEL":
            return `Supplier request cancel for item "${itemSku ? itemSku : ""}"`
        case "CANCELED":
            return `Item "${itemSku}" cancelled`
        case "AUTO_REFUNDED":
            return `Item "${itemSku}" auto refunded`
        case "REFUNDED":
            return `Item "${itemSku}" refunded`
        default:
            return null;
    }
}
export default checkOrderLogs;