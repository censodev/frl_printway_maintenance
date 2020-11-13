import {fromJS} from 'immutable';

import {UsersActionTypes} from '../actionTypes';

const initialState = fromJS({
    listUsers: {
        users: [],
        totalElements: 0,
        error: null,
        loading: false,
    },
    exportLoading: false,
    exportSuccess: false,
    exportError: null,
    createLoading: false,
    createSuccess: false,
    createError: null,
    editLoading: false,
    editSuccess: false,
    editError: null,
    // deleteLoading: false,
    // deleteSuccess: false,
    // deleteError: null,
    lockLoading: false,
    lockSuccess: false,
    lockError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const users = (state = initialState, action) => {
    switch (action.type) {
        case UsersActionTypes.DO_FETCH_ALL_USERS:
            return state
                .setIn(['listUsers', 'loading'], true)
                .setIn(['listUsers', 'success'], false);

        case UsersActionTypes.FETCH_ALL_USERS_SUCCESS:
            return state
                .setIn(['listUsers', 'loading'], false)
                .setIn(['listUsers', 'success'], true)
                .setIn(['listUsers', 'users'], action.payload.content)
                .setIn(['listUsers', 'totalElements'], action.payload.totalElements);

        case UsersActionTypes.FETCH_ALL_USERS_ERROR:
            return state
                .setIn(['listUsers', 'loading'], false)
                .setIn(['listUsers', 'error'], action.payload);

        case UsersActionTypes.DO_CREATE_USER:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case UsersActionTypes.CREATE_USER_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case UsersActionTypes.CREATE_USER_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case UsersActionTypes.DO_EDIT_USER:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case UsersActionTypes.EDIT_USER_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case UsersActionTypes.EDIT_USER_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);

        case UsersActionTypes.DO_EXPORT_USERS:
            return state
                .setIn(['exportLoading'], true)
                .setIn(['exportError'], null);

        case UsersActionTypes.EXPORT_USERS_SUCCESS:
            return state.setIn(['exportLoading'], false)
                .setIn(['exportSuccess'], true);

        case UsersActionTypes.EXPORT_USERS_ERROR:
            return state
                .setIn(['exportLoading'], false)
                .setIn(['exportError'], action.payload);


        // case UsersActionTypes.DO_DELETE_USER:
        //     return state
        //         .setIn(['deleteLoading'], true)
        //         .setIn(['deleteSuccess'], false)
        //         .setIn(['deleteError'], null);
        //
        // case UsersActionTypes.DELETE_USER_SUCCESS:
        //     return state
        //         .setIn(['deleteLoading'], false)
        //         .setIn(['deleteSuccess'], true);
        //
        // case UsersActionTypes.DELETE_USER_ERROR:
        //     return state
        //         .setIn(['deleteLoading'], false)
        //         .setIn(['deleteError'], action.payload);

        case UsersActionTypes.DO_LOCK_USER:
            return state
                .setIn(['lockLoading'], true)
                .setIn(['lockSuccess'], false)
                .setIn(['lockError'], null);

        case UsersActionTypes.LOCK_USER_SUCCESS:
            return state
                .setIn(['lockLoading'], false)
                .setIn(['lockSuccess'], true);

        case UsersActionTypes.LOCK_USER_ERROR:
            return state
                .setIn(['lockLoading'], false)
                .setIn(['lockError'], action.payload);

        default:
            return state;
    }
};
