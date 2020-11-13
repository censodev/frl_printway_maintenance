import {fromJS} from 'immutable';

import {ProductTypesActionTypes} from '../actionTypes';

const initialState = fromJS({
    listProductTypes: {
        productTypes: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false,
    },
    listCountries: {
        countries: [],
        error: null,
        loading: false,
        success: false,
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
    activateLoading: false,
    activateSuccess: false,
    activateError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const productTypes = (state = initialState, action) => {
    switch (action.type) {
        case ProductTypesActionTypes.DO_FETCH_ALL_PRODUCT_TYPES:
            return state
                .setIn(['listProductTypes', 'loading'], true)
                .setIn(['listProductTypes', 'success'], false);

        case ProductTypesActionTypes.FETCH_ALL_PRODUCT_TYPES_SUCCESS:
            return state
                .setIn(['listProductTypes', 'loading'], false)
                .setIn(['listProductTypes', 'success'], true)
                .setIn(['listProductTypes', 'productTypes'], action.payload.content)
                .setIn(['listProductTypes', 'totalElements'], action.payload.totalElements);

        case ProductTypesActionTypes.FETCH_ALL_PRODUCT_TYPES_ERROR:
            return state
                .setIn(['listProductTypes', 'loading'], false)
                .setIn(['listProductTypes', 'error'], action.payload);


        case ProductTypesActionTypes.DO_FETCH_ALL_COUNTRIES:
            return state
                .setIn(['listCountries', 'loading'], true)
                .setIn(['listCountries', 'success'], false);

        case ProductTypesActionTypes.FETCH_ALL_COUNTRIES_SUCCESS:
            return state
                .setIn(['listCountries', 'loading'], false)
                .setIn(['listCountries', 'success'], true)
                .setIn(['listCountries', 'countries'], action.payload);
        // .setIn(['listCountries', 'totalElements'], action.payload.totalElements);

        case ProductTypesActionTypes.FETCH_ALL_COUNTRIES_ERROR:
            return state
                .setIn(['listCountries', 'loading'], false)
                .setIn(['listCountries', 'error'], action.payload);

        // case ProductTypesActionTypes.DO_FETCH_SITE:
        //     return state.setIn(['currentSite', 'loading'], true);
        //
        // case ProductTypesActionTypes.FETCH_SITE_SUCCESS:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], null)
        //         .setIn(['currentSite', 'site'], action.payload);
        //
        // case ProductTypesActionTypes.FETCH_SITE_ERROR:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], action.payload);
        //
        case ProductTypesActionTypes.DO_EDIT_PRODUCT_TYPE:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case ProductTypesActionTypes.EDIT_PRODUCT_TYPE_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case ProductTypesActionTypes.EDIT_PRODUCT_TYPE_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);

        case ProductTypesActionTypes.DO_CREATE_PRODUCT_TYPE:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case ProductTypesActionTypes.CREATE_PRODUCT_TYPE_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case ProductTypesActionTypes.CREATE_PRODUCT_TYPE_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case ProductTypesActionTypes.DO_DELETE_PRODUCT_TYPE:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case ProductTypesActionTypes.DELETE_PRODUCT_TYPE_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case ProductTypesActionTypes.DELETE_PRODUCT_TYPE_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        case ProductTypesActionTypes.DO_ACTIVATE_PRODUCT_TYPE:
            return state
                .setIn(['activateLoading'], true)
                .setIn(['activateSuccess'], false)
                .setIn(['activateError'], null);

        case ProductTypesActionTypes.ACTIVATE_PRODUCT_TYPE_SUCCESS:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateSuccess'], true);

        case ProductTypesActionTypes.ACTIVATE_PRODUCT_TYPE_ERROR:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateError'], action.payload);

        default:
            return state;
    }
};
