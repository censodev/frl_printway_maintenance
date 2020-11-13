import {fromJS} from 'immutable';

import {ProfileActionTypes} from '../actionTypes';

const initialState = fromJS({
    listContentSetting: {
        settings: [],
        error: null,
        loading: false,
        success: false,
    },
    editContentLoading: false,
    editContentSuccess: false,
    editContentError: null,

});

// eslint-disable-next-line import/prefer-default-export
export const contentSetting = (state = initialState, action) => {
    switch (action.type) {
        case ProfileActionTypes.DO_FETCH_ALL_CONTENT_SETTING:
            return state
                .setIn(['listContentSetting', 'loading'], true)
                .setIn(['listContentSetting', 'success'], false);

        case ProfileActionTypes.FETCH_ALL_CONTENT_SETTING_SUCCESS:
            return state
                .setIn(['listContentSetting', 'loading'], false)
                .setIn(['listContentSetting', 'success'], true)
                .setIn(['listContentSetting', 'settings'], action.payload);

        case ProfileActionTypes.FETCH_ALL_CONTENT_SETTING_ERROR:
            return state
                .setIn(['listContentSetting', 'loading'], false)
                .setIn(['listContentSetting', 'error'], action.payload);

        case ProfileActionTypes.DO_EDIT_CONTENT_SETTING:
            return state
                .setIn(['editContentLoading'], true)
                .setIn(['editContentSuccess'], false)
                .setIn(['editContentError'], null);

        case ProfileActionTypes.EDIT_CONTENT_SETTING_SUCCESS:
            return state.setIn(['editContentLoading'], false)
                .setIn(['editContentSuccess'], true);

        case ProfileActionTypes.EDIT_CONTENT_SETTING_ERROR:
            return state
                .setIn(['editContentLoading'], false)
                .setIn(['editContentError'], action.payload);            
        default:
            return state;
    }
};
