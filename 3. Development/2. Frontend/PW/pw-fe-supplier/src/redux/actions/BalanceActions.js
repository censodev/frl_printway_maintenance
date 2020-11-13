import { BalanceActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';


// fetch list
export const fetchAllBalancesAction = () => {
    return {
        type: BalanceActionTypes.FETCH_ALL_BALANCE
    }
}
export const fetchAllBalancesSuccessAction = balances => {
    return {
        type: BalanceActionTypes.FETCH_ALL_BALANCE_SUCCESS,
        payload: balances
    }
}
export const fetchAllBalancesErrorAction = error => {
    return {
        type: BalanceActionTypes.FETCH_ALL_BALANCE_ERROR,
        payload: error
    }
}
export const fetchAllBalances = params => async dispatch => {
    dispatch(fetchAllBalancesAction());
    try {
        const url = getQueryUrl("pgc-service/api/transaction/supplier/page", params);
        const res = await axios.get(decodeURIComponent(url));
        const { data } = res;
        dispatch(fetchAllBalancesSuccessAction(data));
    } catch (error) {
        // checkTokenExpired(error);
        dispatch(fetchAllBalancesErrorAction(error));
    }
}

// fetch Seller balance
export const fetchOverviewAction = () => {
    return {
        type: BalanceActionTypes.FETCH_OVERVIEW
    }
}
export const fetchOverviewSuccessAction = data => {
    return {
        type: BalanceActionTypes.FETCH_OVERVIEW_SUCCESS,
        payload: data
    }
}
export const fetchOverviewErrorAction = error => {
    return {
        type: BalanceActionTypes.FETCH_OVERVIEW_ERROR,
        payload: error
    }
}
export const fetchOverview = () => async dispatch => {
    dispatch(fetchOverviewAction());
    try {
        const res = await Api.get("pgc-service/api/user-balance");
        if (res && res.status === 200) {
            const { data } = res;

            dispatch(fetchOverviewSuccessAction(data));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchOverviewErrorAction(error.response.data.message))
    }
}
// CREATE DEPOSIT
export const createDepositAction = () => ({
    type: BalanceActionTypes.CREATE_DEPOSIT
})
export const createDepositSuccessAction = () => ({
    type: BalanceActionTypes.CREATE_DEPOSIT_SUCCESS
})
export const createDepositErrorAction = error => ({
    type: BalanceActionTypes.CREATE_DEPOSIT_ERROR,
    payload: error
})
export const doCreateDeposit = params => async dispatch => {
    dispatch(createDepositAction());
    try {
        const res = await Api.post("pgc-service/api/transaction/deposit", params);
        if(res && res.status === 200) {
            dispatch(createDepositSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createDepositErrorAction(error.response.data.message))
    }
}
// update deposit
export const updateDepositAction = () => ({
    type: BalanceActionTypes.UPDATE_DEPOSIT
})
export const updateDepositSuccessAction = () => ({
    type: BalanceActionTypes.UPDATE_DEPOSIT_SUCCESS
})
export const updateDepositErrorAction = error => ({
    type: BalanceActionTypes.UPDATE_DEPOSIT_ERROR,
    payload: error
})
export const doUpdateDeposit = params => async dispatch => {
    dispatch(updateDepositAction());
    try {
        const res = await Api.put("pgc-service/api/transaction/deposit", params);
        if(res && res.status === 200) {
            dispatch(updateDepositSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(updateDepositErrorAction(error.response.data.message))
    }
}
// delete deposit 
export const deleteDepositAction = () => ({
    type: BalanceActionTypes.DELETE_DEPOSIT
})
export const deleteDepositSuccessAction = () => ({
    type: BalanceActionTypes.DELETE_DEPOSIT_SUCCESS
})
export const deleteDepositErrorAction = error => ({
    type: BalanceActionTypes.DELETE_DEPOSIT_ERROR,
    payload: error
})
export const doDeleteDeposit = id => async dispatch => {
    dispatch(deleteDepositAction());
    try {
        const res = await Api.delete("pgc-service/api/transaction/" + id);
        if(res && res.status === 200) {
            dispatch(deleteDepositSuccessAction())
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteDepositErrorAction(error.response.data.message))
    }
}


export const resetError = () => ({
    type: BalanceActionTypes.RESET_ERROR
})