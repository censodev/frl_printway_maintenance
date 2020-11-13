import * as _ from 'lodash';
import {SupplierActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";

// FETCH ALL
const fetchAllSuppliersAction = () => ({
    type: SupplierActionTypes.DO_FETCH_ALL_SUPPLIERS,
});

const fetchAllSuppliersSuccessAction = (suppliers) => ({
    type: SupplierActionTypes.FETCH_ALL_SUPPLIERS_SUCCESS,
    payload: suppliers,
});

const fetchAllSuppliersErrorAction = (error) => ({
    type: SupplierActionTypes.FETCH_ALL_SUPPLIERS_ERROR,
    payload: error,
});

const fetchAllSuppliersNoPagingAction = () => ({
    type: SupplierActionTypes.DO_FETCH_ALL_SUPPLIERS_NO_PAGING,
});

const fetchAllSuppliersNoPagingSuccessAction = (carriers) => ({
    type: SupplierActionTypes.FETCH_ALL_SUPPLIERS_NO_PAGING_SUCCESS,
    payload: carriers,
});

const fetchAllSuppliersNoPagingErrorAction = (error) => ({
    type: SupplierActionTypes.FETCH_ALL_SUPPLIERS_NO_PAGING_ERROR,
    payload: error,
});
//
//
// //  CREATE SITE
// export const createSiteAction = () => ({
//     type: SupplierActionTypes.DO_CREATE_SITE,
// });
//
// export const createSiteSuccessAction = () => ({
//     type: SupplierActionTypes.CREATE_SITE_SUCCESS,
// });
//
// export const createSiteErrorAction = (error) => ({
//     type: SupplierActionTypes.CREATE_SITE_ERROR,
//     payload: error,
// });

// // EDIT SITE
//
// export const editSiteByIdAction = () => ({
//     type: SupplierActionTypes.DO_EDIT_SITE,
// });
//
// export const editSiteByIdSuccessAction = (data) => ({
//     type: SupplierActionTypes.EDIT_SITE_SUCCESS,
//     payload: data,
// });
//
// export const editSiteByIdErrorAction = (error) => ({
//     type: SupplierActionTypes.EDIT_SITE_ERROR,
//     payload: error,
// });
//

// DELETE

export const deleteSupplierByIdAction = () => ({
    type: SupplierActionTypes.DO_DELETE_SUPPLIER,
});

export const deleteSupplierByIdSuccess = () => ({
    type: SupplierActionTypes.DELETE_SUPPLIER_SUCCESS,
});

export const deleteSupplierByIdError = (error) => ({
    type: SupplierActionTypes.DELETE_SUPPLIER_ERROR,
    payload: error,
});


export const fetchAllSuppliers = (params) => async (dispatch) => {
    dispatch(fetchAllSuppliersAction());
    try {
        let url = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/supplier/page`) || '';
        let search_params = url.searchParams;

        for (let [key, value] of Object.entries(params)) {
            search_params.append(key, value);
        }

        const response = await axios.get(decodeURIComponent(url));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllSuppliersSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllSuppliersErrorAction(error.response.data.message));
    }
};

export const fetchAllSuppliersNoPaging = () => async (dispatch) => {
    dispatch(fetchAllSuppliersNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/user/supplier/list`);
        const result = _.get(response, 'data');
        dispatch(fetchAllSuppliersNoPagingSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllSuppliersNoPagingErrorAction(error.response.data.message));
    }
};

export const deleteSupplier = (id) => async (dispatch) => {
    dispatch(deleteSupplierByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/supplier/admin/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteSupplierByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteSupplierByIdError(error.response.data.message));
    }
};


// export const fetchSite = (id) => async (dispatch) => {
//     dispatch(fetchSiteByIdAction());
//     try {
//         const response = await API.get(`api/site/${id}`);
//         const result = _.get(response, 'data');
//         if (result) {
//             dispatch(fetchSiteByIdSuccess(result));
//         }
//     } catch (error) {
//         checkTokenExpired(error);
//         dispatch(fetchSiteByIdError());
//     }
// };

// export const createSite = (params) => async (dispatch) => {
//     dispatch(createSiteAction());
//     try {
//         const response = await API.post('pgc-service/api/site', params);
//         const result = _.get(response, 'data');
//         if (result && result.id) {
//             if (result.siteType === 'WOO') {
//                 window.location.href = (`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}ems-service/api/site/woo/add-app?siteId=${result.id}`)
//             } else if (result.siteType === 'SHOPIFY') {
//                 window.location.href = (`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}ems-service/api/site/shopify/add-app?siteId=${result.id}`)
//             }
//             //dispatch(createSiteSuccessAction());
//         }
//     } catch (error) {
//         checkTokenExpired(error);
//         dispatch(createSiteErrorAction(error.response.data.message || 'Create Site Error!'));
//     }
// };

// export const editSite = (params, isRedirect) => async (dispatch) => {
//     dispatch(editSiteByIdAction());
//     try {
//         const response = await API.put('pgc-service/api/site', params);
//         const result = _.get(response, 'data');
//         if (result) {
//             if (isRedirect && result.id && result.siteType) {
//                 if (result.siteType === 'WOO') {
//                     window.location.href = `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}ems-service/api/site/woo/add-app?siteId=${result.id}`;
//                 } else if (result.siteType === 'SHOPIFY') {
//                     window.location.href = `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}ems-service/api/site/shopify/add-app?siteId=${result.id}`;
//                 }
//             } else {
//                 dispatch(editSiteByIdSuccessAction(result));
//             }
//         }
//     } catch (error) {
//         checkTokenExpired(error);
//         dispatch(editSiteByIdErrorAction(error.response.data.message || 'Edit Bot Error!'));
//     }
// };
