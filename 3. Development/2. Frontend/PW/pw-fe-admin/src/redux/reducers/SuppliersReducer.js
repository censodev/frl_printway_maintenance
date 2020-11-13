import {fromJS} from 'immutable';

import {SupplierActionTypes} from '../actionTypes';

const initialState = fromJS({
    listSuppliers: {
        suppliers: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false,
    },
    // currentSite: {site: {}, error: null, loading: false},
    listSuppliersNoPaging: {
        suppliers: [],
        error: null,
        loading: false,
    },
    createLoading: false,
    createSuccess: false,
    createError: null,
    editLoading: false,
    editSuccess: false,
    editError: null,
    deleteLoading: false,
    deleteSuccess: false,
    deleteError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const suppliers = (state = initialState, action) => {
    switch (action.type) {
        case SupplierActionTypes.DO_FETCH_ALL_SUPPLIERS:
            return state
                .setIn(['listSuppliers', 'loading'], true)
                .setIn(['listSuppliers', 'success'], false);

        case SupplierActionTypes.FETCH_ALL_SUPPLIERS_SUCCESS:
            return state
                .setIn(['listSuppliers', 'loading'], false)
                .setIn(['listSuppliers', 'success'], true)
                .setIn(['listSuppliers', 'suppliers'], action.payload.content)
                .setIn(['listSuppliers', 'totalElements'], action.payload.totalElements);

        case SupplierActionTypes.FETCH_ALL_SUPPLIERS_ERROR:
            return state
                .setIn(['listSuppliers', 'loading'], false)
                .setIn(['listSuppliers', 'error'], action.payload);

        case SupplierActionTypes.DO_FETCH_ALL_SUPPLIERS_NO_PAGING:
            return state
                .setIn(['listSuppliersNoPaging', 'loading'], true)
                .setIn(['listSuppliersNoPaging', 'success'], false);

        case SupplierActionTypes.FETCH_ALL_SUPPLIERS_NO_PAGING_SUCCESS:
            return state
                .setIn(['listSuppliersNoPaging', 'loading'], false)
                .setIn(['listSuppliersNoPaging', 'success'], true)
                .setIn(['listSuppliersNoPaging', 'suppliers'], action.payload);

        case SupplierActionTypes.FETCH_ALL_SUPPLIERS_NO_PAGING_ERROR:
            return state
                .setIn(['listSuppliersNoPaging', 'loading'], false)
                .setIn(['listSuppliersNoPaging', 'error'], action.payload);

        // case SupplierActionTypes.DO_FETCH_SITE:
        //     return state.setIn(['currentSite', 'loading'], true);
        //
        // case SupplierActionTypes.FETCH_SITE_SUCCESS:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], null)
        //         .setIn(['currentSite', 'site'], action.payload);
        //
        // case SupplierActionTypes.FETCH_SITE_ERROR:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], action.payload);
        //
        // case SupplierActionTypes.DO_EDIT_SITE:
        //     return state
        //         .setIn(['editLoading'], true)
        //         .setIn(['editSuccess'], false)
        //         .setIn(['editError'], null);
        //
        // case SupplierActionTypes.EDIT_SITE_SUCCESS:
        //     return state.setIn(['editLoading'], false)
        //         .setIn(['editSuccess'], true);
        //
        // case SupplierActionTypes.EDIT_SITE_ERROR:
        //     return state
        //         .setIn(['editLoading'], false)
        //         .setIn(['editError'], action.payload);
        //
        // case SupplierActionTypes.DO_CREATE_SITE:
        //     return state
        //         .setIn(['createLoading'], true)
        //         .setIn(['createSuccess'], false)
        //         .setIn(['createError'], null);
        //
        // case SupplierActionTypes.CREATE_SITE_SUCCESS:
        //     return state
        //         .setIn(['createLoading'], false)
        //         .setIn(['createSuccess'], true);
        //
        // case SupplierActionTypes.CREATE_SITE_ERROR:
        //     return state
        //         .setIn(['createLoading'], false)
        //         .setIn(['createError'], action.payload);

        case SupplierActionTypes.DO_DELETE_SUPPLIER:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case SupplierActionTypes.DELETE_SUPPLIER_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case SupplierActionTypes.DELETE_SUPPLIER_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        default:
            return state;
    }
};
