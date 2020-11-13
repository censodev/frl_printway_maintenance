import {connect} from 'react-redux';

import {UsersActions, SellerLevelsActions} from '../../redux/actions';
import Users from "../../views/Users/Users";

const mapStateToProps = (state) => ({
    listUsers: state.toJS().users.listUsers,
    listLevelsNoPaging: state.toJS().sellerLevels.listLevelsNoPaging,
    exportLoading: state.toJS().users.exportLoading,
    exportError: state.toJS().users.exportError,
    createLoading: state.toJS().users.createLoading,
    createSuccess: state.toJS().users.createSuccess,
    createError: state.toJS().users.createError,
    editLoading: state.toJS().users.editLoading,
    editSuccess: state.toJS().users.editSuccess,
    editError: state.toJS().users.editError,
    // deleteLoading: state.toJS().users.deleteLoading,
    // deleteSuccess: state.toJS().users.deleteSuccess,
    // deleteError: state.toJS().users.deleteError,
    lockLoading: state.toJS().users.lockLoading,
    lockSuccess: state.toJS().users.lockSuccess,
    lockError: state.toJS().users.lockError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllUsers: (params) => dispatch(UsersActions.fetchAllUsers(params)),
    createUser: (params) => dispatch(UsersActions.createUser(params)),
    editUser: (params) => dispatch(UsersActions.editUser(params)),
    lockUser: (params) => dispatch(UsersActions.lockUser(params)),
    exportUsers: (params) => dispatch(UsersActions.exportUsers(params)),
    fetchAllSellerLevelsNoPaging: () => dispatch(SellerLevelsActions.fetchAllSellerLevelsNoPaging()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Users);
