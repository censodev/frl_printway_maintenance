import {connect} from 'react-redux';

import {CarriesActions} from '../../redux/actions';
import Carries from "../../views/Carries/Carries";

const mapStateToProps = (state) => ({
    listCarries: state.toJS().carries.listCarries,
    createLoading: state.toJS().carries.createLoading,
    createSuccess: state.toJS().carries.createSuccess,
    createError: state.toJS().carries.createError,
    editLoading: state.toJS().carries.editLoading,
    editSuccess: state.toJS().carries.editSuccess,
    editError: state.toJS().carries.editError,
    deleteLoading: state.toJS().carries.deleteLoading,
    deleteSuccess: state.toJS().carries.deleteSuccess,
    deleteError: state.toJS().carries.deleteError,
    activeLoading: state.toJS().carries.activeLoading,
    activeSuccess: state.toJS().carries.activeSuccess,
    activeError: state.toJS().carries.activeError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllCarries: (params) => dispatch(CarriesActions.fetchAllCarries(params)),
    createCarrie: (params) => dispatch(CarriesActions.createCarrie(params)),
    editCarrie: (params) => dispatch(CarriesActions.editCarrie(params)),
    deleteCarrie: (id) => dispatch(CarriesActions.deleteCarrie(id)),
    activeCarrie: (params) => dispatch(CarriesActions.activeCarrie(params)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Carries);
