import * as _ from 'lodash';
import {DashboardActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";
import getQueryUrl from "../../core/util/getQueryUrl";

// FETCH STATISTIC
const fetchStatisticAction = () => ({
    type: DashboardActionTypes.DO_FETCH_STATISTIC,
});

const fetchStatisticSuccessAction = (statistic) => ({
    type: DashboardActionTypes.FETCH_STATISTIC_SUCCESS,
    payload: statistic,
});

const fetchStatisticErrorAction = (error) => ({
    type: DashboardActionTypes.FETCH_STATISTIC_ERROR,
    payload: error,
});


// FETCH STATUS
const fetchStatusAction = () => ({
    type: DashboardActionTypes.DO_FETCH_STATUS,
});

const fetchStatusSuccessAction = (status) => ({
    type: DashboardActionTypes.FETCH_STATUS_SUCCESS,
    payload: status,
});

const fetchStatusErrorAction = (error) => ({
    type: DashboardActionTypes.FETCH_STATUS_ERROR,
    payload: error,
});


// FETCH TOP PRODUCT
const fetchTopProductAction = () => ({
    type: DashboardActionTypes.DO_FETCH_TOP_PRODUCT,
});

const fetchTopProductSuccessAction = (data) => ({
    type: DashboardActionTypes.FETCH_TOP_PRODUCT_SUCCESS,
    payload: data,
});

const fetchTopProductErrorAction = (error) => ({
    type: DashboardActionTypes.FETCH_TOP_PRODUCT_ERROR,
    payload: error,
});


// FETCH TOP PRODUCT TYPE
const fetchTopProductTypeAction = () => ({
    type: DashboardActionTypes.DO_FETCH_TOP_PRODUCT_TYPE,
});

const fetchTopProductTypeSuccessAction = (data) => ({
    type: DashboardActionTypes.FETCH_TOP_PRODUCT_TYPE_SUCCESS,
    payload: data,
});

const fetchTopProductTypeErrorAction = (error) => ({
    type: DashboardActionTypes.FETCH_TOP_PRODUCT_TYPE_ERROR,
    payload: error,
});


// FETCH URGENT NOTE
const fetchUrgentNoteAction = () => ({
    type: DashboardActionTypes.DO_FETCH_URGENT_NOTE,
});

const fetchUrgentNoteSuccessAction = (data) => ({
    type: DashboardActionTypes.FETCH_URGENT_NOTE_SUCCESS,
    payload: data,
});

const fetchUrgentNoteErrorAction = (error) => ({
    type: DashboardActionTypes.FETCH_URGENT_NOTE_ERROR,
    payload: error,
});



export const fetchStatistic = (params) => async (dispatch) => {
    dispatch(fetchStatisticAction());
    try {
        const response = await axios.get(decodeURIComponent(getQueryUrl('pgc-service/api/statistic/admin/overview', params)));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchStatisticSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchStatisticErrorAction(error.response.data.message));
    }
};

export const fetchTopProduct = (params) => async (dispatch) => {
    dispatch(fetchTopProductAction());
    try {
        const response = await axios.get(decodeURIComponent(getQueryUrl('pgc-service/api/statistic/admin/top-product', params)));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchTopProductSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchTopProductErrorAction(error.response.data.message));
    }
};

export const fetchTopProductType = (params) => async (dispatch) => {
    dispatch(fetchTopProductTypeAction());
    try {
        const response = await axios.get(decodeURIComponent(getQueryUrl('pgc-service/api/statistic/admin/top-product-type', params)));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchTopProductTypeSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchTopProductTypeErrorAction(error.response.data.message));
    }
};

export const fetchStatus = () => async (dispatch) => {
    dispatch(fetchStatusAction());
    try {
        const response = await API.get('pgc-service/api/order/admin/statistic');
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchStatusSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchStatusErrorAction(error.response.data.message));
    }
};

export const fetchUrgentNote = () => async (dispatch) => {
    dispatch(fetchUrgentNoteAction());
    try {
        const response = await API.get('pgc-service/api/news/urgent-note');
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchUrgentNoteSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchUrgentNoteErrorAction(error.response.data.message));
    }
};

