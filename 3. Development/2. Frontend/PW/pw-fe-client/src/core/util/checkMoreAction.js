const checkMoreAction = (action, nestedRowsSelected) => {
    const checkOnHold = ["CANCELED","ON_HOLD" , "PROCESSING", "IN_PRODUCTION", "SHIPPED"];
    const checkCancel = ["CANCELED", "IN_PRODUCTION", "SHIPPED"];
    const listStatus = nestedRowsSelected.map(x => x.status);
    switch (action) {
        case "ON_HOLD": {
            for (let item of listStatus) {
                if (checkOnHold.includes(item)) {
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
        case "ASSIGN_CARRIER":
            return true
        default:
            break;
    }
}
export default checkMoreAction;