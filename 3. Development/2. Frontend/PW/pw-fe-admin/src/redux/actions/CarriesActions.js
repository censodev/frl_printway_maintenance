import * as _ from 'lodash';
import {CarriesActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";

// FETCH ALL CARRIER
const fetchAllCarriesAction = () => ({
    type: CarriesActionTypes.DO_FETCH_ALL_CARRIES,
});

const fetchAllCarriesSuccessAction = (categories) => ({
    type: CarriesActionTypes.FETCH_ALL_CARRIES_SUCCESS,
    payload: categories,
});

const fetchAllCarriesErrorAction = (error) => ({
    type: CarriesActionTypes.FETCH_ALL_CARRIES_ERROR,
    payload: error,
});

// FETCH NO PAGING

const fetchAllCarriesNoPagingAction = () => ({
    type: CarriesActionTypes.DO_FETCH_ALL_CARRIERS_NO_PAGING,
});

const fetchAllCarriesNoPagingSuccessAction = (carriers) => ({
    type: CarriesActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_SUCCESS,
    payload: carriers,
});

const fetchAllCarriesNoPagingErrorAction = (error) => ({
    type: CarriesActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_ERROR,
    payload: error,
});

// CREATE CARRIER
export const createCarrieAction = () => ({
    type: CarriesActionTypes.DO_CREATE_CARRIE,
});

export const createCarrieSuccessAction = () => ({
    type: CarriesActionTypes.CREATE_CARRIE_SUCCESS,
});

export const createCarrieErrorAction = (error) => ({
    type: CarriesActionTypes.CREATE_CARRIE_ERROR,
    payload: error,
});

// UPDATE CARRIER

export const editCarrieByIdAction = () => ({
    type: CarriesActionTypes.DO_EDIT_CARRIE,
});

export const editCarrieByIdSuccessAction = () => ({
    type: CarriesActionTypes.EDIT_CARRIE_SUCCESS,
});

export const editCarrieByIdErrorAction = (error) => ({
    type: CarriesActionTypes.EDIT_CARRIE_ERROR,
    payload: error,
});

// DELETE CARRIER

export const deleteCarrieByIdAction = () => ({
    type: CarriesActionTypes.DO_DELETE_CARRIE
});

export const deleteCarrieByIdSuccess = () => ({
    type: CarriesActionTypes.DELETE_CARRIE_SUCCESS,
});

export const deleteCarrieByIdError = (error) => ({
    type: CarriesActionTypes.DELETE_CARRIE_ERROR,
    payload: error,
});


// ACTIVE CARRIER

export const activeCarrieByIdAction = () => ({
    type: CarriesActionTypes.DO_HANDLE_CARRIE
});

export const activeCarrieByIdSuccess = () => ({
    type: CarriesActionTypes.HANDLE_CARRIE_SUCCESS,
});

export const activeCarrieByIdError = (error) => ({
    type: CarriesActionTypes.HANDLE_CARRIE_ERROR,
    payload: error,
});


export const fetchAllCarries = (params) => async (dispatch) => {
    dispatch(fetchAllCarriesAction());
    try {
        let url = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/carrier/page`) || '';
        let search_params = url.searchParams;

        for (let [key, value] of Object.entries(params)) {
            search_params.append(key, value);
        }

        const response = await axios.get(decodeURIComponent(url));
        const result = _.get(response, 'data');
        dispatch(fetchAllCarriesSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllCarriesErrorAction(error.response.data.message));
    }
};

export const fetchAllCarriesNoPaging = () => async (dispatch) => {
    dispatch(fetchAllCarriesNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/carrier/list`);
        const result = _.get(response, 'data');
        dispatch(fetchAllCarriesNoPagingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllCarriesNoPagingErrorAction(error.response.data.message));
    }
};


export const createCarrie = (params) => async (dispatch) => {
    dispatch(createCarrieAction());
    try {
        const response = await API.post('pgc-service/api/carrier', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createCarrieSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createCarrieErrorAction(error.response.data.message));
    }
};

export const editCarrie = (params) => async (dispatch) => {
    dispatch(editCarrieByIdAction());
    try {
        const response = await API.put('pgc-service/api/carrier', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editCarrieByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editCarrieByIdErrorAction(error.response.data.message));
    }
};

export const deleteCarrie = (id) => async (dispatch) => {
    dispatch(deleteCarrieByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/carrier/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteCarrieByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteCarrieByIdError(error.response.data.message));
    }
};

export const activeCarrie = (params) => async (dispatch) => {
    dispatch(activeCarrieByIdAction());
    try {
        const response = await API.get(`pgc-service/api/carrier/active?id=${params.id}&active=${params.active}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(activeCarrieByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(activeCarrieByIdError(error.response.data.message));
    }
};

