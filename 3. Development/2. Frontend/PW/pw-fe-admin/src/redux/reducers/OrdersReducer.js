import { fromJS } from 'immutable';

import { OrdersActionTypes } from '../actionTypes'
import { getAssignSupplier } from '../actions/OrdersActions';
import { OrdersActions } from '../actions';

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

    // editNote: false,
    // editNoteSuccess: false,
    // editNoteError: null

    editShipping: false,
    editShippingSuccess: false,
    editShippingError: null,

    oneUser : {
        user: {},
        loading: false,
        success: false,
        error: null
    },
    doResolve: false,
    resolveSuccess: false,
    resolveError: null,
    setActionRequiredLoading: false,
    setActionRequiredSuccess: false,
    setActionRequiredError: null,
    resolveOnHoldLoading: false,
    resolveOnHoldSuccess: false,
    resolveOnHoldError: null,
    
    listSuppliers: {
        suppliers: [],
        loading: false,
        success: false,
        error: null
    },
    refundLoading: false,
    refundSuccess: false,
    refundError: null,

    resendLoading: false,
    resendSuccess: false,
    resendError: null,

    cancelLoading: false,
    cancelSuccess: false,
    cancelError: null,

    assignSupplierLoading: false,
    assignSupplierSuccess: false,
    assignSupplierError: null,

    assignCarrierLoading: false,
    assignCarrierSuccess: false,
    assignCarrierError: null,

    listStatistic: {
        statistic: null,
        loading: false,
        success: false,
        error: null
    },

    suppliersAssign: {
        listSuppliersAssign : [],
        loading: false,
        success: false,
        error: null
    },
    
    acceptCancelLoading: false,
    acceptCancelSuccess: false,
    acceptCancelError: null,

    rejectCancelLoading: false,
    rejectCancelSuccess: false,
    rejectCancelError: null,

    addTrackingIdLoading: false,
    addTrackingIdSuccess: false,
    addTrackingIdError: null,

    exportErrorFileLoading: false,
    exportErrorFileSuccess: false,
    exportErrorFileError: null,

    carriersAssign: {
        listCarriersAssign : [],
        loading: false,
        success: false,
        error: null
    },
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
        // case OrdersActionTypes.EDIT_NOTE:
        //     return state.setIn(["editNote"], true)
        //                 .setIn(["editNoteSuccess"], false)
        //                 .setIn(["editNoteError"], null)
        // case OrdersActionTypes.EDIT_NOTE_SUCCESS:
        //     return state.setIn(["editNote"], false)
        //                 .setIn(["editNoteSuccess"], true)
        // case OrdersActionTypes.EDIT_NOTE_ERROR:
        //     return state.setIn(["editNote"], false)
        //                 .setIn(["editNoteError"], action.payload)
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
        case OrdersActionTypes.RESOLVE:
            return state.setIn(["doResolve"], true)
                        .setIn(["resolveSuccess"], false)
                        .setIn(["resolveError"],  null)
        case OrdersActionTypes.RESOLVE_SUCCESS:
            return state.setIn(["doResolve"], false)
                        .setIn(["resolveSuccess"], true)
        case OrdersActionTypes.RESOLVE_ERROR:
            return state.setIn(["doResolve"], false)
                        .setIn(["resolveError"], action.payload)
        case OrdersActionTypes.SET_ACTION_REQUIRED:
            return state.setIn(["setActionRequiredLoading"], true) 
                        .setIn(["setActionRequiredSuccess"], false)
                        .setIn(["setActionRequiredError"], null)
        case OrdersActionTypes.SET_ACTION_REQUIRED_SUCCESS:
            return state.setIn(["setActionRequiredLoading"], false) 
                        .setIn(["setActionRequiredSuccess"], true)
        case OrdersActionTypes.SET_ACTION_REQUIRED_ERROR:
            return state.setIn(["setActionRequiredLoading"], false) 
                        .setIn(["setActionRequiredError"], action.payload)
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
        case OrdersActionTypes.REFUND:
            return state.setIn(["refundLoading"], true)
                        .setIn(["refundSuccess"], false)
                        .setIn(["refundError"], null)
        case OrdersActionTypes.REFUND_SUCCESS:
            return state.setIn(["refundLoading"], false)
                        .setIn(["refundSuccess"], true)
        case OrdersActionTypes.REFUND_ERROR:
            return state.setIn(["refundLoading"], false)
                        .setIn(["refundError"], action.payload)
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
        case OrdersActionTypes.ASSIGN_SUPPLIER:
            return state.setIn(["assignSupplierLoading"], true)
                        .setIn(["assignSupplierSuccess"], false)
                        .setIn(["assignSupplierError"], null)
        case OrdersActionTypes.ASSIGN_SUPPLIER_SUCCESS:
            return state.setIn(["assignSupplierLoading"], false)
                        .setIn(["assignSupplierSuccess"], true)
        case OrdersActionTypes.ASSIGN_SUPPLIER_ERROR:
            return state.setIn(["assignSupplierLoading"], false)
                        .setIn(["assignSupplierError"], action.payload)
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
        case OrdersActionTypes.FETCH_SUPPLIER_WITH_PRODUCT_TYPE:
            return state.setIn(["suppliersAssign", "loading"], true)
                        .setIn(["suppliersAssign", "success"], false)
                        .setIn(["suppliersAssign", "error"], null)
        case OrdersActionTypes.FETCH_SUPPLIER_WITH_PRODUCT_TYPE_SUCCESS:
            return state.setIn(["suppliersAssign", "loading"], false)
                        .setIn(["suppliersAssign", "success"], true)
                        .setIn(["suppliersAssign", "listSuppliersAssign"], action.payload)
        case OrdersActionTypes.FETCH_SUPPLIER_WITH_PRODUCT_TYPE_ERROR:
            return state.setIn(["suppliersAssign", "loading"], false)
                        .setIn(["suppliersAssign", "error"], true)
        case OrdersActionTypes.ACCEPT_CANCEL:
            return state.setIn(["acceptCancelLoading"], true)
                        .setIn(["acceptCancelSuccess"], false)
                        .setIn(["acceptCancelError"], null)
        case OrdersActionTypes.ACCEPT_CANCEL_SUCCESS:
            return state.setIn(["acceptCancelLoading"], false)
                        .setIn(["acceptCancelSuccess"], true)
        case OrdersActionTypes.ACCEPT_CANCEL_ERROR:
            return state.setIn(["acceptCancelLoading"], false)
                        .setIn(["acceptCancelError"], action.payload)
        case OrdersActionTypes.REJECT_CANCEL:
            return state.setIn(["rejectCancelLoading"], true)
                        .setIn(["rejectCancelSuccess"], false)
                        .setIn(["rejectCancelError"], null)
        case OrdersActionTypes.REJECT_CANCEL_SUCCESS:
            return state.setIn(["rejectCancelLoading"], false)
                        .setIn(["rejectCancelSuccess"], true)
        case OrdersActionTypes.REJECT_CANCEL_ERROR:
            return state.setIn(["rejectCancelLoading"], false)
                        .setIn(["rejectCancelError"], action.payload)
        case OrdersActionTypes.ADD_TRACKING_ID:
            return state.setIn(["addTrackingIdLoading"], true)
                        .setIn(["addTrackingIdSuccess"], false)
                        .setIn(["addTrackingIdError"], null)
        case OrdersActionTypes.ADD_TRACKING_ID_SUCCESS:
            return state.setIn(["addTrackingIdLoading"], false)
                        .setIn(["addTrackingIdSuccess"], true)
        case OrdersActionTypes.ADD_TRACKING_ID_ERROR:
            return state.setIn(["addTrackingIdLoading"], false)
                        .setIn(["addTrackingIdError"], action.payload)
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
        default:
            return state
    }
}
