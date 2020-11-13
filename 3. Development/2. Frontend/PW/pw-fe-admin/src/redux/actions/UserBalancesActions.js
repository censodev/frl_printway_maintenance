import { UserBalancesActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';
import * as fileSaver from 'file-saver';

// fetch list
export const fetchAllBalancesAction = () => {
    return {
        type: UserBalancesActionTypes.FETCH_ALL_BALANCE
    }
}
export const fetchAllBalancesSuccessAction = balances => {
    return {
        type: UserBalancesActionTypes.FETCH_ALL_BALANCE_SUCCESS,
        payload: balances
    }
}
export const fetchAllBalancesErrorAction = error => {
    return {
        type: UserBalancesActionTypes.FETCH_ALL_BALANCE_ERROR,
        payload: error
    }
}
export const doFetchAllBalances = params => async dispatch => {
    dispatch(fetchAllBalancesAction());
    try {
        const url = getQueryUrl("pgc-service/api/transaction/admin/page", params);
        const res = await axios.get(decodeURIComponent(url));
        const { data } = res;
        dispatch(fetchAllBalancesSuccessAction(data));
    } catch (error) {
        // checkTokenExpired(error);
        dispatch(fetchAllBalancesErrorAction(error));
    }
}

// fetch user balance
export const fetchUserBalancesAction = () => {
    return {
        type: UserBalancesActionTypes.FETCH_USER_BALANCE
    }
}
export const fetchUserBalancesSuccessAction = data => {
    return {
        type: UserBalancesActionTypes.FETCH_USER_BALANCE_SUCCESS,
        payload: data
    }
}
export const fetchUserBalancesErrorAction = error => {
    return {
        type: UserBalancesActionTypes.FETCH_USER_BALANCE_ERROR,
        payload: error
    }
}
export const doFetchUserBalance = (sellerId) => async dispatch => {
    dispatch(fetchUserBalancesAction());
    try {
        const res = await Api.get(`pgc-service/api/user-balance/admin/overview${sellerId ? "?sellerId=" + sellerId : ""}`);
        if (res && res.status === 200) {
            const { data } = res;
            dispatch(fetchUserBalancesSuccessAction(data));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchUserBalancesErrorAction(error.response.data.message))
    }
}

// approve user balance
export const approveAction = () => {
    return {
        type: UserBalancesActionTypes.APPROVE
    }
}
export const approveSuccessAction = () => {
    return {
        type: UserBalancesActionTypes.APPROVE_SUCCESS,
    }
}
export const approveErrorAction = error => {
    return {
        type: UserBalancesActionTypes.FETCH_USER_BALANCE_ERROR,
        payload: error
    }
}
export const approve = id => async dispatch => {
    dispatch(approveAction());
    try {
        const res = await Api.get("pgc-service/api/transaction/admin/deposit/approve/" + id);
        if (res && res.status === 200) {
            dispatch(approveSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(approveErrorAction(error.response.data.message))
    }
}
// reject user balance
export const rejectAction = () => {
    return {
        type: UserBalancesActionTypes.REJECT
    }
}
export const rejectSuccessAction = () => {
    return {
        type: UserBalancesActionTypes.REJECT_SUCCESS,
    }
}
export const rejectErrorAction = error => {
    return {
        type: UserBalancesActionTypes.REJECT_ERROR,
        payload: error
    }
}
export const reject = (obj) => async dispatch => {
    dispatch(rejectAction());
    try {
        const res = await Api.post("pgc-service/api/transaction/admin/deposit/reject" , obj);
        if (res && res.status === 200) {
            dispatch(rejectSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(rejectErrorAction(error.response.data.message))
    }
}
export const customTransactionAction = () => ({
    type: UserBalancesActionTypes.CUSTOM_TRANSACTION
})
export const customTransactionSuccessAction = () => ({
    type: UserBalancesActionTypes.CUSTOM_TRANSACTION_SUCCESS
})
export const customTransactionErrorAction = err => ({
    type: UserBalancesActionTypes.CUSTOM_TRANSACTION_ERROR,
    payload: err
})
export const customTransaction = params => async dispatch => {
    dispatch(customTransactionAction());
    try {
        const res = await Api.post("pgc-service/api/transaction/admin/custom", params);
        if(res && res.status === 200) {
            dispatch(customTransactionSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(customTransactionErrorAction(error))
    }
}
export const exportAction = () => ({
    type: UserBalancesActionTypes.EXPORT
})
export const exportSuccessAction = () => ({
    type: UserBalancesActionTypes.EXPORT_SUCCESS
})
export const exportErrorAction = error => ({
    type: UserBalancesActionTypes.EXPORT_ERROR,
    payload: error
})
export const exportOrder = (params) => async dispatch => {
    dispatch(exportAction());
    const url = getQueryUrl("pgc-service/api/transaction/admin/export", params)
    axios.get(decodeURIComponent(url), { responseType: 'arraybuffer' })
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