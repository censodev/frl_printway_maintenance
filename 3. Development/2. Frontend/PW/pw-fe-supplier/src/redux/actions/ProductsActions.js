import * as _ from 'lodash';
import {ProductsActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';


// FETCH ALL PDT NO PAGING
const fetchAllProductTypeNoPagingAction = () => ({
    type: ProductsActionTypes.DO_FETCH_ALL_PRODUCT_TYPE_NO_PAGING,
});

const fetchAllProductTypeNoPagingSuccessAction = (data) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_NO_PAGING_SUCCESS,
    payload: data,
});

const fetchAllProductTypeNoPagingErrorAction = (error) => ({
    type: ProductsActionTypes.FETCH_ALL_PRODUCT_TYPE_NO_PAGING_ERROR,
    payload: error,
});

export const fetchAllProductTypeNoPaging = () => async (dispatch) => {
    dispatch(fetchAllProductTypeNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/product-type/list`);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllProductTypeNoPagingSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllProductTypeNoPagingErrorAction(error.response.data.message));
    }
};
