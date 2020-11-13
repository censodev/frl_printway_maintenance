import {fromJS} from 'immutable';

import {NewsActionTypes} from '../actionTypes';

const initialState = fromJS({
    listNews: {
        news: [],
        totalElements: 0,
        error: null,
        loading: false,
    },
    listTopNews: {
        news: [],
        error: null,
        loading: false,
    },
    createLoading: false,
    createSuccess: false,
    createError: null,
    editLoading: false,
    editSuccess: false,
    editError: null,
    deleteLoading: false,
    deleteSuccess: false,
    deleteError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const news = (state = initialState, action) => {
    switch (action.type) {
        case NewsActionTypes.DO_FETCH_ALL_NEWS:
            return state
                .setIn(['listNews', 'loading'], true)
                .setIn(['listNews', 'success'], false);

        case NewsActionTypes.FETCH_ALL_NEWS_SUCCESS:
            return state
                .setIn(['listNews', 'loading'], false)
                .setIn(['listNews', 'success'], true)
                .setIn(['listNews', 'news'], action.payload.content)
                .setIn(['listNews', 'totalElements'], action.payload.totalElements);

        case NewsActionTypes.FETCH_ALL_NEWS_ERROR:
            return state
                .setIn(['listNews', 'loading'], false)
                .setIn(['listNews', 'error'], action.payload);

        case NewsActionTypes.DO_FETCH_TOP_NEWS:
            return state
                .setIn(['listTopNews', 'loading'], true)
                .setIn(['listTopNews', 'success'], false);

        case NewsActionTypes.FETCH_TOP_NEWS_SUCCESS:
            return state
                .setIn(['listTopNews', 'loading'], false)
                .setIn(['listTopNews', 'success'], true)
                .setIn(['listTopNews', 'news'], action.payload);

        case NewsActionTypes.FETCH_TOP_NEWS_ERROR:
            return state
                .setIn(['listTopNews', 'loading'], false)
                .setIn(['listTopNews', 'error'], action.payload);

        case NewsActionTypes.DO_CREATE_NEW:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case NewsActionTypes.CREATE_NEW_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case NewsActionTypes.CREATE_NEW_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case NewsActionTypes.DO_EDIT_NEW:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case NewsActionTypes.EDIT_NEW_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case NewsActionTypes.EDIT_NEW_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);


        case NewsActionTypes.DO_DELETE_NEW:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case NewsActionTypes.DELETE_NEW_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case NewsActionTypes.DELETE_NEW_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        default:
            return state;
    }
};
