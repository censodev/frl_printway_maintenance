import * as _ from 'lodash';
import {ProductTypesActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";
import getQueryUrl from "../../core/util/getQueryUrl";

// FETCH ALL
const fetchAllProductTypesAction = () => ({
    type: ProductTypesActionTypes.DO_FETCH_ALL_PRODUCT_TYPES,
});

const fetchAllProductTypesSuccessAction = (sites) => ({
    type: ProductTypesActionTypes.FETCH_ALL_PRODUCT_TYPES_SUCCESS,
    payload: sites,
});

const fetchAllProductTypesErrorAction = (error) => ({
    type: ProductTypesActionTypes.FETCH_ALL_PRODUCT_TYPES_ERROR,
    payload: error,
});

// FETCH COUNTRIES
const fetchAllCountriesAction = () => ({
    type: ProductTypesActionTypes.DO_FETCH_ALL_COUNTRIES,
});

const fetchAllCountriesSuccessAction = (countries) => ({
    type: ProductTypesActionTypes.FETCH_ALL_COUNTRIES_SUCCESS,
    payload: countries,
});

const fetchAllCountriesErrorAction = (error) => ({
    type: ProductTypesActionTypes.FETCH_ALL_COUNTRIES_ERROR,
    payload: error,
});


//  CREATE
export const createProductTypeAction = () => ({
    type: ProductTypesActionTypes.DO_CREATE_PRODUCT_TYPE,
});

export const createProductTypeSuccessAction = () => ({
    type: ProductTypesActionTypes.CREATE_PRODUCT_TYPE_SUCCESS,
});

export const createProductTypeErrorAction = (error) => ({
    type: ProductTypesActionTypes.CREATE_PRODUCT_TYPE_ERROR,
    payload: error,
});

// EDIT

export const editProductTypeByIdAction = () => ({
    type: ProductTypesActionTypes.DO_EDIT_PRODUCT_TYPE,
});

export const editProductTypeByIdSuccessAction = () => ({
    type: ProductTypesActionTypes.EDIT_PRODUCT_TYPE_SUCCESS,
});

export const editProductTypeByIdErrorAction = (error) => ({
    type: ProductTypesActionTypes.EDIT_PRODUCT_TYPE_ERROR,
    payload: error,
});


// DELETE SITE

export const deleteProductTypeByIdAction = () => ({
    type: ProductTypesActionTypes.DO_DELETE_PRODUCT_TYPE,
});

export const deleteProductTypeByIdSuccess = () => ({
    type: ProductTypesActionTypes.DELETE_PRODUCT_TYPE_SUCCESS,
});

export const deleteProductTypeByIdError = (error) => ({
    type: ProductTypesActionTypes.DELETE_PRODUCT_TYPE_ERROR,
    payload: error,
});

// ACTIVATE

export const activateProductTypeByIdAction = () => ({
    type: ProductTypesActionTypes.DO_ACTIVATE_PRODUCT_TYPE,
});

export const activateProductTypeByIdSuccess = () => ({
    type: ProductTypesActionTypes.ACTIVATE_PRODUCT_TYPE_SUCCESS,
});

export const activateProductTypeByIdError = (error) => ({
    type: ProductTypesActionTypes.ACTIVATE_PRODUCT_TYPE_ERROR,
    payload: error,
});


export const fetchAllProductTypes = (params) => async (dispatch) => {
    dispatch(fetchAllProductTypesAction());
    try {
        const response = await axios.get(decodeURIComponent(getQueryUrl('pgc-service/api/product-type/page', params)));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllProductTypesSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllProductTypesErrorAction(error.response.data.message));
    }
};

export const fetchAllCountries = () => async (dispatch) => {
    dispatch(fetchAllCountriesAction());
    try {
        const response = await await API.get(`pgc-service/api/product-type/country`);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllCountriesSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllCountriesErrorAction(error.response.data.message));
    }
};


export const deleteProductType = (id) => async (dispatch) => {
    dispatch(deleteProductTypeByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/product-type/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteProductTypeByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteProductTypeByIdError(error.response.data.message));
    }
};


// export const fetchSite = (id) => async (dispatch) => {
//     dispatch(fetchSiteByIdAction());
//     try {
//         const response = await API.get(`api/site/${id}`);
//         const result = _.get(response, 'data');
//         if (result) {
//             dispatch(fetchSiteByIdSuccess(result));
//         }
//     } catch (error) {
//         checkTokenExpired(error);
//         dispatch(fetchSiteByIdError());
//     }
// };

export const createProductType = (params) => async (dispatch) => {
    dispatch(createProductTypeAction());
    try {
        const response = await API.post('pgc-service/api/product-type', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createProductTypeSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createProductTypeErrorAction(error.response.data.message));
    }
};

export const editProductType = (params) => async (dispatch) => {
    dispatch(editProductTypeByIdAction());
    try {
        const response = await API.put('pgc-service/api/product-type', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editProductTypeByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editProductTypeByIdErrorAction(error.response.data.message));
    }
};

export const activateProductType = (params) => async (dispatch) => {
    dispatch(activateProductTypeByIdAction());
    try {
        const response = await API.put(`pgc-service/api/product-type/active?id=${params.id}&active=${params.status}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(activateProductTypeByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(activateProductTypeByIdError(error.response.data.message));
    }
};
