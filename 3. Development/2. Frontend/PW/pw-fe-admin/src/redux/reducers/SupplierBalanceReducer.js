import { fromJS } from 'immutable';

import { SupplierBalanceActionTypes } from '../actionTypes'
const initialState = fromJS({
    listBalances: {
        balances: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false
    },
    overView: {
        loading: false,
        success: false,
        error: null,
        data: {}
    },
    exportLoading: false,
    exportSuccess: false,
    exportError: null

})

export const supplierBalances = (state = initialState, action) => {
    switch (action.type) {
        // fetch list
        case SupplierBalanceActionTypes.FETCH_ALL_BALANCE:
            return state.setIn(["listBalances","loading"], true)
                        .setIn(["listBalances", "success"], false)
                        .setIn(["listBalances", "error"], false)
        case SupplierBalanceActionTypes.FETCH_ALL_BALANCE_SUCCESS:
            return state.setIn(["listBalances","loading"], false)
                        .setIn(["listBalances","success"], true)
                        .setIn(["listBalances","totalElements"], action.payload.totalElements)
                        .setIn(["listBalances","balances"], action.payload.content)
        case SupplierBalanceActionTypes.FETCH_ALL_BALANCE_ERROR:
            return state.setIn(["listBalances", "loading"], false)
                        .setIn(["listBalances", "error"], action.payload)
        // fetch user balance
        case SupplierBalanceActionTypes.FETCH_OVERVIEW:
            return state.setIn(["overView", "loading"], true)
                        .setIn(["overView", "success"], false)
                        .setIn(["overView", "error"], false)
        case SupplierBalanceActionTypes.FETCH_OVERVIEW_SUCCESS:
            return state.setIn(["overView", "loading"], false)
                        .setIn(["overView", "success"], true)
                        .setIn(["overView", "data"], action.payload)
        case SupplierBalanceActionTypes.FETCH_OVERVIEW_ERROR:
            return state.setIn(["overView", "loading"], false)
                        .setIn(["overView", "error"], action.payload)
        case SupplierBalanceActionTypes.EXPORT:
            return state.setIn(["exportLoading"], true)
                        .setIn(["exportSuccess"], false)
                        .setIn(["exportError"], null)
        case SupplierBalanceActionTypes.EXPORT_SUCCESS:
            return state.setIn(["exportLoading"], false)
                        .setIn(["exportSuccess"], true)
        case SupplierBalanceActionTypes.EXPORT_ERROR:
            return state.setIn(["exportLoading"], false)
                        .setIn(["exportError"], action.payload)
        default:
            return state
    }
}
