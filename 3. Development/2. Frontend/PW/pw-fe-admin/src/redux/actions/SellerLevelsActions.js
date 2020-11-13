import * as _ from 'lodash';
import {SellerLevelsActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";
import getQueryUrl from "../../core/util/getQueryUrl";

// FETCH ALL
const fetchAllSellerLevelsAction = () => ({
    type: SellerLevelsActionTypes.DO_FETCH_ALL_SELLER_LEVELS,
});

const fetchAllSellerLevelsSuccessAction = (levels) => ({
    type: SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_SUCCESS,
    payload: levels,
});

const fetchAllSellerLevelsErrorAction = (error) => ({
    type: SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_ERROR,
    payload: error,
});

// FETCH ALL NO PAGING
const fetchAllSellerLevelsNoPagingAction = () => ({
    type: SellerLevelsActionTypes.DO_FETCH_ALL_SELLER_LEVELS_NO_PAGING,
});

const fetchAllSellerLevelsNoPagingSuccessAction = (categories) => ({
    type: SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_NO_PAGING_SUCCESS,
    payload: categories,
});

const fetchAllSellerLevelsNoPagingErrorAction = (error) => ({
    type: SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_NO_PAGING_ERROR,
    payload: error,
});

// CREATE
export const createSellerLevelAction = () => ({
    type: SellerLevelsActionTypes.DO_CREATE_SELLER_LEVEL,
});

export const createSellerLevelSuccessAction = () => ({
    type: SellerLevelsActionTypes.CREATE_SELLER_LEVEL_SUCCESS,
});

export const createSellerLevelErrorAction = (error) => ({
    type: SellerLevelsActionTypes.CREATE_SELLER_LEVEL_ERROR,
    payload: error,
});

// UPDATE

export const editSellerLevelByIdAction = () => ({
    type: SellerLevelsActionTypes.DO_EDIT_SELLER_LEVEL,
});

export const editSellerLevelByIdSuccessAction = () => ({
    type: SellerLevelsActionTypes.EDIT_SELLER_LEVEL_SUCCESS,
});

export const editSellerLevelByIdErrorAction = (error) => ({
    type: SellerLevelsActionTypes.EDIT_SELLER_LEVEL_ERROR,
    payload: error,
});

// DELETE

export const deleteSellerLevelByIdAction = () => ({
    type: SellerLevelsActionTypes.DO_DELETE_SELLER_LEVEL
});

export const deleteSellerLevelByIdSuccess = () => ({
    type: SellerLevelsActionTypes.DELETE_SELLER_LEVEL_SUCCESS,
});

export const deleteSellerLevelByIdError = (error) => ({
    type: SellerLevelsActionTypes.DELETE_SELLER_LEVEL_ERROR,
    payload: error,
});


export const fetchAllSellerLevels = (params) => async (dispatch) => {
    dispatch(fetchAllSellerLevelsAction());
    try {
        const response = await axios.get(decodeURIComponent(getQueryUrl('pgc-service/api/seller-level/page', params)));
        const result = _.get(response, 'data');
        dispatch(fetchAllSellerLevelsSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllSellerLevelsErrorAction(error.response.data.message));
    }
};

export const fetchAllSellerLevelsNoPaging = () => async (dispatch) => {
    dispatch(fetchAllSellerLevelsNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/seller-level/list`);
        const result = _.get(response, 'data');
        dispatch(fetchAllSellerLevelsNoPagingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllSellerLevelsNoPagingErrorAction(error.response.data.message));
    }
};


export const createSellerLevel = (params) => async (dispatch) => {
    dispatch(createSellerLevelAction());
    try {
        const response = await API.post('pgc-service/api/seller-level', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createSellerLevelSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createSellerLevelErrorAction(error.response.data.message));
    }
};

export const editSellerLevel = (params) => async (dispatch) => {
    dispatch(editSellerLevelByIdAction());
    try {
        const response = await API.put('pgc-service/api/seller-level', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editSellerLevelByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editSellerLevelByIdErrorAction(error.response.data.message));
    }
};

export const deleteSellerLevel = (id) => async (dispatch) => {
    dispatch(deleteSellerLevelByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/seller-level/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteSellerLevelByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteSellerLevelByIdError(error.response.data.message));
    }
};

