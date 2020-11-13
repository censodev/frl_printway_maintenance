import {connect} from 'react-redux';

import {ProductsActions, SiteActions} from '../../redux/actions';
import Sites from "../../views/Sites/Sites";

const mapStateToProps = (state) => ({
    listSites: state.toJS().sites.listSites,
    listShopifyCollections: state.toJS().products.listShopifyCollections,
    listProductsByCollection: state.toJS().sites.listProductsByCollection,
    createLoading: state.toJS().sites.createLoading,
    createSuccess: state.toJS().sites.createSuccess,
    createError: state.toJS().sites.createError,
    editLoading: state.toJS().sites.editLoading,
    editSuccess: state.toJS().sites.editSuccess,
    editError: state.toJS().sites.editError,
    deleteLoading: state.toJS().sites.deleteLoading,
    deleteSuccess: state.toJS().sites.deleteSuccess,
    deleteError: state.toJS().sites.deleteError,
    activateLoading: state.toJS().sites.activateLoading,
    activateSuccess: state.toJS().sites.activateSuccess,
    activateError: state.toJS().sites.activateError,
    listProductType: state.toJS().products.listProductType,
    mapProductLoading: state.toJS().sites.mapProductLoading,
    mapProductSuccess: state.toJS().sites.mapProductSuccess,
    mapProductError: state.toJS().sites.mapProductError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllSites: (params) => dispatch(SiteActions.fetchAllSites(params)),
    createSite: (params) => dispatch(SiteActions.createSite(params)),
    editSite: (params, isRedirect) => dispatch(SiteActions.editSite(params, isRedirect)),
    mapProduct: (params) => dispatch(SiteActions.mapProduct(params)),
    deleteSite: (id) => dispatch(SiteActions.deleteSite(id)),
    activateSite: (id) => dispatch(SiteActions.activateSite(id)),
    fetchAllProductType: (id) => dispatch(ProductsActions.fetchAllProductType(id)),
    fetchAllShopifyCollections: (id) => dispatch(ProductsActions.fetchAllShopifyCollections(id)),
    fetchAllProductByCollection: (params) => dispatch(SiteActions.fetchAllProductByCollection(params)),
    handleLoadMoreBtn: (status) => dispatch(SiteActions.handleLoadMoreBtn(status))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Sites);
