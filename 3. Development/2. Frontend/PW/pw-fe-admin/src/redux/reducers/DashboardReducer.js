import {fromJS} from 'immutable';

import {DashboardActionTypes} from '../actionTypes';


const initialState = fromJS({
    listStatistic: {
        statistics: null,
        error: null,
        loading: false,
    },
    listStatus: {
        status: [],
        error: null,
        loading: false,
    },
    topProduct: {
        products: null,
        error: null,
        loading: false,
    },
    topProductType: {
        productTypes: null,
        error: null,
        loading: false,
    },
    urgentNote: {
        note: null,
        error: null,
        loading: false,
    },
});

// eslint-disable-next-line import/prefer-default-export
export const dashboard = (state = initialState, action) => {
    switch (action.type) {

        case DashboardActionTypes.DO_FETCH_STATISTIC:
            return state.setIn(['listStatistic', 'loading'], true);

        case DashboardActionTypes.FETCH_STATISTIC_SUCCESS:
            return state
                .setIn(['listStatistic', 'loading'], false)
                .setIn(['listStatistic', 'statistics'], action.payload);

        case DashboardActionTypes.FETCH_STATISTIC_ERROR:
            return state
                .setIn(['listStatistic', 'loading'], false)
                .setIn(['listStatistic', 'error'], action.payload);


        case DashboardActionTypes.DO_FETCH_TOP_PRODUCT:
            return state.setIn(['topProduct', 'loading'], true);

        case DashboardActionTypes.FETCH_TOP_PRODUCT_SUCCESS:
            return state
                .setIn(['topProduct', 'loading'], false)
                .setIn(['topProduct', 'products'], action.payload);

        case DashboardActionTypes.FETCH_TOP_PRODUCT_ERROR:
            return state
                .setIn(['topProduct', 'loading'], false)
                .setIn(['topProduct', 'error'], action.payload);


        case DashboardActionTypes.DO_FETCH_TOP_PRODUCT_TYPE:
            return state.setIn(['topProductType', 'loading'], true);

        case DashboardActionTypes.FETCH_TOP_PRODUCT_TYPE_SUCCESS:
            return state
                .setIn(['topProductType', 'loading'], false)
                .setIn(['topProductType', 'productTypes'], action.payload);

        case DashboardActionTypes.FETCH_TOP_PRODUCT_TYPE_ERROR:
            return state
                .setIn(['topProductType', 'loading'], false)
                .setIn(['topProductType', 'error'], action.payload);


        case DashboardActionTypes.DO_FETCH_STATUS:
            return state.setIn(['listStatus', 'loading'], true);

        case DashboardActionTypes.FETCH_STATUS_SUCCESS:
            return state
                .setIn(['listStatus', 'loading'], false)
                .setIn(['listStatus', 'status'], action.payload);

        case DashboardActionTypes.FETCH_STATUS_ERROR:
            return state
                .setIn(['listStatus', 'loading'], false)
                .setIn(['listStatus', 'error'], action.payload);

        case DashboardActionTypes.DO_FETCH_URGENT_NOTE:
            return state.setIn(['urgentNote', 'loading'], true);

        case DashboardActionTypes.FETCH_URGENT_NOTE_SUCCESS:
            return state
                .setIn(['urgentNote', 'loading'], false)
                .setIn(['urgentNote', 'note'], action.payload);

        case DashboardActionTypes.FETCH_URGENT_NOTE_ERROR:
            return state
                .setIn(['urgentNote', 'loading'], false)
                .setIn(['urgentNote', 'error'], action.payload);
        default:
            return state;
    }
};
