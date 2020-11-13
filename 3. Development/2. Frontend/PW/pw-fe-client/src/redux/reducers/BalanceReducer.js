import { fromJS } from 'immutable';

import { BalanceActionTypes } from '../actionTypes'

const initialState = fromJS({
    listBalances: {
        balances: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false
    },
    sellerBalance: {
        loading: false,
        success: false,
        error: null,
        data: {}
    },
    createDeposit: false,
    createDepositSuccess: false,
    createDepositError: null,

    updateDeposit: false,
    updateDepositSuccess: false,
    updateDepositError: null,

    delete: false,
    deleteSuccess: false,
    deleteError: null

})

export const balance = (state = initialState, action) => {
    switch (action.type) {
        // fetch list
        case BalanceActionTypes.FETCH_ALL_BALANCE:
            return state.setIn(["listBalances","loading"], true)
                        .setIn(["listBalances", "success"], false)
                        .setIn(["listBalances", "error"], false)
        case BalanceActionTypes.FETCH_ALL_BALANCE_SUCCESS:
            return state.setIn(["listBalances","loading"], false)
                        .setIn(["listBalances","success"], true)
                        .setIn(["listBalances","totalElements"], action.payload.totalElements)
                        .setIn(["listBalances","balances"], action.payload.content)
        case BalanceActionTypes.FETCH_ALL_BALANCE_ERROR:
            return state.setIn(["listBalances", "loading"], false)
                        .setIn(["listBalances", "error"], action.payload)
        // fetch seller balance
        case BalanceActionTypes.FETCH_SELLER_BALANCE:
            return state.setIn(["sellerBalance", "loading"], true)
                        .setIn(["sellerBalance", "success"], false)
                        .setIn(["sellerBalance", "error"], null)
        case BalanceActionTypes.FETCH_SELLER_BALANCE_SUCCESS:
            return state.setIn(["sellerBalance", "loading"], false)
                        .setIn(["sellerBalance", "success"], true)
                        .setIn(["sellerBalance", "data"], action.payload)
        case BalanceActionTypes.FETCH_SELLER_BALANCE_ERROR:
            return state.setIn(["sellerBalance", "loading"], false)
                        .setIn(["sellerBalance", "error"], action.payload)
        // create deposit
        case BalanceActionTypes.CREATE_DEPOSIT:
            return state.setIn(["createDeposit"], true)
                        .setIn(["createDepositSuccess"], false)
                        .setIn(["createDepositError"], false)
        case BalanceActionTypes.CREATE_DEPOSIT_SUCCESS:
            return state.setIn(["createDeposit"], false)
                        .setIn(["createDepositSuccess"], true)
        case BalanceActionTypes.CREATE_DEPOSIT_ERROR:
            return state.setIn(["createDeposit"], false)
                        .setIn(["createDepositError"], action.payload)
        // update deposit
        case BalanceActionTypes.UPDATE_DEPOSIT:
            return state.setIn(["updateDeposit"], true)
                        .setIn(["updateDepositSuccess"], false)
                        .setIn(["updateDepositError"], false)
        case BalanceActionTypes.UPDATE_DEPOSIT_SUCCESS:
            return state.setIn(["updateDeposit"], false)
                        .setIn(["updateDepositSuccess"], true)
        case BalanceActionTypes.UPDATE_DEPOSIT_ERROR:
            return state.setIn(["updateDeposit"], false)
                        .setIn(["updateDepositError"], action.payload)
        // delete deposit
        case BalanceActionTypes.DELETE_DEPOSIT:
            return state.setIn(["delete"], true)
                        .setIn(["deleteSuccess"], false)
                        .setIn(["deleteError"], false)
        case BalanceActionTypes.DELETE_DEPOSIT_SUCCESS:
            return state.setIn(["delete"], false)
                        .setIn(["deleteSuccess"], true)
        case BalanceActionTypes.DELETE_DEPOSIT_ERROR:
            return state.setIn(["delete"], false)
                        .setIn(["deleteError"], action.payload)
        // reset error
        case BalanceActionTypes.RESET_ERROR:
            return state.setIn(["createDepositError"], null)
                        .setIn(["updateDepositError"], null)
        default:
            return state
    }
}
