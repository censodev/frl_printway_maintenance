import {fromJS} from 'immutable';

import {DashboardActionTypes} from '../actionTypes';


const initialState = fromJS({
    urgentNote: {
        note: null,
        error: null,
        loading: false,
    },
});

// eslint-disable-next-line import/prefer-default-export
export const dashboard = (state = initialState, action) => {
    switch (action.type) {
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
