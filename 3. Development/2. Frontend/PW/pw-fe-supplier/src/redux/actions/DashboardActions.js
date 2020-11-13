import * as _ from 'lodash';
import {DashboardActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import checkTokenExpired from '../../core/util/checkTokenExpired';


// FETCH URGENT NOTE
const fetchUrgentNoteAction = () => ({
    type: DashboardActionTypes.DO_FETCH_URGENT_NOTE,
});

const fetchUrgentNoteSuccessAction = (data) => ({
    type: DashboardActionTypes.FETCH_URGENT_NOTE_SUCCESS,
    payload: data,
});

const fetchUrgentNoteErrorAction = (error) => ({
    type: DashboardActionTypes.FETCH_URGENT_NOTE_ERROR,
    payload: error,
});



export const fetchUrgentNote = () => async (dispatch) => {
    dispatch(fetchUrgentNoteAction());
    try {
        const response = await API.get('pgc-service/api/news/urgent-note');
        const result = _.get(response, 'data');
        if (result) {
            dispatch(fetchUrgentNoteSuccessAction(result));
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchUrgentNoteErrorAction(error.response.data.message));
    }
};

