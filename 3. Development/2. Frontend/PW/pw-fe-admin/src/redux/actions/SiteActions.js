import * as _ from 'lodash';
import {SiteActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import axios from "axios";

// FETCH ALL SITES
const fetchAllSitesAction = () => ({
    type: SiteActionTypes.DO_FETCH_ALL_SITES,
});

const fetchAllSitesSuccessAction = (sites) => ({
    type: SiteActionTypes.FETCH_ALL_SITES_SUCCESS,
    payload: sites,
});

const fetchAllSitesErrorAction = (error) => ({
    type: SiteActionTypes.FETCH_ALL_SITES_ERROR,
    payload: error,
});

// FETCH ALL SITES NO PAGING
const fetchAllSitesNoPagingAction = () => ({
    type: SiteActionTypes.DO_FETCH_ALL_SITES_NO_PAGING,
});

const fetchAllSitesNoPagingSuccessAction = (sites) => ({
    type: SiteActionTypes.FETCH_ALL_SITES_NO_PAGING_SUCCESS,
    payload: sites,
});

const fetchAllSitesNoPagingErrorAction = (error) => ({
    type: SiteActionTypes.FETCH_ALL_SITES_NO_PAGING_ERROR,
    payload: error,
});
//
//
// //  CREATE SITE
// export const createSiteAction = () => ({
//     type: SiteActionTypes.DO_CREATE_SITE,
// });
//
// export const createSiteSuccessAction = () => ({
//     type: SiteActionTypes.CREATE_SITE_SUCCESS,
// });
//
// export const createSiteErrorAction = (error) => ({
//     type: SiteActionTypes.CREATE_SITE_ERROR,
//     payload: error,
// });

// // EDIT SITE
//
// export const editSiteByIdAction = () => ({
//     type: SiteActionTypes.DO_EDIT_SITE,
// });
//
// export const editSiteByIdSuccessAction = (data) => ({
//     type: SiteActionTypes.EDIT_SITE_SUCCESS,
//     payload: data,
// });
//
// export const editSiteByIdErrorAction = (error) => ({
//     type: SiteActionTypes.EDIT_SITE_ERROR,
//     payload: error,
// });
//

// DELETE SITE

export const deleteSiteByIdAction = () => ({
    type: SiteActionTypes.DO_DELETE_SITE,
});

export const deleteSiteByIdSuccess = () => ({
    type: SiteActionTypes.DELETE_SITE_SUCCESS,
});

export const deleteSiteByIdError = (error) => ({
    type: SiteActionTypes.DELETE_SITE_ERROR,
    payload: error,
});

// ACTIVATE SITE

export const activateSiteByIdAction = () => ({
    type: SiteActionTypes.DO_ACTIVATE_SITE,
});

export const activateSiteByIdSuccess = () => ({
    type: SiteActionTypes.ACTIVATE_SITE_SUCCESS,
});

export const activateSiteByIdError = (error) => ({
    type: SiteActionTypes.ACTIVATE_SITE_ERROR,
    payload: error,
});


export const fetchAllSites = (params) => async (dispatch) => {
    dispatch(fetchAllSitesAction());
    try {
        let url = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/site/admin/page`) || '';
        let search_params = url.searchParams;

        for (let [key, value] of Object.entries(params)) {
            search_params.append(key, value);
        }

        const response = await axios.get(decodeURIComponent(url));
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllSitesSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllSitesErrorAction(error.response.data.message));
    }
};

export const fetchAllSitesNoPaging = () => async (dispatch) => {
    dispatch(fetchAllSitesNoPagingAction());
    try {
        const response = await API.get(`pgc-service/api/site/admin/list`);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchAllSitesNoPagingSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllSitesNoPagingErrorAction(error.response.data.message));
    }
};

export const deleteSite = (id) => async (dispatch) => {
    dispatch(deleteSiteByIdAction());
    try {
        const response = await API.delete(`pgc-service/api/site/admin/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(deleteSiteByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(deleteSiteByIdError(error.response.data.message));
    }
};

export const activateSite = (id) => async (dispatch) => {
    dispatch(activateSiteByIdAction());
    try {
        const response = await API.put(`pgc-service/api/site/active/${id}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(activateSiteByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(activateSiteByIdError(error.response.data.message));
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
