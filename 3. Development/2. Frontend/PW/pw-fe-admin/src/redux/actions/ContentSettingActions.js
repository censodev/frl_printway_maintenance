import * as _ from 'lodash';
import { ContentSettingActionTypes } from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';

// FETCH ALL CONTENT SETTING
const fetchAllContentSettingAction = () => ({
    type: ContentSettingActionTypes.DO_FETCH_ALL_CONTENT_SETTING,
});

const fetchAllContentSettingSuccessAction = (settings) => ({
    type: ContentSettingActionTypes.FETCH_ALL_CONTENT_SETTING_SUCCESS,
    payload: settings,
});

const fetchAllContentSettingErrorAction = (error) => ({
    type: ContentSettingActionTypes.FETCH_ALL_CONTENT_SETTING_ERROR,
    payload: error,
});
// UPDATE CONTENT

export const editContentSettingByIdAction = () => ({
    type: ContentSettingActionTypes.DO_EDIT_CONTENT_SETTING,
});

export const editContentSettingByIdSuccessAction = () => ({
    type: ContentSettingActionTypes.EDIT_CONTENT_SETTING_SUCCESS,
});

export const editContentSettingByIdErrorAction = (error) => ({
    type: ContentSettingActionTypes.EDIT_CONTENT_SETTING_ERROR,
    payload: error,
});
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
