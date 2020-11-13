import * as _ from 'lodash';
import {CategoriesActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";

// FETCH ALL Category
const fetchAllCategoriesAction = () => ({
    type: CategoriesActionTypes.DO_FETCH_ALL_CATEGORIES,
});

const fetchAllCategoriesSuccessAction = (categories) => ({
    type: CategoriesActionTypes.FETCH_ALL_CATEGORIES_SUCCESS,
    payload: categories,
});

const fetchAllCategoriesErrorAction = (error) => ({
    type: CategoriesActionTypes.FETCH_ALL_CATEGORIES_ERROR,
    payload: error,
});

// FETCH ALL NO PAGING
const fetchAllCategoriesNoPagingAction = () => ({
    type: CategoriesActionTypes.DO_FETCH_ALL_CATEGORIES_NO_PAGING,
});

const fetchAllCategoriesNoPagingSuccessAction = (categories) => ({
    type: CategoriesActionTypes.FETCH_ALL_CATEGORIES_NO_PAGING_SUCCESS,
    payload: categories,
});

const fetchAllCategoriesNoPagingErrorAction = (error) => ({
    type: CategoriesActionTypes.FETCH_ALL_CATEGORIES_NO_PAGING_ERROR,
    payload: error,
});

// CREATE CATEGORY
export const createCategoryAction = () => ({
    type: CategoriesActionTypes.DO_CREATE_CATEGORY,
});

export const createCategorySuccessAction = () => ({
    type: CategoriesActionTypes.CREATE_CATEGORY_SUCCESS,
});

export const createCategoryErrorAction = (error) => ({
    type: CategoriesActionTypes.CREATE_CATEGORY_ERROR,
    payload: error,
});

// UPDATE CATEGORY

export const editCategoryByIdAction = () => ({
    type: CategoriesActionTypes.DO_EDIT_CATEGORY,
});

export const editCategoryByIdSuccessAction = () => ({
    type: CategoriesActionTypes.EDIT_CATEGORY_SUCCESS,
});

export const editCategoryByIdErrorAction = (error) => ({
    type: CategoriesActionTypes.EDIT_CATEGORY_ERROR,
    payload: error,
});

// DELETE CATEGORY

export const deleteCategoryByIdAction = () => ({
    type: CategoriesActionTypes.DO_DELETE_CATEGORY
});

export const deleteCategoryByIdSuccess = () => ({
    type: CategoriesActionTypes.DELETE_CATEGORY_SUCCESS,
});

export const deleteCategoryByIdError = (error) => ({
    type: CategoriesActionTypes.DELETE_CATEGORY_ERROR,
    payload: error,
});


export const fetchAllCategories = (params) => async (dispatch) => {
    dispatch(fetchAllCategoriesAction());
    try {
        let url = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/category/page`) || '';
        let search_params = url.searchParams;

        for (let [key, value] of Object.entries(params)) {
            search_params.append(key, value);
        }

        const response = await axios.get(decodeURIComponent(url));
        const result = _.get(response, 'data');
        dispatch(fetchAllCategoriesSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllCategoriesErrorAction(error.response.data.message));
    }
};

export const fetchAllCategoriesNoPaging = () => async (dispatch) => {
    dispatch(fetchAllCategoriesNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/category/list`);
        const result = _.get(response, 'data');
        dispatch(fetchAllCategoriesNoPagingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllCategoriesNoPagingErrorAction(error.response.data.message));
    }
};


export const createCategory = (params) => async (dispatch) => {
    dispatch(createCategoryAction());
    try {
        const response = await API.post('pgc-service/api/category', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createCategorySuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createCategoryErrorAction(error.response.data.message));
    }
};

export const editCategory = (params) => async (dispatch) => {
    dispatch(editCategoryByIdAction());
    try {
        const response = await API.put('pgc-service/api/category', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editCategoryByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editCategoryByIdErrorAction(error.response.data.message));
    }
};

export const deleteCategory = (id) => async (dispatch) => {
    dispatch(deleteCategoryByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/category/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteCategoryByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteCategoryByIdError(error.response.data.message));
    }
};

