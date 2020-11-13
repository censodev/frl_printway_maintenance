import {fromJS} from 'immutable';

import {CarriesActionTypes} from '../actionTypes';

const initialState = fromJS({
    listCarries: {
        carries: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false,
    },
    // currentSite: {site: {}, error: null, loading: false},
    listCarriesNoPaging: {
        carries: [],
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
    activeLoading: false,
    activeSuccess: false,
    activeError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const carries = (state = initialState, action) => {
    switch (action.type) {
        case CarriesActionTypes.DO_FETCH_ALL_CARRIES:
            return state
                .setIn(['listCarries', 'loading'], true)
                .setIn(['listCarries', 'success'], false);

        case CarriesActionTypes.FETCH_ALL_CARRIES_SUCCESS:
            return state
                .setIn(['listCarries', 'loading'], false)
                .setIn(['listCarries', 'success'], true)
                .setIn(['listCarries', 'carries'], action.payload.content)
                .setIn(['listCarries', 'totalElements'], action.payload.totalElements);

        case CarriesActionTypes.FETCH_ALL_CARRIES_ERROR:
            return state
                .setIn(['listCarries', 'loading'], false)
                .setIn(['listCarries', 'error'], action.payload);

        // case CarriesActionTypes.DO_FETCH_SITE:
        //     return state.setIn(['currentSite', 'loading'], true);
        //
        // case CarriesActionTypes.FETCH_SITE_SUCCESS:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], null)
        //         .setIn(['currentSite', 'site'], action.payload);
        //
        // case CarriesActionTypes.FETCH_SITE_ERROR:
        //     return state
        //         .setIn(['currentSite', 'loading'], false)
        //         .setIn(['currentSite', 'error'], action.payload);

        case CarriesActionTypes.DO_FETCH_ALL_CARRIERS_NO_PAGING:
            return state
                .setIn(['listCarriesNoPaging', 'loading'], true)
                .setIn(['listCarriesNoPaging', 'success'], false);

        case CarriesActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_SUCCESS:
            return state
                .setIn(['listCarriesNoPaging', 'loading'], false)
                .setIn(['listCarriesNoPaging', 'success'], true)
                .setIn(['listCarriesNoPaging', 'carries'], action.payload);

        case CarriesActionTypes.FETCH_ALL_CARRIERS_NO_PAGING_ERROR:
            return state
                .setIn(['listCarriesNoPaging', 'loading'], false)
                .setIn(['listCarriesNoPaging', 'error'], action.payload);

        case CarriesActionTypes.DO_EDIT_CARRIE:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case CarriesActionTypes.EDIT_CARRIE_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case CarriesActionTypes.EDIT_CARRIE_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);

        case CarriesActionTypes.DO_CREATE_CARRIE:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case CarriesActionTypes.CREATE_CARRIE_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case CarriesActionTypes.CREATE_CARRIE_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case CarriesActionTypes.DO_DELETE_CARRIE:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case CarriesActionTypes.DELETE_CARRIE_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case CarriesActionTypes.DELETE_CARRIE_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        case CarriesActionTypes.DO_HANDLE_CARRIE:
            return state
                .setIn(['activeLoading'], true)
                .setIn(['activeSuccess'], false)
                .setIn(['activeError'], null);

        case CarriesActionTypes.HANDLE_CARRIE_SUCCESS:
            return state
                .setIn(['activeLoading'], false)
                .setIn(['activeSuccess'], true);

        case CarriesActionTypes.HANDLE_CARRIE_ERROR:
            return state
                .setIn(['activeLoading'], false)
                .setIn(['activeError'], action.payload);

        default:
            return state;
    }
};
