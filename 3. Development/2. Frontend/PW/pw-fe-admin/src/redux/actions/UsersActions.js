import * as _ from 'lodash';
import {UsersActionTypes} from '../actionTypes';
import API from '../../core/util/Api';
import axios from 'axios';
import checkTokenExpired from '../../core/util/checkTokenExpired';
import getQueryUrl from "../../core/util/getQueryUrl";
import * as fileSaver from "file-saver";

// FETCH ALL
const fetchAllUsersAction = () => ({
    type: UsersActionTypes.DO_FETCH_ALL_USERS,
});

const fetchAllUsersSuccessAction = (users) => ({
    type: UsersActionTypes.FETCH_ALL_USERS_SUCCESS,
    payload: users,
});

const fetchAllUsersErrorAction = (error) => ({
    type: UsersActionTypes.FETCH_ALL_USERS_ERROR,
    payload: error,
});

// CREATE
export const createUserAction = () => ({
    type: UsersActionTypes.DO_CREATE_USER,
});

export const createUserSuccessAction = () => ({
    type: UsersActionTypes.CREATE_USER_SUCCESS,
});

export const createUserErrorAction = (error) => ({
    type: UsersActionTypes.CREATE_USER_ERROR,
    payload: error,
});

// UPDATE

export const editUserByIdAction = () => ({
    type: UsersActionTypes.DO_EDIT_USER,
});

export const editUserByIdSuccessAction = () => ({
    type: UsersActionTypes.EDIT_USER_SUCCESS,
});

export const editUserByIdErrorAction = (error) => ({
    type: UsersActionTypes.EDIT_USER_ERROR,
    payload: error,
});

// // DELETE
//
// export const deleteUserByIdAction = () => ({
//     type: UsersActionTypes.DO_DELETE_USER
// });
//
// export const deleteUserByIdSuccess = () => ({
//     type: UsersActionTypes.DELETE_USER_SUCCESS,
// });
//
// export const deleteUserByIdError = (error) => ({
//     type: UsersActionTypes.DELETE_USER_ERROR,
//     payload: error,
// });

// DELETE

export const lockUserByIdAction = () => ({
    type: UsersActionTypes.DO_LOCK_USER
});

export const lockUserByIdSuccess = () => ({
    type: UsersActionTypes.LOCK_USER_SUCCESS,
});

export const lockUserByIdError = (error) => ({
    type: UsersActionTypes.LOCK_USER_ERROR,
    payload: error,
});

// Export Users
export const exportUsersAction = () => ({
    type: UsersActionTypes.DO_EXPORT_USERS,
});

export const exportUsersSuccessAction = () => ({
    type: UsersActionTypes.EXPORT_USERS_SUCCESS,
});


export const exportUsersErrorAction = error => ({
    type: UsersActionTypes.EXPORT_USERS_ERROR,
    payload: error
});


export const fetchAllUsers = (params) => async (dispatch) => {
    dispatch(fetchAllUsersAction());
    try {

        let url = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/user/page`) || '';
        let search_params = url.searchParams;

        for (let [key, value] of Object.entries(params)) {
            search_params.append(key, value);
        }

        const response = await axios.get(decodeURIComponent(url));
        const result = _.get(response, 'data');
        dispatch(fetchAllUsersSuccessAction(result));
    } catch (error) {
        checkTokenExpired(error);
        dispatch(fetchAllUsersErrorAction(error.response.data.message));
    }
};


export const createUser = (params) => async (dispatch) => {
    dispatch(createUserAction());
    try {
        const response = await API.post('api/user', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(createUserSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(createUserErrorAction(error.response.data.message));
    }
};

export const editUser = (params) => async (dispatch) => {
    dispatch(editUserByIdAction());
    try {
        const response = await API.put('api/user', params);
        const result = _.get(response, 'data');
        if (result) {
            dispatch(editUserByIdSuccessAction());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(editUserByIdErrorAction(error.response.data.message));
    }
};

// export const deleteUser = (id) => async (dispatch) => {
//     dispatch(deleteUserByIdAction());
//     try {
//         const response = await API.delete(`pgc-service/api/user/${id}`);
//         const status = _.get(response, 'status');
//         if (status === 200) {
//             dispatch(deleteUserByIdSuccess());
//         }
//     } catch (error) {
//         checkTokenExpired(error);
//         dispatch(deleteUserByIdError(error.response.data.message));
//     }
// };

export const lockUser = (params) => async (dispatch) => {
    dispatch(lockUserByIdAction());
    try {
        const response = await API.put(`api/user/lock?email=${params.email}&activated=${params.activated}`);
        const status = _.get(response, 'status');
        if (status === 200) {
            dispatch(lockUserByIdSuccess());
        }
    } catch (error) {
        checkTokenExpired(error);
        dispatch(lockUserByIdError(error.response.data.message));
    }
};

export const exportUsers = params => async dispatch => {
    dispatch(exportUsersAction());
    try {
        const url = getQueryUrl("pgc-service/api/user/export", params);
        const response = await API.get(decodeURIComponent(url), {responseType: 'arraybuffer'});
        const result = _.get(response, 'data');
        if (result) {
            let disposition = response.headers['content-disposition'];
            let fileName = disposition ? disposition.split("filename=")[1] : 'user-export';
            console.log(response, );
            let blob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            fileSaver.saveAs(blob, fileName);
            dispatch(exportUsersSuccessAction());
        }
    } catch (error) {
        dispatch(exportUsersErrorAction('Export file error!'))
    }
};

