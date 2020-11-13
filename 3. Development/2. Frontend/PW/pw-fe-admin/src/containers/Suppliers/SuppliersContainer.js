import {connect} from 'react-redux';

import {SuppliersActions} from '../../redux/actions';
import Suppliers from "../../views/Suppliers/Suppliers";

const mapStateToProps = (state) => ({
    listSuppliers: state.toJS().suppliers.listSuppliers,
    createLoading: state.toJS().suppliers.createLoading,
    createSuccess: state.toJS().suppliers.createSuccess,
    createError: state.toJS().suppliers.createError,
    // editLoading: state.toJS().suppliers.editLoading,
    // editSuccess: state.toJS().suppliers.editSuccess,
    // editError: state.toJS().suppliers.editError,
    deleteLoading: state.toJS().suppliers.deleteLoading,
    deleteSuccess: state.toJS().suppliers.deleteSuccess,
    deleteError: state.toJS().suppliers.deleteError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllSuppliers: (params) => dispatch(SuppliersActions.fetchAllSuppliers(params)),
    // createSite: (params) => dispatch(SiteActions.createSite(params)),
    // editSite: (params) => dispatch(SiteActions.editSite(params)),
    deleteSupplier: (id) => dispatch(SuppliersActions.deleteSupplier(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Suppliers);
