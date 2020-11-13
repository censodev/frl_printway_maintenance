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

    oneOrder: {
        order: {},
        loading: false,
        success: false,
        error: null
    },

    editNote: false,
    editNoteSuccess: false,
    editNoteError: null,

    editShipping: false,
    editShippingSuccess: false,
    editShippingError: null,

    oneUser : {
        user: {},
        loading: false,
        success: false,
        error: null
    },
    resolveOnHoldLoading: false,
    resolveOnHoldSuccess: false,
    resolveOnHoldError: null,

    onHoldLoading: false,
    onHoldSuccess: false,
    onHoldError: null,

    resendLoading: false,
    resendSuccess: false,
    resendError: null,

    cancelLoading: false,
    cancelSuccess: false,
    cancelError: null,

    listSuppliers: {
        suppliers: [],
        loading: false,
        success: false,
        error: null
    },
    listStatistic: {
        statistic: null,
        loading: false,
        success: false,
        error: null
    },

    assignCarrierLoading: false,
    assignCarrierSuccess: false,
    assignCarrierError: null,

    listCarriesNoPaging: {
        carries: [],
        error: null,
        loading: false,
    },
    carriersAssign: {
        listCarriersAssign : [],
        loading: false,
        success: false,
        error: null
    },
    exportErrorFileLoading: false,
    exportErrorFileSuccess: false,
    exportErrorFileError: null,
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
        // one order
        case OrdersActionTypes.FETCH_ONE_ORDERS:
            return state.setIn(["oneOrder", "loading"], true)
                        .setIn(["oneOrder", "success"], false)
                        .setIn(["oneOrder", "error"], null)
        case OrdersActionTypes.FETCH_ONE_ORDERS_SUCCESS:
            return state.setIn(["oneOrder", "loading"], false)
                        .setIn(["oneOrder", "success"], true)
                        .setIn(["oneOrder", "order"], action.payload)
        case OrdersActionTypes.FETCH_ONE_ORDERS_ERROR:
            return state.setIn(["oneOrder", "loading"], false)
                        .setIn(["oneOrder", "error"], action.payload)
        // edit note
        case OrdersActionTypes.EDIT_NOTE:
            return state.setIn(["editNote"], true)
                        .setIn(["editNoteSuccess"], false)
                        .setIn(["editNoteError"], null)
        case OrdersActionTypes.EDIT_NOTE_SUCCESS:
            return state.setIn(["editNote"], false)
                        .setIn(["editNoteSuccess"], true)
        case OrdersActionTypes.EDIT_NOTE_ERROR:
            return state.setIn(["editNote"], false)
                        .setIn(["editNoteError"], action.payload)
        // edit shipping
        case OrdersActionTypes.EDIT_SHIPPING:
            return state.setIn(["editShipping"], true)
                        .setIn(["editShippingSuccess"], false)
                        .setIn(["editShippingError"], null)
        case OrdersActionTypes.EDIT_SHIPPING_SUCCESS:
            return state.setIn(["editShipping"], false)
                        .setIn(["editShippingSuccess"], true)
        case OrdersActionTypes.EDIT_SHIPPING_ERROR:
            return state.setIn(["editShipping"], false)
                        .setIn(["editShippingError"], action.payload)
                // one order
        case OrdersActionTypes.FETCH_ONE_USER:
            return state.setIn(["oneUser", "loading"], true)
                        .setIn(["oneUser", "success"], false)
                        .setIn(["oneUser", "error"], null)
        case OrdersActionTypes.FETCH_ONE_USER_SUCCESS:
            return state.setIn(["oneUser", "loading"], false)
                        .setIn(["oneUser", "success"], true)
                        .setIn(["oneUser", "user"], action.payload)
        case OrdersActionTypes.FETCH_ONE_USER_ERROR:
            return state.setIn(["oneUser", "loading"], false)
                        .setIn(["oneUser", "error"], action.payload)
        case OrdersActionTypes.RESOLVE_ON_HOLD:
            return state.setIn(["resolveOnHoldLoading"], true)
                        .setIn(["resolveOnHoldSuccess"], false)
                        .setIn(["resolveOnHoldError"],  null)
        case OrdersActionTypes.RESOLVE_ON_HOLD_SUCCESS:
            return state.setIn(["resolveOnHoldLoading"], false)
                        .setIn(["resolveOnHoldSuccess"], true)
        case OrdersActionTypes.RESOLVE_ON_HOLD_ERROR:
            return state.setIn(["resolveOnHoldLoading"], false)
                        .setIn(["resolveOnHoldError"], action.payload)
        case OrdersActionTypes.ON_HOLD:
            return state.setIn(["onHoldLoading"], true) 
                        .setIn(["onHoldSuccess"], false)
                        .setIn(["onHoldError"], null)
        case OrdersActionTypes.ON_HOLD_SUCCESS:
            return state.setIn(["onHoldLoading"], false) 
                        .setIn(["onHoldSuccess"], true)
        case OrdersActionTypes.ON_HOLD_ERROR:
            return state.setIn(["onHoldLoading"], false) 
                        .setIn(["onHoldError"], action.payload)
        case OrdersActionTypes.GET_ALL_SUPPLIER:
            return state.setIn(["listSuppliers", "loading"], true)
                        .setIn(["listSuppliers", "success"], false)
                        .setIn(["listSuppliers","error"],  null)
        case OrdersActionTypes.GET_ALL_SUPPLIER_SUCCESS:
            return state.setIn(["listSuppliers", "loading"], false)
                        .setIn(["listSuppliers", "success"], true)
                        .setIn(["listSuppliers", "suppliers"], action.payload)
        case OrdersActionTypes.GET_ALL_SUPPLIER_ERROR:
            return state.setIn(["listSuppliers", "loading"], false)
                        .setIn(["listSuppliers", "error"], action.payload)
        case OrdersActionTypes.RESEND:
            return state.setIn(["resendLoading"], true)
                        .setIn(["resendSuccess"], false)
                        .setIn(["resendError"], null)
        case OrdersActionTypes.RESEND_SUCCESS:
            return state.setIn(["resendLoading"], false)
                        .setIn(["resendSuccess"], true)
        case OrdersActionTypes.RESEND_ERROR:
            return state.setIn(["resendLoading"], false)
                        .setIn(["resendError"], action.payload)
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
        case OrdersActionTypes.ASSIGN_CARRIER:
            return state.setIn(["assignCarrierLoading"], true)
                        .setIn(["assignCarrierSuccess"], false)
                        .setIn(["assignCarrierError"], null)
        case OrdersActionTypes.ASSIGN_CARRIER_SUCCESS:
            return state.setIn(["assignCarrierLoading"], false)
                        .setIn(["assignCarrierSuccess"], true)
        case OrdersActionTypes.ASSIGN_CARRIER_ERROR:
            return state.setIn(["assignCarrierLoading"], false)
                        .setIn(["assignCarrierError"], action.payload)
        case OrdersActionTypes.DO_FETCH_ALL_CARRIERS_NO_PAGING:
            return state
                .setIn(['listCarriesNoPaging', 'loading'], true)
                .setIn(['listCarriesNoPaging', 'success'], false);

        case OrdersActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_SUCCESS:
            return state
                .setIn(['listCarriesNoPaging', 'loading'], false)
                .setIn(['listCarriesNoPaging', 'success'], true)
                .setIn(['listCarriesNoPaging', 'carries'], action.payload);

        case OrdersActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_ERROR:
            return state
                .setIn(['listCarriesNoPaging', 'loading'], false)
                .setIn(['listCarriesNoPaging', 'error'], action.payload);
        case OrdersActionTypes.FETCH_CARRIER_WITH_PRODUCT_TYPE:
            return state.setIn(["carriersAssign", "loading"], true)
                        .setIn(["carriersAssign", "success"], false)
                        .setIn(["carriersAssign", "error"], null)
        case OrdersActionTypes.FETCH_CARRIER_WITH_PRODUCT_TYPE_SUCCESS:
            return state.setIn(["carriersAssign", "loading"], false)
                        .setIn(["carriersAssign", "success"], true)
                        .setIn(["carriersAssign", "listCarriersAssign"], action.payload)
        case OrdersActionTypes.FETCH_CARRIER_WITH_PRODUCT_TYPE_ERROR:
            return state.setIn(["carriersAssign", "loading"], false)
                        .setIn(["carriersAssign", "error"], true)
        case OrdersActionTypes.EXPORT_ERROR_FILE:
            return state.setIn(["exportErrorFileLoading"], true)
                        .setIn(["exportErrorFileSuccess"], false)
                        .setIn(["exportErrorFileError"], null)
        case OrdersActionTypes.EXPORT_ERROR_FILE_SUCCESS:
            return state.setIn(["exportErrorFileLoading"], false)
                        .setIn(["exportErrorFileSuccess"], true)
        case OrdersActionTypes.EXPORT_ERROR_FILE_ERROR:
            return state.setIn(["exportErrorFileLoading"], false)
                        .setIn(["exportErrorFileError"], action.payload)
        default:
            return state
    }
}
