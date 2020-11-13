import {fromJS} from 'immutable';
import {AuthActionTypes} from '../actionTypes';

const initialState = fromJS({
    id_token: '',
    loading: false,
    error: null,
    registerLoading: false,
    registerSuccess: false,
    registerError: null,

    activateLoading: false,
    activateSuccess: false,
    activateError: null,

    forgotLoading: false,
    forgotSuccess: false,
    forgotError: null,

    resetPassLoading: false,
    resetPassSuccess: false,
    resetPassError: null,

    userInfo: {
        data: null,
        loading: false,
        error: null,
    },
    balance: {
        loading: false,
        error: null,
        data: {}
    }
});

// eslint-disable-next-line import/prefer-default-export
export const auth = (state = initialState, action) => {
    switch (action.type) {
        case AuthActionTypes.DO_LOGIN:
            return state
                .setIn(['loading'], true)
                .setIn(['error'], null)
                .setIn(['id_token'], '');

        case AuthActionTypes.LOGIN_SUCCESS:
            return state
                .setIn(['loading'], false)
                .setIn(['id_token'], action.payload);

        case AuthActionTypes.LOGIN_ERROR:
            return state
                .setIn(['loading'], false)
                .setIn(['error'], action.payload);

        case AuthActionTypes.DO_REGISTER:
            return state
                .setIn(['registerLoading'], true)
                .setIn(['registerSuccess'], false)
                .setIn(['registerError'], null);

        case AuthActionTypes.REGISTER_SUCCESS:

            return state
                .setIn(['registerLoading'], false)
                .setIn(['registerSuccess'], true);

        case AuthActionTypes.REGISTER_ERROR:
            return state
                .setIn(['registerLoading'], false)
                .setIn(['registerError'], action.payload);

        case AuthActionTypes.LOGOUT:
            // logout();

            return state;

        case AuthActionTypes.DO_ACTIVATE:
            return state
                .setIn(['activateLoading'], true)
                .setIn(['activateError'], null)
                .setIn(['activateSuccess'], false);

        case AuthActionTypes.ACTIVATE_SUCCESS:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateSuccess'], true);

        case AuthActionTypes.ACTIVATE_ERROR:
            return state
                .setIn(['activateLoading'], false)
                .setIn(['activateError'], action.payload);

        case AuthActionTypes.DO_FORGOT_INIT:
            return state
                .setIn(['forgotLoading'], true)
                .setIn(['forgotError'], null)
                .setIn(['forgotSuccess'], false);

        case AuthActionTypes.FORGOT_INIT_SUCCESS:
            return state
                .setIn(['forgotLoading'], false)
                .setIn(['forgotSuccess'], true);

        case AuthActionTypes.FORGOT_INIT_ERROR:
            return state
                .setIn(['forgotLoading'], false)
                .setIn(['forgotError'], action.payload);


        case AuthActionTypes.DO_CHANGE_PASS:
            return state
                .setIn(['resetPassLoading'], true)
                .setIn(['resetPassError'], null)
                .setIn(['resetPassSuccess'], false);

        case AuthActionTypes.CHANGE_PASS_SUCCESS:
            return state
                .setIn(['resetPassLoading'], false)
                .setIn(['resetPassSuccess'], true);

        case AuthActionTypes.CHANGE_PASS_ERROR:
            return state
                .setIn(['resetPassLoading'], false)
                .setIn(['resetPassError'], action.payload);


        case AuthActionTypes.DO_FETCH_INFO:
            return state.setIn(['userInfo', 'loading'], true);

        case AuthActionTypes.FETCH_INFO_SUCCESS:
            return state
                .setIn(['userInfo', 'loading'], false)
                .setIn(['userInfo', 'data'], action.payload);

        case AuthActionTypes.FETCH_INFO_ERROR:
            return state
                .setIn(['userInfo', 'loading'], false)
                .setIn(['userInfo', 'error'], action.payload);

        case AuthActionTypes.DO_FETCH_BALANCE:
            return state.setIn(['balance', 'loading'], true);

        case AuthActionTypes.FETCH_BALANCE_SUCCESS:
            return state
                .setIn(['balance', 'loading'], false)
                .setIn(['balance', 'data'], action.payload);

        case AuthActionTypes.FETCH_BALANCE_ERROR:
            return state
                .setIn(['balance', 'loading'], false)
                .setIn(['balance', 'error'], action.payload);
        default:
            return state;
    }
};
