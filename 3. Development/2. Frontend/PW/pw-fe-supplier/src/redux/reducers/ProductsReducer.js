import {fromJS} from 'immutable';
import * as _ from 'lodash';
import {ProductsActionTypes} from '../actionTypes';

const initialState = fromJS({
    listProducts: {
        products: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false,
    },
    listProductType: {
        productType: [],
        error: null,
        loading: false,
        success: false,
    },
    listProductTypeNoPaging: {
        productType: [],
        error: null,
        loading: false,
        success: false,
    },
    listShopifyCollections: {
        shopifyCollections: [],
        error: null,
        loading: false,
        success: false,
    },
    currentShoptifyCollection: {
        collection: {},
        loading: false,
        error: null,
        success: false,
    },
    createLoading: false,
    createSuccess: false,
    createError: null,
    editLoading: false,
    editSuccess: false,
    editError: null,
    editPrintFilesLoading: false,
    editPrintFilesSuccess: false,
    editPrintFilesError: null,
    duplicateLoading: false,
    duplicateSuccess: false,
    duplicateError: null,
    activateLoading: false,
    activateSuccess: false,
    activateError: null,
    syncLoading: false,
    syncSuccess: false,
    syncError: null,
    deleteLoading: false,
    deleteSuccess: false,
    deleteError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const products = (state = initialState, action) => {
    switch (action.type) {
        case ProductsActionTypes.DO_FETCH_ALL_PRODUCTS:
            return state
                .setIn(['listProducts', 'loading'], true)
                .setIn(['listProducts', 'success'], false);

        case ProductsActionTypes.FETCH_ALL_PRODUCTS_SUCCESS:
            return state
                .setIn(['listProducts', 'loading'], false)
                .setIn(['listProducts', 'success'], true)
                .setIn(['listProducts', 'products'], action.payload.content)
                .setIn(['listProducts', 'totalElements'], action.payload.totalElements);

        case ProductsActionTypes.FETCH_ALL_PRODUCTS_ERROR:
            return state
                .setIn(['listProducts', 'loading'], false)
                .setIn(['listProducts', 'error'], action.payload);


        case ProductsActionTypes.DO_FETCH_ALL_PRODUCT_TYPE:
            return state
                .setIn(['listProductType', 'loading'], true)
                .setIn(['listProductType', 'success'], false);

        case ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_SUCCESS:
            return state
                .setIn(['listProductType', 'loading'], false)
                .setIn(['listProductType', 'success'], true)
                .setIn(['listProductType', 'productType'], action.payload);

        case ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_ERROR:
            return state
                .setIn(['listProductType', 'loading'], false)
                .setIn(['listProductType', 'error'], action.payload);


        case ProductsActionTypes.DO_FETCH_ALL_PRODUCT_TYPE_NO_PAGING:
            return state
                .setIn(['listProductTypeNoPaging', 'loading'], true)
                .setIn(['listProductTypeNoPaging', 'success'], false);

        case ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_NO_PAGING_SUCCESS:
            return state
                .setIn(['listProductTypeNoPaging', 'loading'], false)
                .setIn(['listProductTypeNoPaging', 'success'], true)
                .setIn(['listProductTypeNoPaging', 'productType'], action.payload);

        case ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_NO_PAGING_ERROR:
            return state
                .setIn(['listProductTypeNoPaging', 'loading'], false)
                .setIn(['listProductTypeNoPaging', 'error'], action.payload);


        case ProductsActionTypes.DO_FETCH_ALL_SHOPIFY_COLLECTION:
            return state
                .setIn(['listShopifyCollections', 'loading'], true)
                .setIn(['listShopifyCollections', 'success'], false);

        case ProductsActionTypes.FETCH_ALL_SHOPIFY_COLLECTION_SUCCESS:
            return state
                .setIn(['listShopifyCollections', 'loading'], false)
                .setIn(['listShopifyCollections', 'success'], true)
                .setIn(['listShopifyCollections', 'shopifyCollections'], action.payload);

        case ProductsActionTypes.FETCH_ALL_SHOPIFY_COLLECTION_ERROR:
            return state
                .setIn(['listShopifyCollections', 'loading'], false)
                .setIn(['listShopifyCollections', 'error'], action.payload);


        case ProductsActionTypes.DO_EDIT_PRODUCT:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case ProductsActionTypes.EDIT_PRODUCT_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case ProductsActionTypes.EDIT_PRODUCT_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);

        case ProductsActionTypes.DO_DUPLICATE_PRODUCT:
            return state
                .setIn(['duplicateLoading'], true)
                .setIn(['duplicateSuccess'], false)
                .setIn(['duplicateError'], null);

        case ProductsActionTypes.DUPLICATE_PRODUCT_SUCCESS:
            return state.setIn(['duplicateLoading'], false)
                .setIn(['duplicateSuccess'], true);

        case ProductsActionTypes.DUPLICATE_PRODUCT_ERROR:
            return state
                .setIn(['duplicateLoading'], false)
                .setIn(['duplicateError'], action.payload);

        case ProductsActionTypes.DO_ACTIVATE_PRODUCT:
            return state
                .setIn(['activateLoading'], true)
                .setIn(['activateSuccess'], false)
                .setIn(['activateError'], null);

        case ProductsActionTypes.ACTIVATE_PRODUCT_SUCCESS:
            return state.setIn(['activateLoading'], false)
                .setIn(['activateSuccess'], true);

        case ProductsActionTypes.ACTIVATE_PRODUCT_ERROR:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateError'], action.payload);


        case ProductsActionTypes.DO_SYNC_PRODUCT:
            return state
                .setIn(['syncLoading'], true)
                .setIn(['syncSuccess'], false)
                .setIn(['syncError'], null);

        case ProductsActionTypes.SYNC_PRODUCT_SUCCESS:
            return state.setIn(['syncLoading'], false)
                .setIn(['syncSuccess'], true);

        case ProductsActionTypes.SYNC_PRODUCT_ERROR:
            return state
                .setIn(['syncLoading'], false)
                .setIn(['syncError'], action.payload);


        case ProductsActionTypes.DO_EDIT_PRINT_FILES:
            return state
                .setIn(['editPrintFilesLoading'], true)
                .setIn(['editPrintFilesSuccess'], false)
                .setIn(['editPrintFilesError'], null);

        case ProductsActionTypes.EDIT_PRINT_FILES_SUCCESS:
            return state.setIn(['editPrintFilesLoading'], false)
                .setIn(['editPrintFilesSuccess'], true);

        case ProductsActionTypes.EDIT_PRINT_FILES_ERROR:
            return state
                .setIn(['editPrintFilesLoading'], false)
                .setIn(['editPrintFilesError'], action.payload);

        case ProductsActionTypes.DO_CREATE_PRODUCT:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case ProductsActionTypes.CREATE_PRODUCT_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case ProductsActionTypes.CREATE_PRODUCT_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case ProductsActionTypes.DO_CREATE_SHOPIFY_COLLECTION:
            return state
                .setIn(['currentShoptifyCollection', 'loading'], true)
                .setIn(['currentShoptifyCollection', 'error'], null)
                .setIn(['currentShoptifyCollection', 'success'], false)
                .setIn(['currentShoptifyCollection', 'collection'], {});

        case ProductsActionTypes.CREATE_SHOPIFY_COLLECTION_SUCCESS:
            return state
                .setIn(['currentShoptifyCollection', 'loading'], false)
                .setIn(['currentShoptifyCollection', 'success'], true)
                .setIn(['listShopifyCollections', 'shopifyCollections'], state.getIn(['listShopifyCollections', 'shopifyCollections']).concat(action.payload));


        case ProductsActionTypes.CREATE_SHOPIFY_COLLECTION_ERROR:
            return state
                .setIn(['currentShoptifyCollection', 'loading'], false)
                .setIn(['currentShoptifyCollection', 'error'], action.payload);

        case ProductsActionTypes.DO_SEARCH_PRODUCT_TYPE:
            return state
                .setIn(['listProductType', 'productType'], _.filter(state.getIn(['listProductType', 'productType'], {title: action.payload})));

        // case ProductsActionTypes.DO_DELETE_PRODUCT:
        //     return state
        //         .setIn(['deleteLoading'], true)
        //         .setIn(['deleteSuccess'], false)
        //         .setIn(['deleteError'], null);
        //
        // case ProductsActionTypes.DELETE_PRODUCT_SUCCESS:
        //     return state
        //         .setIn(['deleteLoading'], false)
        //         .setIn(['deleteSuccess'], true);
        //
        // case ProductsActionTypes.DELETE_PRODUCT_ERROR:
        //     return state
        //         .setIn(['deleteLoading'], false)
        //         .setIn(['deleteError'], action.payload);

        default:
            return state;
    }
};
