/**
 * Auth actions
 * */
import * as _ from 'lodash';
import {AuthActionTypes} from '../actionTypes';
import Api from '../../core/util/Api';
import checkTokenExpired from "../../core/util/checkTokenExpired";
// import {createDepositAction, createDepositErrorAction, createDepositSuccessAction} from "./TransactionActions";
// import Axios from "axios";
// import setAuthorizationToken from '../../core/util/setAuthorizationToken';
// import { runBackTestErrorAction } from './BackTestActions';

// REGISTER
const registerAction = () => ({
    type: AuthActionTypes.DO_REGISTER,
});

const registerSucessAction = () => ({
    type: AuthActionTypes.REGISTER_SUCCESS,
});

const registerErrorAction = (error) => ({
    type: AuthActionTypes.REGISTER_ERROR,
    payload: error,
});

// LOGIN
const loginAction = () => ({
    type: AuthActionTypes.DO_LOGIN,
});

const loginSuccessAction = (token) => ({
    type: AuthActionTypes.LOGIN_SUCCESS,
    payload: token,
});

const loginErrorAction = (error) => ({
    type: AuthActionTypes.LOGIN_ERROR,
    payload: error,
});

// LOGOUT
export const logoutAction = () => ({
    type: AuthActionTypes.LOGOUT,
});

// ACTIVATE
const activateAction = () => ({
    type: AuthActionTypes.DO_ACTIVATE,
});

const activateSucessAction = () => ({
    type: AuthActionTypes.ACTIVATE_SUCCESS,
});

const activateErrorAction = (error) => ({
    type: AuthActionTypes.ACTIVATE_ERROR,
    payload: error,
});

// GET INFO
const fetchInfoAction = () => ({
    type: AuthActionTypes.DO_FETCH_INFO,
});

const fetchInfoSuccessAction = (info) => ({
    type: AuthActionTypes.FETCH_INFO_SUCCESS,
    payload: info,
});

const fetchInfoErrorAction = (error) => ({
    type: AuthActionTypes.FETCH_INFO_ERROR,
    payload: error,
});

// FORGOT PASS
const forgotPassAction = () => ({
    type: AuthActionTypes.DO_FORGOT_INIT
});

const forgotPassSuccessAction = () => ({
    type: AuthActionTypes.FORGOT_INIT_SUCCESS,
});

const forgotPassErrorAction = (error) => ({
    type: AuthActionTypes.FORGOT_INIT_ERROR,
    payload: error,
});


// CHANGE PASS

const changePassAction = () => ({
    type: AuthActionTypes.DO_CHANGE_PASS
});

const changePassSuccessAction = () => ({
    type: AuthActionTypes.CHANGE_PASS_SUCCESS,
});

const changePassErrorAction = (error) => ({
    type: AuthActionTypes.CHANGE_PASS_ERROR,
    payload: error,
});



export const login = (params) => async (dispatch) => {
    dispatch(loginAction());
    try {
        const res = await Api.post('api/authenticate', params);
        const result = _.get(res, 'data');
        const token = _.get(result, 'id_token', '');
        if (token) {
            localStorage.setItem('id_token', token);
            dispatch(loginSuccessAction(token));
        } else {
            dispatch(loginErrorAction('Token not found!'));
        }
    } catch (e) {
        dispatch(loginErrorAction(e.response.data.message === 'error.http.401' ? 'Username or Password is incorrect!' : e.response.data.message));
    }
};

export const register = (params) => async (dispatch) => {
    dispatch(registerAction());
    try {
        const res = await Api.post('api/register', params);
        const status = _.get(res, 'status');
        if (status === 201) {
            dispatch(registerSucessAction());
        }
    } catch (e) {
        dispatch(registerErrorAction(e.response.data.message));
    }
};

export const activate = (key) => async (dispatch) => {
    dispatch(activateAction());
    try {
        const res = await Api.get(`api/activate?key=${key}`);
        const status = _.get(res, 'status');
        if (status === 200) {
            dispatch(activateSucessAction());
        }
    } catch (e) {
        dispatch(activateErrorAction(e.response.data.message));
    }
};

export const fetchUserInfo = () => async (dispatch) => {
    dispatch(fetchInfoAction());
    try {
        const res = await Api.get('pgc-service/api/user');
        const status = _.get(res, 'status');
        if (status === 200) {
            dispatch(fetchInfoSuccessAction(res.data));
            const result = _.get(res, 'data');
            if (result.roles && Array.isArray(result.roles) && !result.roles.includes('ROLE_SUPPLIER')) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    } catch (e) {
        dispatch(fetchInfoErrorAction(e.response.data.message));
    }
};

export const forgotPass = (params) => async (dispatch) => {
    dispatch(forgotPassAction());
    try {
        const response = await Api.post('api/account/reset-password/init', params);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(forgotPassSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(forgotPassErrorAction(error.response.data.message));
    }
};

export const resetPass = (params) => async (dispatch) => {
    dispatch(changePassAction());
    try {
        const response = await Api.post('api/account/reset-password/finish', params);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(changePassSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(changePassErrorAction(error.response.data.message));
    }
};
