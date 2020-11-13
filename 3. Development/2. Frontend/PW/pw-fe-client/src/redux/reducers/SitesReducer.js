import {fromJS} from 'immutable';

import {SiteActionTypes} from '../actionTypes';

const initialState = fromJS({
    listSites: {
        sites: [],
        totalElements: 0,
        error: null,
        loading: false,
        success: false,
    },
    listSitesNoPaging: {
        sites: [],
        error: null,
        loading: false,
        success: false,
    },
    listProductsByCollection: {
        products: [],
        pageInfo: '',
        error: null,
        loading: false,
        success: false,
        showLoadMoreBtn: false,
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
    activateLoading: false,
    activateSuccess: false,
    activateError: null,
    mapProductLoading: false,
    mapProductSuccess: false,
    mapProductError: null,
});

// eslint-disable-next-line import/prefer-default-export
export const sites = (state = initialState, action) => {
    switch (action.type) {
        case SiteActionTypes.DO_FETCH_ALL_PRODUCT_BY_COLLECTION:
            return state
                .setIn(['listProductsByCollection', 'loading'], true)
                .setIn(['listProductsByCollection', 'success'], false)
                .setIn(['listProductsByCollection', 'pageInfo'], '')
                .setIn(['listProductsByCollection', 'showLoadMoreBtn'], false);

        case SiteActionTypes.FETCH_ALL_PRODUCT_BY_COLLECTION_SUCCESS:
            if (action.page === 1) {
                return state
                    .setIn(['listProductsByCollection', 'loading'], false)
                    .setIn(['listProductsByCollection', 'success'], true)
                    .setIn(['listProductsByCollection', 'pageInfo'], action.pageInfo)
                    .setIn(['listProductsByCollection', 'products'], action.payload);
            } else {

                // lazy load

                return state
                    .setIn(['listProductsByCollection', 'loading'], false)
                    .setIn(['listProductsByCollection', 'success'], true)
                    .setIn(['listProductsByCollection', 'pageInfo'], action.pageInfo)
                    .setIn(['listProductsByCollection', 'products'], state.getIn(['listProductsByCollection', 'products']).concat(action.payload));
            }


        case SiteActionTypes.FETCH_ALL_PRODUCT_BY_COLLECTION_ERROR:
            return state
                .setIn(['listProductsByCollection', 'loading'], false)
                .setIn(['listProductsByCollection', 'products'], [])
                .setIn(['listProductsByCollection', 'error'], action.payload);

        case SiteActionTypes.HANDLE_LOAD_MORE_BTN:
            return state
                .setIn(['listProductsByCollection', 'showLoadMoreBtn'], action.payload);

        case SiteActionTypes.DO_FETCH_ALL_SITES:
            return state
                .setIn(['listSites', 'loading'], true)
                .setIn(['listSites', 'success'], false);

        case SiteActionTypes.FETCH_ALL_SITES_SUCCESS:
            return state
                .setIn(['listSites', 'loading'], false)
                .setIn(['listSites', 'success'], true)
                .setIn(['listSites', 'sites'], action.payload.content)
                .setIn(['listSites', 'totalElements'], action.payload.totalElements);

        case SiteActionTypes.FETCH_ALL_SITES_ERROR:
            return state
                .setIn(['listSites', 'loading'], false)
                .setIn(['listSites', 'error'], action.payload);


        case SiteActionTypes.DO_FETCH_ALL_SITES_NO_PAGING:
            return state
                .setIn(['listSitesNoPaging', 'loading'], true)
                .setIn(['listSitesNoPaging', 'success'], false);

        case SiteActionTypes.FETCH_ALL_SITES_NO_PAGING_SUCCESS:
            return state
                .setIn(['listSitesNoPaging', 'loading'], false)
                .setIn(['listSitesNoPaging', 'success'], true)
                .setIn(['listSitesNoPaging', 'sites'], action.payload);

        case SiteActionTypes.FETCH_ALL_SITES_NO_PAGING_ERROR:
            return state
                .setIn(['listSitesNoPaging', 'loading'], false)
                .setIn(['listSitesNoPaging', 'error'], action.payload);

        case SiteActionTypes.DO_EDIT_SITE:
            return state
                .setIn(['editLoading'], true)
                .setIn(['editSuccess'], false)
                .setIn(['editError'], null);

        case SiteActionTypes.EDIT_SITE_SUCCESS:
            return state.setIn(['editLoading'], false)
                .setIn(['editSuccess'], true);

        case SiteActionTypes.EDIT_SITE_ERROR:
            return state
                .setIn(['editLoading'], false)
                .setIn(['editError'], action.payload);

        case SiteActionTypes.DO_CREATE_SITE:
            return state
                .setIn(['createLoading'], true)
                .setIn(['createSuccess'], false)
                .setIn(['createError'], null);

        case SiteActionTypes.CREATE_SITE_SUCCESS:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createSuccess'], true);

        case SiteActionTypes.CREATE_SITE_ERROR:
            return state
                .setIn(['createLoading'], false)
                .setIn(['createError'], action.payload);

        case SiteActionTypes.DO_DELETE_SITE:
            return state
                .setIn(['deleteLoading'], true)
                .setIn(['deleteSuccess'], false)
                .setIn(['deleteError'], null);

        case SiteActionTypes.DELETE_SITE_SUCCESS:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteSuccess'], true);

        case SiteActionTypes.DELETE_SITE_ERROR:
            return state
                .setIn(['deleteLoading'], false)
                .setIn(['deleteError'], action.payload);

        case SiteActionTypes.DO_ACTIVATE_SITE:
            return state
                .setIn(['activateLoading'], true)
                .setIn(['activateSuccess'], false)
                .setIn(['activateError'], null);

        case SiteActionTypes.ACTIVATE_SITE_SUCCESS:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateSuccess'], true);

        case SiteActionTypes.ACTIVATE_SITE_ERROR:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateError'], action.payload);

        case SiteActionTypes.DO_MAP_PRODUCT:
            return state
                .setIn(['mapProductLoading'], true)
                .setIn(['mapProductSuccess'], false)
                .setIn(['mapProductError'], null);

        case SiteActionTypes.MAP_PRODUCT_SUCCESS:
            return state
                .setIn(['mapProductLoading'], false)
                .setIn(['mapProductSuccess'], true);

        case SiteActionTypes.MAP_PRODUCT_ERROR:
            return state
                .setIn(['mapProductLoading'], false)
                .setIn(['mapProductError'], action.payload);

        default:
            return state;
    }
};
