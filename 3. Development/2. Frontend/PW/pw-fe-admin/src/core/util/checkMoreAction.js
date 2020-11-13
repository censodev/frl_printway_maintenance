const checkMoreAction = (action, nestedRowsSelected) => {
    const checkActionRequired = ["CANCELED","ACTION_REQUIRED", "IN_PRODUCTION", "SHIPPED"];
    const checkRefund = "PROCESSING";
    const checkCancel = ["CANCELED", "SHIPPED", "REFUNDED"];
    const listStatus = nestedRowsSelected.map(x => x.status);
    switch (action) {
        case "ACTION_REQUIRED": {
            for (let item of listStatus) {
                if (checkActionRequired.includes(item)) {
                    return false;
                }
            }
            return true;
        }
        case "REFUND": {
            for (let item of listStatus) {
                if (checkRefund !== item) {
                    return false;
                }
            }
            return true;
        }
        case "CANCEL": {
            for (let item of listStatus) {
                if (checkCancel.includes(item)) {
                    return false;
                }
            }
            return true
        }
        case "RESEND": {
            return true
        }

        default:
            break;
    }
}
export default checkMoreAction;