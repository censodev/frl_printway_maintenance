import * as fileSaver from 'file-saver';
import { OrdersActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';

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
        const url = getQueryUrl("pgc-service/api/order/supplier/page", params);
        const res = await axios.get(decodeURIComponent(url));

        // const res = await axios.get("https://api.mocki.io/v1/6cbe5f6f");
        const { data } = res;
        dispatch(fetchAllOrderSuccessAction(data));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllOrderErrorAction(error));
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
    // const url = getQueryUrl("pgc-service/api/order/supplier/export", params)
    // axios.post("pgc-service/api/order/supplier/export?isAll=" + isAll, params, { responseType: 'arraybuffer' })
    const url = getQueryUrl("pgc-service/api/order/supplier/export", params)
    Api.post(decodeURIComponent(url), arr, { responseType: 'arraybuffer' })
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
        const res = await Api.put("pgc-service/api/order/supplier/cancel", data);
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
        const res = await Api.get("pgc-service/api/order/supplier/statistic");
        if (res && res.status === 200) {
            dispatch(fetchStatisticSuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchStatisticErrorAction(error))
    }
}
// report error 
export const reportAction = () => ({
    type: OrdersActionTypes.REPORT
})
export const reportSuccesAction = () => ({
    type: OrdersActionTypes.REPORT_SUCCESS
})
export const reportErrorAction = err => ({
    type: OrdersActionTypes.REPORT,
    payload: err
})
export const report = params => async dispatch => {
    dispatch(reportAction());
    try {
        const res = await Api.put("", params);
        if (res && res.status === 200) {
            dispatch(reportSuccesAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(reportErrorAction(error))
    }
}