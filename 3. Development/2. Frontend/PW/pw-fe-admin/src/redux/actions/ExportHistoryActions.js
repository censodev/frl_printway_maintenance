import { ExportHistoryActionTypes } from '../actionTypes';
import Api from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from '../../core/util/getQueryUrl';
import * as _ from 'lodash';

// fetch list
export const fetchExportHistoryAction = () => {
    return {
        type: ExportHistoryActionTypes.FETCH_EXPORT_HISTORY
    }
}
export const fetchExportHistorySuccessAction = history => {
    return {
        type: ExportHistoryActionTypes.FETCH_EXPORT_HISTORY_SUCCESS,
        payload: history
    }
}
export const fetchExportHistoryErrorAction = error => {
    return {
        type: ExportHistoryActionTypes.FETCH_EXPORT_HISTORY_ERROR,
        payload: error
    }
}
export const fetchExportHistory = params => async dispatch => {
    dispatch(fetchExportHistoryAction());
    try {
        const url = getQueryUrl("pgc-service/api/export-order-history/admin/page", params);
        const res = await axios.get(decodeURIComponent(url));
        if(res && res.status === 200) {
            dispatch(fetchExportHistorySuccessAction(res.data))
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchExportHistoryErrorAction(error));
    }
}

