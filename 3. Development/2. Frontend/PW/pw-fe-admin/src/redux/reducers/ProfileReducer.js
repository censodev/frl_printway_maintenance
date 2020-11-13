import {fromJS} from 'immutable';

import {ProfileActionTypes} from '../actionTypes';

const initialState = fromJS({
    listNotificationSetting: {
        settings: [],
        error: null,
        loading: false,
        success: false,
    },
    listContentSetting: {
        settings: [],
        error: null,
        loading: false,
        success: false,
    },
    // createLoading: false,
    // createSuccess: false,
    // createError: null,
    editNotificationLoading: false,
    editNotificationSuccess: false,
    editNotificationError: null,
    editContentLoading: false,
    editContentSuccess: false,
    editContentError: null,
    editUserInfoLoading: false,
    editUserInfoSuccess: false,
    editUserInfoError: null,
    editPassLoading: false,
    editPassSuccess: false,
    editPassError: null,
    // deleteLoading: false,
    // deleteSuccess: false,
    // deleteError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const profile = (state = initialState, action) => {
    switch (action.type) {
        case ProfileActionTypes.DO_FETCH_ALL_NOTIFICATION_SETTING:
            return state
                .setIn(['listNotificationSetting', 'loading'], true)
                .setIn(['listNotificationSetting', 'success'], false);

        case ProfileActionTypes.FETCH_ALL_NOTIFICATION_SETTING_SUCCESS:
            return state
                .setIn(['listNotificationSetting', 'loading'], false)
                .setIn(['listNotificationSetting', 'success'], true)
                .setIn(['listNotificationSetting', 'settings'], action.payload);

        case ProfileActionTypes.FETCH_ALL_NOTIFICATION_SETTING_ERROR:
            return state
                .setIn(['listNotificationSetting', 'loading'], false)
                .setIn(['listNotificationSetting', 'error'], action.payload);

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


        case ProfileActionTypes.DO_EDIT_NOTIFICATION_SETTING:
            return state
                .setIn(['editNotificationLoading'], true)
                .setIn(['editNotificationSuccess'], false)
                .setIn(['editNotificationError'], null);

        case ProfileActionTypes.EDIT_NOTIFICATION_SETTING_SUCCESS:
            return state.setIn(['editNotificationLoading'], false)
                .setIn(['editNotificationSuccess'], true);

        case ProfileActionTypes.EDIT_NOTIFICATION_SETTING_ERROR:
            return state
                .setIn(['editNotificationLoading'], false)
                .setIn(['editNotificationError'], action.payload);

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

        case ProfileActionTypes.DO_EDIT_USER_INFO:
            return state
                .setIn(['editUserInfoLoading'], true)
                .setIn(['editUserInfoSuccess'], false)
                .setIn(['editUserInfoError'], null);

        case ProfileActionTypes.EDIT_USER_INFO_SUCCESS:
            return state.setIn(['editUserInfoLoading'], false)
                .setIn(['editUserInfoSuccess'], true);

        case ProfileActionTypes.EDIT_USER_INFO_ERROR:
            return state
                .setIn(['editUserInfoLoading'], false)
                .setIn(['editUserInfoError'], action.payload);

        case ProfileActionTypes.DO_EDIT_PASS:
            return state
                .setIn(['editPassLoading'], true)
                .setIn(['editPassSuccess'], false)
                .setIn(['editPassError'], null);

        case ProfileActionTypes.EDIT_PASS_SUCCESS:
            return state.setIn(['editPassLoading'], false)
                .setIn(['editPassSuccess'], true);

        case ProfileActionTypes.EDIT_PASS_ERROR:
            return state
                .setIn(['editPassLoading'], false)
                .setIn(['editPassError'], action.payload);
        // case SiteActionTypes.DO_FETCH_SITE:
        //     return state.setIn(['currentSite', 'loading'], true);
        //
        // case SiteActionTypes.FETCH_SITE_SUCCESS:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], null)
        //         .setIn(['currentSite', 'site'], action.payload);
        //
        // case SiteActionTypes.FETCH_SITE_ERROR:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], action.payload);
        //
        // case SiteActionTypes.DO_EDIT_SITE:
        //     return state
        //         .setIn(['editLoading'], true)
        //         .setIn(['editSuccess'], false)
        //         .setIn(['editError'], null);
        //
        // case SiteActionTypes.EDIT_SITE_SUCCESS:
        //     return state.setIn(['editLoading'], false)
        //         .setIn(['editSuccess'], true);
        //
        // case SiteActionTypes.EDIT_SITE_ERROR:
        //     return state
        //         .setIn(['editLoading'], false)
        //         .setIn(['editError'], action.payload);
        //
        // case SiteActionTypes.DO_CREATE_SITE:
        //     return state
        //         .setIn(['createLoading'], true)
        //         .setIn(['createSuccess'], false)
        //         .setIn(['createError'], null);
        //
        // case SiteActionTypes.CREATE_SITE_SUCCESS:
        //     return state
        //         .setIn(['createLoading'], false)
        //         .setIn(['createSuccess'], true);
        //
        // case SiteActionTypes.CREATE_SITE_ERROR:
        //     return state
        //         .setIn(['createLoading'], false)
        //         .setIn(['createError'], action.payload);

        default:
            return state;
    }
};
