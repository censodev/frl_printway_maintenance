import {connect} from 'react-redux';

import {ProductsActions, SiteActions} from '../../redux/actions';
import Sites from "../../views/Sites/Sites";

const mapStateToProps = (state) => ({
    listSites: state.toJS().sites.listSites,
    listSeller: state.toJS().products.listSeller,
    createLoading: state.toJS().sites.createLoading,
    createSuccess: state.toJS().sites.createSuccess,
    createError: state.toJS().sites.createError,
    // editLoading: state.toJS().sites.editLoading,
    // editSuccess: state.toJS().sites.editSuccess,
    // editError: state.toJS().sites.editError,
    deleteLoading: state.toJS().sites.deleteLoading,
    deleteSuccess: state.toJS().sites.deleteSuccess,
    deleteError: state.toJS().sites.deleteError,
    activateLoading: state.toJS().sites.activateLoading,
    activateSuccess: state.toJS().sites.activateSuccess,
    activateError: state.toJS().sites.activateError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllSites: (params) => dispatch(SiteActions.fetchAllSites(params)),
    fetchAllSeller: () => dispatch(ProductsActions.fetchAllSeller()),
    // createSite: (params) => dispatch(SiteActions.createSite(params)),
    // editSite: (params) => dispatch(SiteActions.editSite(params)),
    deleteSite: (id) => dispatch(SiteActions.deleteSite(id)),
    activateSite: (id) => dispatch(SiteActions.activateSite(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Sites);
