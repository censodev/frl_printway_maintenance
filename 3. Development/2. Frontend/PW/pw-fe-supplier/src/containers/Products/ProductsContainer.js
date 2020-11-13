import {connect} from 'react-redux';

import {ProductsActions, SiteActions} from '../../redux/actions';
import Products from "../../views/Products/Products";

const mapStateToProps = (state) => ({
    listProducts: state.toJS().products.listProducts,
    listProductType: state.toJS().products.listProductType,
    listShopifyCollections: state.toJS().products.listShopifyCollections,
    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
    listProductTypeNoPaging: state.toJS().products.listProductTypeNoPaging,
    currentShoptifyCollection: state.toJS().products.currentShoptifyCollection,
    createLoading: state.toJS().products.createLoading,
    createSuccess: state.toJS().products.createSuccess,
    createError: state.toJS().products.createError,
    editLoading: state.toJS().products.editLoading,
    editSuccess: state.toJS().products.editSuccess,
    editError: state.toJS().products.editError,
    duplicateLoading: state.toJS().products.duplicateLoading,
    duplicateSuccess: state.toJS().products.duplicateSuccess,
    duplicateError: state.toJS().products.duplicateError,
    activateLoading: state.toJS().products.activateLoading,
    activateSuccess: state.toJS().products.activateSuccess,
    activateError: state.toJS().products.activateError,
    syncLoading: state.toJS().products.syncLoading,
    syncSuccess: state.toJS().products.syncSuccess,
    syncError: state.toJS().products.syncError,
    editPrintFilesLoading: state.toJS().products.editPrintFilesLoading,
    editPrintFilesSuccess: state.toJS().products.editPrintFilesSuccess,
    editPrintFilesError: state.toJS().products.editPrintFilesError,
    // deleteLoading: state.toJS().products.deleteLoading,
    // deleteSuccess: state.toJS().products.deleteSuccess,
    // deleteError: state.toJS().products.deleteError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllProductType: (id) => dispatch(ProductsActions.fetchAllProductType(id)),
    fetchAllProducts: (params) => dispatch(ProductsActions.fetchAllProducts(params)),
    fetchAllProductTypeNoPaging: (params) => dispatch(ProductsActions.fetchAllProductTypeNoPaging()),
    fetchAllShopifyCollections: (id) => dispatch(ProductsActions.fetchAllShopifyCollections(id)),
    fetchAllSitesNoPaging: (id) => dispatch(SiteActions.fetchAllSitesNoPaging()),
    createProduct: (params) => dispatch(ProductsActions.createProduct(params)),
    createShoptifyCollection: (idSite, params) => dispatch(ProductsActions.createShoptifyCollection(idSite, params)),
    editProduct: (params) => dispatch(ProductsActions.editProduct(params)),
    duplicateProduct: (id) => dispatch(ProductsActions.duplicateProduct(id)),
    syncProduct: (id) => dispatch(ProductsActions.syncProduct(id)),
    activateProduct: (params) => dispatch(ProductsActions.activateProduct(params)),
    editPrintFiles: (params) => dispatch(ProductsActions.editPrintFiles(params)),
    searchProductType: (key) => dispatch(ProductsActions.searchProductType(key)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Products);
