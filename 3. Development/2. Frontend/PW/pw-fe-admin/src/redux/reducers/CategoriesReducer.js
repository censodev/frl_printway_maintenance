import {fromJS} from 'immutable';

import {CategoriesActionTypes} from '../actionTypes';

const initialState = fromJS({
    listCategories: {
        categories: [],
        totalElements: 0,
        error: null,
        loading: false,
    },
    listCategoriesNoPaging: {
        categories: [],
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
export const categories = (state = initialState, action) => {
    switch (action.type) {
        case CategoriesActionTypes.DO_FETCH_ALL_CATEGORIES:
            return state
                .setIn(['listCategories', 'loading'], true)
                .setIn(['listCategories', 'success'], false);

        case CategoriesActionTypes.FETCH_ALL_CATEGORIES_SUCCESS:
            return state
                .setIn(['listCategories', 'loading'], false)
                .setIn(['listCategories', 'success'], true)
                .setIn(['listCategories', 'categories'], action.payload.content)
                .setIn(['listCategories', 'totalElements'], action.payload.totalElements);

        case CategoriesActionTypes.FETCH_ALL_CATEGORIES_ERROR:
            return state
                .setIn(['listCategories', 'loading'], false)
                .setIn(['listCategories', 'error'], action.payload);

        case CategoriesActionTypes.DO_FETCH_ALL_CATEGORIES_NO_PAGING:
            return state
                .setIn(['listCategoriesNoPaging', 'loading'], true)
                .setIn(['listCategoriesNoPaging', 'success'], false);

        case CategoriesActionTypes.FETCH_ALL_CATEGORIES_NO_PAGING_SUCCESS:
            return state
                .setIn(['listCategoriesNoPaging', 'loading'], false)
                .setIn(['listCategoriesNoPaging', 'success'], true)
                .setIn(['listCategoriesNoPaging', 'categories'], action.payload);

        case CategoriesActionTypes.FETCH_ALL_CATEGORIES_NO_PAGING_ERROR:
            return state
                .setIn(['listCategoriesNoPaging', 'loading'], false)
                .setIn(['listCategoriesNoPaging', 'error'], action.payload);

        case CategoriesActionTypes.DO_CREATE_CATEGORY:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case CategoriesActionTypes.CREATE_CATEGORY_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case CategoriesActionTypes.CREATE_CATEGORY_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case CategoriesActionTypes.DO_EDIT_CATEGORY:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case CategoriesActionTypes.EDIT_CATEGORY_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case CategoriesActionTypes.EDIT_CATEGORY_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);


        case CategoriesActionTypes.DO_DELETE_CATEGORY:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case CategoriesActionTypes.DELETE_CATEGORY_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case CategoriesActionTypes.DELETE_CATEGORY_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        default:
            return state;
    }
};
