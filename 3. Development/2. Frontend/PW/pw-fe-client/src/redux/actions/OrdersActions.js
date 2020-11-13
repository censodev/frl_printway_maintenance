import * as fileSaver from 'file-saver';
import { OrdersActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';
import * as _ from 'lodash';

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
        const url = getQueryUrl("pgc-service/api/order/page", params);
        const res = await axios.get(decodeURIComponent(url));

        // const res = await axios.get("https://api.mocki.io/v1/6cbe5f6f");
        const { data } = res;
        dispatch(fetchAllOrderSuccessAction(data));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllOrderErrorAction(error));
    }
}
// accept order
export const acceptAction = () => ({
    type: OrdersActionTypes.ACCEPT_ORDERS
})
export const acceptSuccessAction = () => ({
    type: OrdersActionTypes.ACCEPT_ORDERS_SUCCESS
})
export const acceptErrorAction = error => ({
    type: OrdersActionTypes.ACCEPT_ORDERS_ERROR,
    payload: error
})
export const accept = () => async dispatch => {
    dispatch(acceptAction());
    try {

    } catch (error) {

    }
}
// not accept order
export const notAcceptAction = () => ({
    type: OrdersActionTypes.NOT_ACCEPT_ORDERS
})
export const notAcceptSuccessAction = () => ({
    type: OrdersActionTypes.NOT_ACCEPT_ORDERS_SUCCESS
})
export const notAcceptErrorAction = error => ({
    type: OrdersActionTypes.NOT_ACCEPT_ORDERS_ERROR,
    payload: error
})
export const notAccept = () => dispatch => {
    dispatch(acceptAction());
    try {

    } catch (error) {

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
export const exportOrder = (params, arr) => async dispatch => {
    dispatch(exportOrderAction());
        const url = getQueryUrl("pgc-service/api/order/export", params)
        if(arr) {
            axios.post(decodeURIComponent(url), arr, { responseType: 'arraybuffer' })
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

        const res = await Api.get("pgc-service/api/order/" + id);
        if(res && res.status === 200) {
            const { data } = res;
            dispatch(fetchOneOrderSuccessAction(data));
            // dispatch(fetchOneUser(data.sellerEmail))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchOneOrderErrorAction(error));
    }
}
// EDIT NOTE
export const editNoteAction = () => {
    return {
        type: OrdersActionTypes.EDIT_NOTE
    }
}
export const editNoteSuccessAction = notes => {
    return {
        type: OrdersActionTypes.EDIT_NOTE_SUCCESS,
        payload: notes
    }
}
export const editNoteErrorAction = error => {
    return {
        type: OrdersActionTypes.EDIT_NOTE_ERROR,
        payload: error
    }
}
export const doEditNote = body => async dispatch => {
    dispatch(editNoteAction());
    try {
        const res = await Api.put("pgc-service/api/order/note", body);
        if(res && res.status === 200) {
            // const { data } = res;
            dispatch(editNoteSuccessAction());
        }
    } catch (error) {
        // checkTokenExpired(error);
        dispatch(editNoteErrorAction(error));
    }
}
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
        if(res && res.status === 200) {
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

        const res = await Api.get("pgc-service/api/user/detail?email=" + email);
        if(res && res.status === 200) {
            const { data } = res;
            dispatch(fetchOneUserSuccessAction(data));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchOneUserErrorAction(error));
    }
}
// RESOLVE
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
        const res = await Api.put("pgc-service/api/order/on-hold/resolve",data);
        if(res && res.status === 200) {
            dispatch(resolveOnHoldSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(resolveOnHoldErrorAction(error))
    }
}
// Set on hold
export const onHoldAction = () => ({
    type: OrdersActionTypes.ON_HOLD
})
export const onHoldSuccessAction = () => ({
    type: OrdersActionTypes.ON_HOLD_SUCCESS
})
export const onHoldErrorAction = error => ({
    type: OrdersActionTypes.ON_HOLD_ERROR,
    payload: error
})
export const onHold = data => async dispatch => {
    dispatch(onHoldAction());
    try {
        const res = await Api.put("pgc-service/api/order/on-hold",data);
        if(res && res.status === 200) {
            dispatch(onHoldSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(onHoldErrorAction(error))
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
        if(res && res.status === 200) {
            dispatch(getAllSupplierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(getAllSupplierErrorAction(error))
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
        const res = await Api.put("pgc-service/api/order/duplicate", data);
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
        const res = await Api.put("pgc-service/api/order/cancel", data);
        if (res && res.status === 200) {
            dispatch(cancelSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(cancelErrorAction(error))
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
        const res = await Api.get("pgc-service/api/order/statistic");
        if (res && res.status === 200) {
            dispatch(fetchStatisticSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchStatisticErrorAction(error))
    }
}
// asign carrier
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
        const res = await Api.put("pgc-service/api/order/assign-carrier", data);
        if (res && res.status === 200) {
            dispatch(assignCarrierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(assignCarrierErrorAction(error))
    }
}
// list carrier
const fetchAllCarriesNoPagingAction = () => ({
    type: OrdersActionTypes.DO_FETCH_ALL_CARRIERS_NO_PAGING,
});

const fetchAllCarriesNoPagingSuccessAction = (carriers) => ({
    type: OrdersActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_SUCCESS,
    payload: carriers,
});

const fetchAllCarriesNoPagingErrorAction = (error) => ({
    type: OrdersActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_ERROR,
    payload: error,
});
export const fetchAllCarriesNoPaging = () => async (dispatch) => {
    dispatch(fetchAllCarriesNoPagingAction());
    try {
        const response = await Api.get(`pgc-service/api/carrier/list`);
        const result = _.get(response, 'data');
        dispatch(fetchAllCarriesNoPagingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllCarriesNoPagingErrorAction(error.response.data.message));
    }
};
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
        const res = await Api.get("pgc-service/api/carrier/list/assign?productTypeId=" + id);
        if (res && res.status === 200) {
            dispatch(getAssignCarrierSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(getAssignCarrierErrorAction(error))
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