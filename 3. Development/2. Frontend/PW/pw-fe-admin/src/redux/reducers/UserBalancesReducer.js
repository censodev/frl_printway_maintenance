import { fromJS } from 'immutable';

import { UserBalancesActionTypes } from '../actionTypes'
import UserBalances from '../../views/UserBalances/UserBalances';
const initialState = fromJS({
    listBalances: {
        balances: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false
    },
    userBalance: {
        loading: false,
        success: false,
        error: null,
        data: {}
    },
    approve: false,
    approveSuccess: false,
    approveError: null,

    reject: false,
    rejectSuccess: false,
    rejectError: null,

    customTransactionLoading: false,
    customTransactionSuccess: false,
    customTransactionError: null,

    exportLoading: false,
    exportSuccess: false,
    exportError: null
})

export const userBalances = (state = initialState, action) => {
    switch (action.type) {
        // fetch list
        case UserBalancesActionTypes.FETCH_ALL_BALANCE:
            return state.setIn(["listBalances","loading"], true)
                        .setIn(["listBalances", "success"], false)
                        .setIn(["listBalances", "error"], false)
        case UserBalancesActionTypes.FETCH_ALL_BALANCE_SUCCESS:
            return state.setIn(["listBalances","loading"], false)
                        .setIn(["listBalances","success"], true)
                        .setIn(["listBalances","totalElements"], action.payload.totalElements)
                        .setIn(["listBalances","balances"], action.payload.content)
        case UserBalancesActionTypes.FETCH_ALL_BALANCE_ERROR:
            return state.setIn(["listBalances", "loading"], false)
                        .setIn(["listBalances", "error"], action.payload)
        // fetch user balance
        case UserBalancesActionTypes.FETCH_USER_BALANCE:
            return state.setIn(["userBalance", "loading"], true)
                        .setIn(["userBalance", "success"], false)
                        .setIn(["userBalance", "error"], false)
        case UserBalancesActionTypes.FETCH_USER_BALANCE_SUCCESS:
            return state.setIn(["userBalance", "loading"], false)
                        .setIn(["userBalance", "success"], true)
                        .setIn(["userBalance", "data"], action.payload)
        case UserBalancesActionTypes.FETCH_USER_BALANCE_ERROR:
            return state.setIn(["userBalance", "loading"], false)
                        .setIn(["userBalance", "error"], action.payload)
        // approve user balance
        case UserBalancesActionTypes.APPROVE:
            return state.setIn(["approve"], true)
                        .setIn(["approveSuccess"], false)
                        .setIn(["approveError"], false)
        case UserBalancesActionTypes.APPROVE_SUCCESS:
            return state.setIn(["approve"], false)
                        .setIn(["approveSuccess"], true)
        case UserBalancesActionTypes.APPROVE_ERROR:
            return state.setIn(["approve"], false)
                        .setIn(["approveError"], action.payload)
        // reject user balance
        case UserBalancesActionTypes.REJECT:
            return state.setIn(["reject"], true)
                        .setIn(["rejectSuccess"], false)
                        .setIn(["rejectError"], false)
        case UserBalancesActionTypes.REJECT_SUCCESS:
            return state.setIn(["reject"], false)
                        .setIn(["rejectSuccess"], true)
        case UserBalancesActionTypes.REJECT_ERROR:
            return state.setIn(["reject"], false)
                        .setIn(["rejectError"], action.payload)
        case UserBalancesActionTypes.CUSTOM_TRANSACTION:
            return state.setIn(["customTransactionLoading"], true)
                        .setIn(["customTransactionSuccess"], false)
                        .setIn(["customTransactionError"], null)
        case UserBalancesActionTypes.CUSTOM_TRANSACTION_SUCCESS:
            return state.setIn(["customTransactionLoading"], false)
                        .setIn(["customTransactionSuccess"], true)
        case UserBalancesActionTypes.CUSTOM_TRANSACTION_ERROR:
            return state.setIn(["customTransactionLoading"], false)
                        .setIn(["customTransactionError"], action.payload)
        case UserBalancesActionTypes.EXPORT:
            return state.setIn(["exportLoading"], true)
                        .setIn(["exportSuccess"], false)
                        .setIn(["exportError"], null)
        case UserBalancesActionTypes.EXPORT_SUCCESS:
            return state.setIn(["exportLoading"], false)
                        .setIn(["exportSuccess"], true)
        case UserBalancesActionTypes.EXPORT_ERROR:
            return state.setIn(["exportLoading"], false)
                        .setIn(["exportError"], action.payload)
        default:
            return state
    }
}
