import * as _ from 'lodash';
import {ProfileActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';

// FETCH ALL NOTIFICATION SETTING
const fetchAllNotificationSettingAction = () => ({
    type: ProfileActionTypes.DO_FETCH_ALL_NOTIFICATION_SETTING,
});

const fetchAllNotificationSettingSuccessAction = (settings) => ({
    type: ProfileActionTypes.FETCH_ALL_NOTIFICATION_SETTING_SUCCESS,
    payload: settings,
});

const fetchAllNotificationSettingErrorAction = (error) => ({
    type: ProfileActionTypes.FETCH_ALL_NOTIFICATION_SETTING_ERROR,
    payload: error,
});

// FETCH ALL CONTENT SETTING
const fetchAllContentSettingAction = () => ({
    type: ProfileActionTypes.DO_FETCH_ALL_CONTENT_SETTING,
});

const fetchAllContentSettingSuccessAction = (settings) => ({
    type: ProfileActionTypes.FETCH_ALL_CONTENT_SETTING_SUCCESS,
    payload: settings,
});

const fetchAllContentSettingErrorAction = (error) => ({
    type: ProfileActionTypes.FETCH_ALL_CONTENT_SETTING_ERROR,
    payload: error,
});

// UPDATE NOTIFICATION

export const editNotificationSettingByIdAction = () => ({
    type: ProfileActionTypes.DO_EDIT_NOTIFICATION_SETTING,
});

export const editNotificationSettingByIdSuccessAction = () => ({
    type: ProfileActionTypes.EDIT_NOTIFICATION_SETTING_SUCCESS,
});

export const editNotificationSettingByIdErrorAction = (error) => ({
    type: ProfileActionTypes.EDIT_NOTIFICATION_SETTING_ERROR,
    payload: error,
});


// UPDATE CONTENT

export const editContentSettingByIdAction = () => ({
    type: ProfileActionTypes.DO_EDIT_CONTENT_SETTING,
});

export const editContentSettingByIdSuccessAction = () => ({
    type: ProfileActionTypes.EDIT_CONTENT_SETTING_SUCCESS,
});

export const editContentSettingByIdErrorAction = (error) => ({
    type: ProfileActionTypes.EDIT_CONTENT_SETTING_ERROR,
    payload: error,
});

// UPDATE USER INFO

export const editUserInfoAction = () => ({
    type: ProfileActionTypes.DO_EDIT_USER_INFO
});

export const editUserInfoSuccessAction = () => ({
    type: ProfileActionTypes.EDIT_USER_INFO_SUCCESS,
});

export const editUserInfoErrorAction = (error) => ({
    type: ProfileActionTypes.EDIT_USER_INFO_ERROR,
    payload: error,
});

// UPDATE PASSWORD

export const editPassAction = () => ({
    type: ProfileActionTypes.DO_EDIT_PASS
});

export const editPassSuccessAction = () => ({
    type: ProfileActionTypes.EDIT_PASS_SUCCESS,
});

export const editPassErrorAction = (error) => ({
    type: ProfileActionTypes.EDIT_PASS_ERROR,
    payload: error,
});



export const fetchAllNotificationSetting = () => async (dispatch) => {
    dispatch(fetchAllNotificationSettingAction());
    try {
        const response = await API.get(`pgc-service/api/config/notification`);
        const result = _.get(response, 'data');

        dispatch(fetchAllNotificationSettingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllNotificationSettingErrorAction(error.response.data.message));
    }
};

export const fetchAllContentSetting = () => async (dispatch) => {
    dispatch(fetchAllContentSettingAction());
    try {
        const response = await API.get(`pgc-service/api/config/content`);
        const result = _.get(response, 'data');

        dispatch(fetchAllContentSettingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllContentSettingErrorAction(error.response.data.message));
    }
};

export const editNotificationSetting = (params) => async (dispatch) => {
    dispatch(editNotificationSettingByIdAction());
    try {
        const response = await API.put('pgc-service/api/config/notification', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editNotificationSettingByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editNotificationSettingByIdErrorAction(error.response.data.message));
    }
};

export const editContentSetting = (params) => async (dispatch) => {
    dispatch(editContentSettingByIdAction());
    try {
        const response = await API.put('pgc-service/api/config/content', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editContentSettingByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editContentSettingByIdErrorAction(error.response.data.message));
    }
};

export const editUserInfo = (params) => async (dispatch) => {
    dispatch(editUserInfoAction());
    try {
        const response = await API.put('pgc-service/api/config/content', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editUserInfoSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editUserInfoErrorAction(error.response.data.message));
    }
};

export const editPassword = (params) => async (dispatch) => {
    dispatch(editPassAction());
    try {
        const response = await API.post('api/account/change-password', params);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(editPassSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editPassErrorAction(error.response.data.message));
    }
};


