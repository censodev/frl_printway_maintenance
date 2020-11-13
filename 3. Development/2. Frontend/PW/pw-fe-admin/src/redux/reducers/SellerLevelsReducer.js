import {fromJS} from 'immutable';

import {SellerLevelsActionTypes} from '../actionTypes';

const initialState = fromJS({
    listLevels: {
        levels: [],
        totalElements: 0,
        error: null,
        loading: false,
    },
    listLevelsNoPaging: {
        levels: [],
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
export const sellerLevels = (state = initialState, action) => {
    switch (action.type) {
        case SellerLevelsActionTypes.DO_FETCH_ALL_SELLER_LEVELS:
            return state
                .setIn(['listLevels', 'loading'], true)
                .setIn(['listLevels', 'success'], false);

        case SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_SUCCESS:
            return state
                .setIn(['listLevels', 'loading'], false)
                .setIn(['listLevels', 'success'], true)
                .setIn(['listLevels', 'levels'], action.payload.content)
                .setIn(['listLevels', 'totalElements'], action.payload.totalElements);

        case SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_ERROR:
            return state
                .setIn(['listLevels', 'loading'], false)
                .setIn(['listLevels', 'error'], action.payload);

        case SellerLevelsActionTypes.DO_FETCH_ALL_SELLER_LEVELS_NO_PAGING:
            return state
                .setIn(['listLevelsNoPaging', 'loading'], true)
                .setIn(['listLevelsNoPaging', 'success'], false);

        case SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_NO_PAGING_SUCCESS:
            return state
                .setIn(['listLevelsNoPaging', 'loading'], false)
                .setIn(['listLevelsNoPaging', 'success'], true)
                .setIn(['listLevelsNoPaging', 'levels'], action.payload);

        case SellerLevelsActionTypes.FETCH_ALL_SELLER_LEVELS_NO_PAGING_ERROR:
            return state
                .setIn(['listLevelsNoPaging', 'loading'], false)
                .setIn(['listLevelsNoPaging', 'error'], action.payload);

        case SellerLevelsActionTypes.DO_CREATE_SELLER_LEVEL:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case SellerLevelsActionTypes.CREATE_SELLER_LEVEL_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case SellerLevelsActionTypes.CREATE_SELLER_LEVEL_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case SellerLevelsActionTypes.DO_EDIT_SELLER_LEVEL:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case SellerLevelsActionTypes.EDIT_SELLER_LEVEL_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case SellerLevelsActionTypes.EDIT_SELLER_LEVEL_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);


        case SellerLevelsActionTypes.DO_DELETE_SELLER_LEVEL:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case SellerLevelsActionTypes.DELETE_SELLER_LEVEL_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case SellerLevelsActionTypes.DELETE_SELLER_LEVEL_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        default:
            return state;
    }
};
