import * as _ from 'lodash';
import {NewsActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";

// FETCH ALL NEW
const fetchAllNewsAction = () => ({
    type: NewsActionTypes.DO_FETCH_ALL_NEWS,
});

const fetchAllNewsSuccessAction = (NEWS) => ({
    type: NewsActionTypes.FETCH_ALL_NEWS_SUCCESS,
    payload: NEWS,
});

const fetchAllNewsErrorAction = (error) => ({
    type: NewsActionTypes.FETCH_ALL_NEWS_ERROR,
    payload: error,
});

// CREATE NEW
export const createNewAction = () => ({
    type: NewsActionTypes.DO_CREATE_NEW,
});

export const createNewSuccessAction = () => ({
    type: NewsActionTypes.CREATE_NEW_SUCCESS,
});

export const createNewErrorAction = (error) => ({
    type: NewsActionTypes.CREATE_NEW_ERROR,
    payload: error,
});

// UPDATE NEW

export const editNewByIdAction = () => ({
    type: NewsActionTypes.DO_EDIT_NEW,
});

export const editNewByIdSuccessAction = () => ({
    type: NewsActionTypes.EDIT_NEW_SUCCESS,
});

export const editNewByIdErrorAction = (error) => ({
    type: NewsActionTypes.EDIT_NEW_ERROR,
    payload: error,
});

// DELETE NEW

export const deleteNewByIdAction = () => ({
    type: NewsActionTypes.DO_DELETE_NEW
});

export const deleteNewByIdSuccess = () => ({
    type: NewsActionTypes.DELETE_NEW_SUCCESS,
});

export const deleteNewByIdError = (error) => ({
    type: NewsActionTypes.DELETE_NEW_ERROR,
    payload: error,
});

// FETCH TOP NEW
const fetchTopNewsAction = () => ({
    type: NewsActionTypes.DO_FETCH_TOP_NEWS,
});

const fetchTopNewsSuccessAction = (news) => ({
    type: NewsActionTypes.FETCH_TOP_NEWS_SUCCESS,
    payload: news,
});

const fetchTopNewsErrorAction = (error) => ({
    type: NewsActionTypes.FETCH_TOP_NEWS_ERROR,
    payload: error,
});


export const fetchAllNews = (params) => async (dispatch) => {
    dispatch(fetchAllNewsAction());
    try {
        let url = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/news/page`) || '';
        let search_params = url.searchParams;

        for (let [key, value] of Object.entries(params)) {
            search_params.append(key, value);
        }

        const response = await axios.get(decodeURIComponent(url));
        const result = _.get(response, 'data');
        dispatch(fetchAllNewsSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllNewsErrorAction(error.response.data.message));
    }
};


export const createNew = (params) => async (dispatch) => {
    dispatch(createNewAction());
    try {
        const response = await API.post('pgc-service/api/news', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createNewSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createNewErrorAction(error.response.data.message));
    }
};

export const editNew = (params) => async (dispatch) => {
    dispatch(editNewByIdAction());
    try {
        const response = await API.put('pgc-service/api/news', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editNewByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editNewByIdErrorAction(error.response.data.message));
    }
};

export const deleteNew = (id) => async (dispatch) => {
    dispatch(deleteNewByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/news/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteNewByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteNewByIdError(error.response.data.message));
    }
};

export const fetchTopNews = () => async (dispatch) => {
    dispatch(fetchTopNewsAction());
    try {
        const response = await API.get('pgc-service/api/news/top');
        const result = _.get(response, 'data');
        dispatch(fetchTopNewsSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchTopNewsErrorAction(error.response.data.message));
    }
};


