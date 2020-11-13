import { fromJS } from 'immutable';

import { OrdersActionTypes } from '../actionTypes'

const initialState = fromJS({
    listOrders: {
        orders: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false
    },
    doSaveImageDesign: false,
    saveImageDesignSuccess: false,
    saveImageDesignError: null,

    doExport: false,
    exportSuccess: false,
    exportError: null,

    doImport: false,
    importSuccess: false,
    importError: null,

    oneUser : {
        user: {},
        loading: false,
        success: false,
        error: null
    },

    cancelLoading: false,
    cancelSuccess: false,
    cancelError: null,

    listStatistic: {
        statistic: null,
        loading: false,
        success: false,
        error: null
    },

    reportLoading: false,
    reportSuccess: false,
    reportError: null
})

export const orders = (state = initialState, action) => {
    switch (action.type) {
        // fetch list
        case OrdersActionTypes.FETCH_ALL_ORDERS:
            return state.setIn(["listOrders", "loading"], true)
                        .setIn(["listOrders", "success"], false)
                        .setIn(["listOrders", "error"], null)
        case OrdersActionTypes.FETCH_ALL_ORDERS_SUCCESS:
            return state.setIn(["listOrders", "loading"], false)
                        .setIn(["listOrders", "success"], true)
                        .setIn(["listOrders", "totalElements"], action.payload.totalElements)
                        .setIn(["listOrders", "orders"], action.payload.content)
        case OrdersActionTypes.FETCH_ALL_ORDERS_ERROR:
            return state.setIn(["listOrders", "loading"], false)
                        .setIn(["listOrders", "error"], action.payload)
        // save image
        case OrdersActionTypes.SAVE_IMAGE_DESIGN:
            return state.setIn(["doSaveImageDesign"], true)
                        .setIn(["saveImageDesignSuccess"], false)
                        .setIn(["saveImageDesignError"], null)
        case OrdersActionTypes.SAVE_IMAGE_DESIGN_SUCCESS:
            return state.setIn(["doSaveImageDesign"], false)
                        .setIn(["saveImageDesignSuccess"], true)
        case OrdersActionTypes.SAVE_IMAGE_DESIGN_ERROR:
            return state.setIn(["doSaveImageDesign"], false)
                        .setIn(["saveImageDesignError"], action.payload)
        // export
        case OrdersActionTypes.EXPORT_ORDER:
            return state.setIn(["doExport"], true)
                        .setIn(["exportSuccess"], false)
                        .setIn(["exportError"], null)
        case OrdersActionTypes.EXPORT_ORDER_SUCCESS:
            return state.setIn(["doExport"], false)
                        .setIn(["exportSuccess"], true)
        case OrdersActionTypes.EXPORT_ORDER_ERROR:
            return state.setIn(["doExport"], false)
                        .setIn(["exportError"], action.payload)
        // export
        case OrdersActionTypes.IMPORT_ORDER:
            return state.setIn(["import"], true)
                        .setIn(["importSuccess"], false)
                        .setIn(["importError"], null)
        case OrdersActionTypes.IMPORT_ORDER_SUCCESS:
            return state.setIn(["import"], false)
                        .setIn(["importSuccess"], true)
        case OrdersActionTypes.IMPORT_ORDER_ERROR:
            return state.setIn(["import"], false)
                        .setIn(["importError"])
        case OrdersActionTypes.CANCEL:
            return state.setIn(["cancelLoading"], true)
                        .setIn(["cancelSuccess"], false)
                        .setIn(["cancelError"], null)
        case OrdersActionTypes.CANCEL_SUCCESS:
            return state.setIn(["cancelLoading"], false)
                        .setIn(["cancelSuccess"], true)
        case OrdersActionTypes.CANCEL_ERROR:
            return state.setIn(["cancelLoading"], false)
                        .setIn(["cancelError"], action.payload)
        case OrdersActionTypes.FETCH_STATISTIC:
            return state.setIn(["listStatistic", "loading"], true)
                        .setIn(["listStatistic", "success"], false)
                        .setIn(["listStatistic", "error"], null)
        case OrdersActionTypes.FETCH_STATISTIC_SUCCESS:
            return state.setIn(["listStatistic", "loading"], false)
                        .setIn(["listStatistic", "success"], true)
                        .setIn(["listStatistic", "statistic"], action.payload)
        case OrdersActionTypes.FETCH_STATISTIC_ERROR:
            return state.setIn(["listStatistic", "loading"], false)
                        .setIn(["listStatistic", "error"], action.payload)
        case OrdersActionTypes.REPORT:
            return state.setIn(["reportLoading"], true)
                        .setIn(["reportSuccess"], false)
                        .setIn(["reportError"], null)
        case OrdersActionTypes.REPORT_SUCCESS:
            return state.setIn(["reportLoading"], false)
                        .setIn(["reportSuccess"], true)
        case OrdersActionTypes.REPORT_ERROR:
            return state.setIn(["reportLoading"], false)
                        .setIn(["reportError"], action.payload)
        default:
            return state
    }
}
