import * as _ from 'lodash';
import {ProductsActionTypes, SiteActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";
import getQueryUrl from "../../core/util/getQueryUrl";

// FETCH ALL
const fetchAllProductsAction = () => ({
    type: ProductsActionTypes.DO_FETCH_ALL_PRODUCTS,
});

const fetchAllProductsSuccessAction = (sites) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCTS_SUCCESS,
    payload: sites,
});

const fetchAllProductsErrorAction = (error) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCTS_ERROR,
    payload: error,
});

// FETCH PRODUCT TYPE
const fetchAllProductTypeAction = () => ({
    type: ProductsActionTypes.DO_FETCH_ALL_PRODUCT_TYPE,
});

const fetchAllProductTypeSuccessAction = (countries) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_SUCCESS,
    payload: countries,
});

const fetchAllProductTypeErrorAction = (error) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_ERROR,
    payload: error,
});


// FETCH ALL PDT NO PAGING
const fetchAllProductTypeNoPagingAction = () => ({
    type: ProductsActionTypes.DO_FETCH_ALL_PRODUCT_TYPE_NO_PAGING,
});

const fetchAllProductTypeNoPagingSuccessAction = (data) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_NO_PAGING_SUCCESS,
    payload: data,
});

const fetchAllProductTypeNoPagingErrorAction = (error) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_NO_PAGING_ERROR,
    payload: error,
});


// FETCH SHOPIFY COLLECTION
const fetchAllShopifyCollectionsAction = () => ({
    type: ProductsActionTypes.DO_FETCH_ALL_SHOPIFY_COLLECTION,
});

const fetchAllShopifyCollectionsSuccessAction = (data) => ({
    type: ProductsActionTypes.FETCH_ALL_SHOPIFY_COLLECTION_SUCCESS,
    payload: data,
});

const fetchAllShopifyCollectionsErrorAction = (error) => ({
    type: ProductsActionTypes.FETCH_ALL_SHOPIFY_COLLECTION_ERROR,
    payload: error,
});


//  CREATE
export const createProductAction = () => ({
    type: ProductsActionTypes.DO_CREATE_PRODUCT,
});

export const createProductSuccessAction = () => ({
    type: ProductsActionTypes.CREATE_PRODUCT_SUCCESS,
});

export const createProductErrorAction = (error) => ({
    type: ProductsActionTypes.CREATE_PRODUCT_ERROR,
    payload: error,
});


//  CREATE SHOPIFY COLLECTION
export const createShoptifyCollectionAction = () => ({
    type: ProductsActionTypes.DO_CREATE_SHOPIFY_COLLECTION,
});

export const createShoptifyCollectionSuccessAction = (data) => ({
    type: ProductsActionTypes.CREATE_SHOPIFY_COLLECTION_SUCCESS,
    payload: data
});

export const createShoptifyCollectionErrorAction = (error) => ({
    type: ProductsActionTypes.CREATE_SHOPIFY_COLLECTION_ERROR,
    payload: error,
});


// EDIT

export const editProductByIdAction = () => ({
    type: ProductsActionTypes.DO_EDIT_PRODUCT,
});

export const editProductByIdSuccessAction = () => ({
    type: ProductsActionTypes.EDIT_PRODUCT_SUCCESS,
});

export const editProductByIdErrorAction = (error) => ({
    type: ProductsActionTypes.EDIT_PRODUCT_ERROR,
    payload: error,
});


// EDIT

export const editPrintFilesAction = () => ({
    type: ProductsActionTypes.DO_EDIT_PRINT_FILES,
});

export const editPrintFilesSuccessAction = () => ({
    type: ProductsActionTypes.EDIT_PRINT_FILES_SUCCESS,
});

export const editPrintFilesErrorAction = (error) => ({
    type: ProductsActionTypes.EDIT_PRINT_FILES_ERROR,
    payload: error,
});


// DUPLICATE

export const duplicateProductByIdAction = () => ({
    type: ProductsActionTypes.DO_DUPLICATE_PRODUCT,
});

export const duplicateProductByIdSuccessAction = () => ({
    type: ProductsActionTypes.DUPLICATE_PRODUCT_SUCCESS,
});

export const duplicateProductByIdErrorAction = (error) => ({
    type: ProductsActionTypes.DUPLICATE_PRODUCT_ERROR,
    payload: error,
});

// ACTIVATE

export const activateProductByIdAction = () => ({
    type: ProductsActionTypes.DO_ACTIVATE_PRODUCT,
});

export const activateProductByIdSuccessAction = () => ({
    type: ProductsActionTypes.ACTIVATE_PRODUCT_SUCCESS,
});

export const activateProductByIdErrorAction = (error) => ({
    type: ProductsActionTypes.ACTIVATE_PRODUCT_ERROR,
    payload: error,
});


// SYNC

export const syncProductByIdAction = () => ({
    type: ProductsActionTypes.DO_SYNC_PRODUCT,
});

export const syncProductByIdSuccessAction = () => ({
    type: ProductsActionTypes.SYNC_PRODUCT_SUCCESS,
});

export const syncProductByIdErrorAction = (error) => ({
    type: ProductsActionTypes.SYNC_PRODUCT_ERROR,
    payload: error,
});


// SEARCH PRODUCT TYPE
export const searchProductType = (key) => ({
    type: ProductsActionTypes.DO_SEARCH_PRODUCT_TYPE,
    payload: key,
});


// DELETE SITE

// export const deleteProductTypeByIdAction = () => ({
//     type: ProductsActionTypes.DO_DELETE_PRODUCT_TYPE,
// });
//
// export const deleteProductTypeByIdSuccess = () => ({
//     type: ProductsActionTypes.DELETE_PRODUCT_TYPE_SUCCESS,
// });
//
// export const deleteProductTypeByIdError = (error) => ({
//     type: ProductsActionTypes.DELETE_PRODUCT_TYPE_ERROR,
//     payload: error,
// });


export const fetchAllProducts = (params) => async (dispatch) => {
    dispatch(fetchAllProductsAction());
    try {
        const response = await axios.get(decodeURIComponent(getQueryUrl('pgc-service/api/product/page', params)));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllProductsSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllProductsErrorAction(error.response.data.message));
    }
};

export const fetchAllProductType = () => async (dispatch) => {
    dispatch(fetchAllProductTypeAction());
    try {
        const response = await await API.get(`pgc-service/api/product-type/list/category`);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllProductTypeSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllProductTypeErrorAction(error.response.data.message));
    }
};

export const fetchAllProductTypeNoPaging = () => async (dispatch) => {
    dispatch(fetchAllProductTypeNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/product-type/list`);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllProductTypeNoPagingSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllProductTypeNoPagingErrorAction(error.response.data.message));
    }
};

export const fetchAllShopifyCollections = (id) => async (dispatch) => {
    dispatch(fetchAllShopifyCollectionsAction());
    try {
        const response = await await API.get(`pgc-service/api/product/collection/list?siteId=${id}`);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllShopifyCollectionsSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllShopifyCollectionsErrorAction(error.response.data.message));
    }
};


// export const deleteProductType = (id) => async (dispatch) => {
//     dispatch(deleteProductTypeByIdAction());
//     try {
//         const response = await API.delete(`pgc-service/api/product-type/admin/${id}`);
//         const status = _.get(response, 'status');
//         if (status === 200) {
//             dispatch(deleteProductTypeByIdSuccess());
//         }
//     } catch (error) {
//         checkTokenExpired(error);
//         dispatch(deleteProductTypeByIdError(error.response.data.message));
//     }
// };


export const createProduct = (params) => async (dispatch) => {
    dispatch(createProductAction());
    try {
        const response = await API.post('pgc-service/api/product', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createProductSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createProductErrorAction(error.response.data.message));
    }
};

export const createShoptifyCollection = (idSite, params) => async (dispatch) => {
    dispatch(createShoptifyCollectionAction());
    try {
        const response = await API.post(`pgc-service/api/product/collection?siteId=${idSite}`, params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createShoptifyCollectionSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createShoptifyCollectionErrorAction(error.response.data.message));
    }
};

export const editProduct = (params) => async (dispatch) => {
    dispatch(editProductByIdAction());
    try {
        const response = await API.put('pgc-service/api/product', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editProductByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editProductByIdErrorAction(error.response.data.message));
    }
};


export const editPrintFiles = (params) => async (dispatch) => {
    dispatch(editPrintFilesAction());
    try {
        const response = await API.put('pgc-service/api/product/design', params);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(editPrintFilesSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editPrintFilesErrorAction(error.response.data.message));
    }
};

export const duplicateProduct = (id) => async (dispatch) => {
    dispatch(duplicateProductByIdAction());
    try {
        const response = await API.get('pgc-service/api/product/duplicate?id=' + id);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(duplicateProductByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(duplicateProductByIdErrorAction(error.response.data.message));
    }
};


export const activateProduct = (params) => async (dispatch) => {
    dispatch(duplicateProductByIdAction());
    try {
        const response = await API.get(`pgc-service/api/product/active?id=${params.id}&activated=${params.status}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(duplicateProductByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(duplicateProductByIdErrorAction(error.response.data.message));
    }
};

export const syncProduct = (id) => async (dispatch) => {
    dispatch(syncProductByIdAction());
    try {
        const response = await API.put('pgc-service/api/product/sync?id=' + id);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(syncProductByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(syncProductByIdErrorAction(error.response.data.message));
    }
};
