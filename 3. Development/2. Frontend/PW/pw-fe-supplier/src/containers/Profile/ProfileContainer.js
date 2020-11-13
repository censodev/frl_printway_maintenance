import {connect} from 'react-redux';

import {ProfileActions} from '../../redux/actions';
import Profile from "../../views/Profile/Profile";

const mapStateToProps = (state) => ({
    listNotificationSetting: state.toJS().profile.listNotificationSetting,
    editNotificationLoading: state.toJS().profile.editNotificationLoading,
    editNotificationSuccess: state.toJS().profile.editNotificationSuccess,
    editNotificationError: state.toJS().profile.editNotificationError,
    editUserInfoLoading: state.toJS().profile.editUserInfoLoading,
    editUserInfoSuccess: state.toJS().profile.editUserInfoSuccess,
    editUserInfoError: state.toJS().profile.editUserInfoError,
    userInfo: state.toJS().auth.userInfo.data,
    editPassLoading: state.toJS().profile.editPassLoading,
    editPassSuccess: state.toJS().profile.editPassSuccess,
    editPassError: state.toJS().profile.editPassError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllNotificationSetting: () => dispatch(ProfileActions.fetchAllNotificationSetting()),
    editNotificationSetting: (params) => dispatch(ProfileActions.editNotificationSetting(params)),
    editUserInfo: (params) => dispatch(ProfileActions.editUserInfo(params)),
    editPassword: (params) => dispatch(ProfileActions.editPassword(params)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Profile);
