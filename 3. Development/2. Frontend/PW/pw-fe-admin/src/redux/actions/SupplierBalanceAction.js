import { SupplierBalanceActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';
import * as fileSaver from 'file-saver';


// fetch list
export const fetchAllBalancesAction = () => {
    return {
        type: SupplierBalanceActionTypes.FETCH_ALL_BALANCE
    }
}
export const fetchAllBalancesSuccessAction = balances => {
    return {
        type: SupplierBalanceActionTypes.FETCH_ALL_BALANCE_SUCCESS,
        payload: balances
    }
}
export const fetchAllBalancesErrorAction = error => {
    return {
        type: SupplierBalanceActionTypes.FETCH_ALL_BALANCE_ERROR,
        payload: error
    }
}
export const fetchAllBalances = params => async dispatch => {
    dispatch(fetchAllBalancesAction());
    try {
        const url = getQueryUrl("pgc-service/api/transaction/admin/supplier/page", params);
        const res = await axios.get(decodeURIComponent(url));
        const { data } = res;
        dispatch(fetchAllBalancesSuccessAction(data));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllBalancesErrorAction(error.response.data.message));
    }
}

// fetch user balance
export const fetchOverviewAction = () => {
    return {
        type: SupplierBalanceActionTypes.FETCH_OVERVIEW
    }
}
export const fetchOverviewSuccessAction = data => {
    return {
        type: SupplierBalanceActionTypes.FETCH_OVERVIEW_SUCCESS,
        payload: data
    }
}
export const fetchOverviewErrorAction = error => {
    return {
        type: SupplierBalanceActionTypes.FETCH_OVERVIEW_ERROR,
        payload: error
    }
}
export const fetchOverview = params => async dispatch => {
    dispatch(fetchOverviewAction());
    try {
        const url = getQueryUrl("pgc-service/api/user-balance/admin/supplier/overview", params);
        const res = await axios.get(decodeURIComponent(url));
        const { data } = res;
        dispatch(fetchOverviewSuccessAction(data));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchOverviewErrorAction(error.response.data.message))
    }
}
export const exportAction = () => ({
    type: SupplierBalanceActionTypes.EXPORT
})
export const exportSuccessAction = () => ({
    type: SupplierBalanceActionTypes.EXPORT_SUCCESS
})
export const exportErrorAction = error => ({
    type: SupplierBalanceActionTypes.EXPORT_ERROR,
    payload: error
})
export const exportOrder = () => async dispatch => {
    dispatch(exportAction());
    Api.get("pgc-service/api/transaction/admin/supplier/export", { responseType: 'arraybuffer' })
        .then((response) => {
            var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let disposition = response.headers['content-disposition'];
            let fileName = disposition ? disposition.split("filename=")[1] : 'orders-export';
            fileSaver.saveAs(blob, fileName);
            dispatch(exportSuccessAction())
        })
        .catch(err => {
            checkTokenExpired(err);
            dispatch(exportErrorAction(err))
        })
}