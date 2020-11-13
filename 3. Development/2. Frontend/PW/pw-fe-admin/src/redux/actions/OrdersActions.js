import * as fileSaver from 'file-saver';
import { OrdersActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';
import { IdcardFilled } from '@ant-design/icons';
import { rejectErrorAction } from './UserBalancesActions';

// fetch list
export const fetchAllOrderAction = () => {
    return {
        type: OrdersActionTypes.FETCH_ALL_ORDERS
    }
}
export const fetchAllOrderSuccessAction = orders => {
    return {
        type: OrdersActionTypes.FETCH_ALL_ORDERS_SUCCESS,
        payload: orders
    }
}
export const fetchAllOrderErrorAction = error => {
    return {
        type: OrdersActionTypes.FETCH_ALL_ORDERS_ERROR,
        payload: error
    }
}
export const fetchAllOrder = params => async dispatch => {
    dispatch(fetchAllOrderAction());
    try {
        const url = getQueryUrl("pgc-service/api/order/admin/page", params);
        const res = await axios.get(decodeURIComponent(url));

        // const res = await axios.get("https://api.mocki.io/v1/6cbe5f6f");
        const { data } = res;
        dispatch(fetchAllOrderSuccessAction(data));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllOrderErrorAction(error));
    }
}
// accept cancel order
export const acceptCancelAction = () => ({
    type: OrdersActionTypes.ACCEPT_CANCEL
})
export const acceptCancelSuccessAction = () => ({
    type: OrdersActionTypes.ACCEPT_CANCEL_SUCCESS
})
export const acceptCancelErrorAction = error => ({
    type: OrdersActionTypes.ACCEPT_CANCEL_ERROR,
    payload: error
})
export const acceptCancel = params => async dispatch => {
    dispatch(acceptCancelAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/request-cancel/approve", params);
        if(res && res.status === 200) {
            dispatch(acceptCancelSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(acceptCancelErrorAction(error))
    }
}
// not accept order
export const rejectCancelAction = () => ({
    type: OrdersActionTypes.REJECT_CANCEL
})
export const rejectCancelSuccessAction = () => ({
    type: OrdersActionTypes.REJECT_CANCEL_SUCCESS
})
export const rejectCancelErrorAction = error => ({
    type: OrdersActionTypes.REJECT_CANCEL_ERROR,
    payload: error
})
export const rejectCancel = params => async dispatch => {
    dispatch(rejectCancelAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/request-cancel/reject", params);
        if(res && res.status === 200) {
            dispatch(rejectCancelSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error)
        dispatch(rejectErrorAction(error))
    }
}
// save image
export const saveImageDesignAction = () => ({
    type: OrdersActionTypes.SAVE_IMAGE_DESIGN
})
export const saveImageDesignSuccessAction = () => ({
    type: OrdersActionTypes.SAVE_IMAGE_DESIGN_SUCCESS
})
export const saveImageDesignErrorAction = error => ({
    type: OrdersActionTypes.SAVE_IMAGE_DESIGN_ERROR,
    payload: error
})
export const saveImageDesign = value => async dispatch => {
    dispatch(saveImageDesignAction());
    try {
        const res = await Api.put("pgc-service/api/order/design", value);
        if (res && res.status === 200) {
            dispatch(saveImageDesignSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(saveImageDesignErrorAction(error.response.data.message))
    }
}
// export order
export const exportOrderAction = () => ({
    type: OrdersActionTypes.EXPORT_ORDER
})
export const exportOrderSuccessAction = () => ({
    type: OrdersActionTypes.EXPORT_ORDER_SUCCESS
})
export const exportOrderErrorAction = error => ({
    type: OrdersActionTypes.EXPORT_ORDER_ERROR,
    payload: error
})
export const exportOrder = (params, lineItemArr) => async dispatch => {
    dispatch(exportOrderAction());


    const url = getQueryUrl("pgc-service/api/order/admin/export", params)
    if(lineItemArr) {
        axios.post(decodeURIComponent(url), lineItemArr, { responseType: 'arraybuffer' })
            .then((response) => {
                var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let disposition = response.headers['content-disposition'];
                let fileName = disposition ? disposition.split("filename=")[1] : 'orders-export';
                fileSaver.saveAs(blob, fileName);
                dispatch(exportOrderSuccessAction())
    
            })
            .catch(err => {
                checkTokenExpired(err);
                dispatch(exportOrderErrorAction(err))
            })
    }
    else {
        axios.post(decodeURIComponent(url), [], { responseType: 'arraybuffer' })
        .then((response) => {
            var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let disposition = response.headers['content-disposition'];
            let fileName = disposition ? disposition.split("filename=")[1] : 'orders-export';
            fileSaver.saveAs(blob, fileName);
            dispatch(exportOrderSuccessAction())

        })
        .catch(err => {
            checkTokenExpired(err);
            dispatch(exportOrderErrorAction(err))
        })
    }
}
// IMPORT
export const importOrderAction = () => ({
    type: OrdersActionTypes.IMPORT_ORDER
})
export const importOrderSuccessAction = () => ({
    type: OrdersActionTypes.IMPORT_ORDER_SUCCESS
})
export const importOrderErrorAction = error => ({
    type: OrdersActionTypes.IMPORT_ORDER_SUCCESS,
    payload: error
})
export const importOrder = () => async dispatch => {
    dispatch(importOrderAction());
    try {

    } catch (error) {
        dispatch(importOrderErrorAction(error.response.data.message))
    }
}
// FETCH ONE ORDER
export const fetchOneOrderAction = () => {
    return {
        type: OrdersActionTypes.FETCH_ONE_ORDERS
    }
}
export const fetchOneOrderSuccessAction = order => {
    return {
        type: OrdersActionTypes.FETCH_ONE_ORDERS_SUCCESS,
        payload: order
    }
}
export const fetchOneOrderErrorAction = error => {
    return {
        type: OrdersActionTypes.FETCH_ONE_ORDERS_ERROR,
        payload: error
    }
}
export const fetchOneOrder = id => async dispatch => {
    dispatch(fetchOneOrderAction());
    try {
        // const url = getQueryUrl("pgc-service/api/order/admin/page", params);
        // const res = await axios.get(decodeURIComponent(url));

        const res = await Api.get("pgc-service/api/order/admin/" + id);
        if (res && res.status === 200) {
            const { data } = res;
            dispatch(fetchOneOrderSuccessAction(data));
            dispatch(fetchOneUser(data.sellerEmail))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchOneOrderErrorAction(error));
    }
}
// EDIT NOTE
// export const editNoteAction = () => {
//     return {
//         type: OrdersActionTypes.EDIT_NOTE
//     }
// }
// export const editNoteSuccessAction = notes => {
//     return {
//         type: OrdersActionTypes.EDIT_NOTE_SUCCESS,
//         payload: notes
//     }
// }
// export const editNoteErrorAction = error => {
//     return {
//         type: OrdersActionTypes.EDIT_NOTE_ERROR,
//         payload: error
//     }
// }
// export const doEditNote = body => async dispatch => {
//     dispatch(editNoteAction());
//     try {
//         const res = await Api.put("pgc-service/api/order/note", body);
//         if(res && res.status === 200) {
//             // const { data } = res;
//             dispatch(editNoteSuccessAction());
//         }
//     } catch (error) {
//         // checkTokenExpired(error);
//         dispatch(editNoteErrorAction(error));
//     }
// }
// EDIT SHIPPING
export const editShippingAction = () => {
    return {
        type: OrdersActionTypes.EDIT_SHIPPING
    }
}
export const editShippingSuccessAction = shippings => {
    return {
        type: OrdersActionTypes.EDIT_SHIPPING_SUCCESS,
        payload: shippings
    }
}
export const editShippingErrorAction = error => {
    return {
        type: OrdersActionTypes.EDIT_SHIPPING_ERROR,
        payload: error
    }
}
export const doEditShipping = body => async dispatch => {
    dispatch(editShippingAction());
    try {
        const res = await Api.put("pgc-service/api/order/shipping", body);
        if (res && res.status === 200) {
            // const { data } = res;
            dispatch(editShippingSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editShippingErrorAction(error));
    }
}
// FETCH ONE USER
export const fetchOneUserAction = () => {
    return {
        type: OrdersActionTypes.FETCH_ONE_USER
    }
}
export const fetchOneUserSuccessAction = user => {
    return {
        type: OrdersActionTypes.FETCH_ONE_USER_SUCCESS,
        payload: user
    }
}
export const fetchOneUserErrorAction = error => {
    return {
        type: OrdersActionTypes.FETCH_ONE_USER_ERROR,
        payload: error
    }
}
export const fetchOneUser = email => async dispatch => {
    dispatch(fetchOneUserAction());
    try {
        // const url = getQueryUrl("pgc-service/api/order/admin/page", params);
        // const res = await axios.get(decodeURIComponent(url));

        const res = await Api.get("pgc-service/api/user/admin/detail?email=" + email);
        if (res && res.status === 200) {
            const { data } = res;
            dispatch(fetchOneUserSuccessAction(data));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchOneUserErrorAction(error));
    }
}
// RESOLVE
export const resolveAction = () => ({
    type: OrdersActionTypes.RESOLVE
})
export const resolveSuccessAction = () => ({
    type: OrdersActionTypes.RESOLVE_SUCCESS
})
export const resolveErrorAction = error => ({
    type: OrdersActionTypes.RESOLVE_ERROR,
    payload: error
})
export const resolve = data => async dispatch => {
    dispatch(resolveAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/action-required/resolve", data);
        if (res && res.status === 200) {
            dispatch(resolveSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(resolveErrorAction(error))
    }
}
// Set action required
export const setActionRequiredAction = () => ({
    type: OrdersActionTypes.SET_ACTION_REQUIRED
})
export const setActionRequiredSuccessAction = () => ({
    type: OrdersActionTypes.SET_ACTION_REQUIRED_SUCCESS
})
export const setActionRequiredErrorAction = error => ({
    type: OrdersActionTypes.SET_ACTION_REQUIRED_ERROR,
    payload: error
})
export const setActionRequired = data => async dispatch => {
    dispatch(setActionRequiredAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/action-required", data);
        if (res && res.status === 200) {
            dispatch(setActionRequiredSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(setActionRequiredErrorAction(error))
    }
}
export const resolveOnHoldAction = () => ({
    type: OrdersActionTypes.RESOLVE_ON_HOLD
})
export const resolveOnHoldSuccessAction = () => ({
    type: OrdersActionTypes.RESOLVE_ON_HOLD_SUCCESS
})
export const resolveOnHoldErrorAction = error => ({
    type: OrdersActionTypes.RESOLVE_ON_HOLD_ERROR,
    payload: error
})
export const resolveOnHold = data => async dispatch => {
    dispatch(resolveOnHoldAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/on-hold/resolve", data);
        if (res && res.status === 200) {
            dispatch(resolveOnHoldSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(resolveOnHoldErrorAction(error))
    }
}
// GET ALL SUPPLIER
export const getAllSupplierAction = () => ({
    type: OrdersActionTypes.GET_ALL_SUPPLIER
})
export const getAllSupplierSuccessAction = data => ({
    type: OrdersActionTypes.GET_ALL_SUPPLIER_SUCCESS,
    payload: data
})
export const getAllSupplierErrorAction = error => ({
    type: OrdersActionTypes.GET_ALL_SUPPLIER_ERROR,
    payload: error
})
export const getAllSupplier = () => async dispatch => {
    dispatch(getAllSupplierAction());
    try {
        const res = await Api.get("pgc-service/api/user/supplier/list");
        if (res && res.status === 200) {
            dispatch(getAllSupplierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(getAllSupplierErrorAction(error))
    }
}
// REFUND
export const refundAction = () => ({
    type: OrdersActionTypes.REFUND
})
export const refundSuccessAction = data => ({
    type: OrdersActionTypes.REFUND_SUCCESS,
    payload: data
})
export const refundErrorAction = error => ({
    type: OrdersActionTypes.REFUND_ERROR,
    payload: error
})
export const refund = data => async dispatch => {
    dispatch(refundAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/refund", data);
        if (res && res.status === 200) {
            dispatch(refundSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(refundErrorAction(error))
    }
}
// RESEND
export const resendAction = () => ({
    type: OrdersActionTypes.RESEND
})
export const resendSuccessAction = data => ({
    type: OrdersActionTypes.RESEND_SUCCESS,
    payload: data
})
export const resendErrorAction = error => ({
    type: OrdersActionTypes.RESEND_ERROR,
    payload: error
})
export const resend = data => async dispatch => {
    dispatch(resendAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/duplicate", data);
        if (res && res.status === 200) {
            dispatch(resendSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(resendErrorAction(error))
    }
}
// CANCEL
export const cancelAction = () => ({
    type: OrdersActionTypes.CANCEL
})
export const cancelSuccessAction = data => ({
    type: OrdersActionTypes.CANCEL_SUCCESS,
    payload: data
})
export const cancelErrorAction = error => ({
    type: OrdersActionTypes.CANCEL_ERROR,
    payload: error
})
export const cancel = data => async dispatch => {
    dispatch(cancelAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/cancel", data);
        if (res && res.status === 200) {
            dispatch(cancelSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(cancelErrorAction(error))
    }
}
// ASSIGN SUPPLIER
export const assignSupplierAction = () => ({
    type: OrdersActionTypes.ASSIGN_SUPPLIER
})
export const assignSupplierSuccessAction = data => ({
    type: OrdersActionTypes.ASSIGN_SUPPLIER_SUCCESS,
    payload: data
})
export const assignSupplierErrorAction = error => ({
    type: OrdersActionTypes.ASSIGN_SUPPLIER_ERROR,
    payload: error
})
export const assignSupplier = data => async dispatch => {
    dispatch(assignSupplierAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/assign-supplier", data);
        if (res && res.status === 200) {
            dispatch(assignSupplierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(assignSupplierErrorAction(error))
    }
}
// ASSIGN CARRIE
export const assignCarrierAction = () => ({
    type: OrdersActionTypes.ASSIGN_CARRIER
})
export const assignCarrierSuccessAction = data => ({
    type: OrdersActionTypes.ASSIGN_CARRIER_SUCCESS,
    payload: data
})
export const assignCarrierErrorAction = error => ({
    type: OrdersActionTypes.ASSIGN_CARRIER_ERROR,
    payload: error
})
export const assignCarrier = data => async dispatch => {
    dispatch(assignCarrierAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/assign-carrier", data);
        if (res && res.status === 200) {
            dispatch(assignCarrierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(assignCarrierErrorAction(error))
    }
}
// Fetch statistic
export const fetchStatisticAction = () => ({
    type: OrdersActionTypes.FETCH_STATISTIC
})
export const fetchStatisticSuccessAction = data => ({
    type: OrdersActionTypes.FETCH_STATISTIC_SUCCESS,
    payload: data
})
export const fetchStatisticErrorAction = error => ({
    type: OrdersActionTypes.FETCH_STATISTIC_ERROR,
    payload: error
})
export const fetchStatistic = () => async dispatch => {
    dispatch(fetchStatisticAction());
    try {
        const res = await Api.get("pgc-service/api/order/admin/statistic");
        if (res && res.status === 200) {
            dispatch(fetchStatisticSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchStatisticErrorAction(error))
    }
}
export const getAssignSupplierAction = () => ({
    type: OrdersActionTypes.FETCH_SUPPLIER_WITH_PRODUCT_TYPE
})
export const getAssignSupplierSuccessAction = data => ({
    type: OrdersActionTypes.FETCH_SUPPLIER_WITH_PRODUCT_TYPE_SUCCESS,
    payload: data
})
export const getAssignSupplierErrorAction = error => ({
    type: OrdersActionTypes.FETCH_SUPPLIER_WITH_PRODUCT_TYPE_ERROR,
    payload: error
})
export const getAssignSupplier = id => async dispatch => {
    dispatch(getAssignSupplierAction());
    try {
        const res = await Api.get("pgc-service/api/user/supplier/assign?productTypeId=" + id);
        if (res && res.status === 200) {
            dispatch(getAssignSupplierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(getAssignSupplierErrorAction(error))
    }
}
export const addTrackingIdAction = () => ({
    type: OrdersActionTypes.ADD_TRACKING_ID
})
export const addTrackingIdSuccessAction = () => ({
    type: OrdersActionTypes.ADD_TRACKING_ID_SUCCESS,
})
export const addTrackingIdErrorAction = error => ({
    type: OrdersActionTypes.ADD_TRACKING_ID_ERROR,
    payload: error
})
export const addTrackingId = params => async dispatch => {
    dispatch(addTrackingIdAction());
    try {
        const res = await Api.put("pgc-service/api/order/admin/assign-tracking", params);
        if (res && res.status === 200) {
            dispatch(addTrackingIdSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(addTrackingIdErrorAction(error))
    }
}
export const exportErrorFileAction = () => ({
    type: OrdersActionTypes.EXPORT_ERROR_FILE
})
export const exportErrorFileSuccessAction = () => ({
    type: OrdersActionTypes.EXPORT_ERROR_FILE_SUCCESS,
})
export const exportErrorFileErrorAction = error => ({
    type: OrdersActionTypes.EXPORT_ERROR_FILE_ERROR,
    payload: error
})
export const exportErrorFile = params => async dispatch => {
    dispatch(exportErrorFileAction());
    // const url = getQueryUrl("pgc-service/api/order/import/error", params)
    Api.post("pgc-service/api/order/import/error", params, { responseType: 'arraybuffer' })
        .then((response) => {
            var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let disposition = response.headers['content-disposition'];
            let fileName = disposition ? disposition.split("filename=")[1] : 'orders-error-export';
            fileSaver.saveAs(blob, fileName);
            dispatch(exportErrorFileSuccessAction())

        })
        .catch(err => {
            checkTokenExpired(err);
            dispatch(exportErrorFileErrorAction(err))
        })
}
export const getAssignCarrierAction = () => ({
    type: OrdersActionTypes.FETCH_CARRIER_WITH_PRODUCT_TYPE
})
export const getAssignCarrierSuccessAction = data => ({
    type: OrdersActionTypes.FETCH_CARRIER_WITH_PRODUCT_TYPE_SUCCESS,
    payload: data
})
export const getAssignCarrierErrorAction = error => ({
    type: OrdersActionTypes.FETCH_CARRIER_WITH_PRODUCT_TYPE_ERROR,
    payload: error
})
export const getAssignCarrier = id => async dispatch => {
    dispatch(getAssignCarrierAction());
    try {
        const res = await Api.get("pgc-service/api/order/carrier/list?productTypeId=" + id);
        if (res && res.status === 200) {
            dispatch(getAssignCarrierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(getAssignCarrierErrorAction(error))
    }
}