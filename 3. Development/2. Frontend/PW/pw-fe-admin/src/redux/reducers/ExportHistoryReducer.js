import { fromJS } from 'immutable';

import { ExportHistoryActionTypes } from '../actionTypes';

const initialState = fromJS({
    exportHistory: {
        listExportHistory: [],
        totalElements: 0,
        loading: false,
        success: false,
        error: null
    }
})
export const exportHistory = (state = initialState, action) => {
    switch (action.type) {
        case ExportHistoryActionTypes.FETCH_EXPORT_HISTORY:
            return state.setIn(["exportHistory", "loading"], true)
                        .setIn(["exportHistory", "success"], false)
                        .setIn(["exportHistory", "error"], null)
        case ExportHistoryActionTypes.FETCH_EXPORT_HISTORY_SUCCESS:
            return state.setIn(["exportHistory", "loading"], false)
                        .setIn(["exportHistory", "success"], true)
                        .setIn(["exportHistory", "listExportHistory"], action.payload.content)
                        .setIn(["exportHistory", "totalElements"], action.payload.totalElements)
        case ExportHistoryActionTypes.FETCH_EXPORT_HISTORY_ERROR:
            return state.setIn(["exportHistory", "loading"], false)
                        .setIn(["exportHistory", "error"], true)
                        .setIn(["exportHistory", "listExportHistory"], action.payload)        
        default:
            return state;
    }
}