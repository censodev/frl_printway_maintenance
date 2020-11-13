import {connect} from 'react-redux';

import {ProductsActions, SiteActions} from '../../redux/actions';
import Products from "../../views/Products/Products";

const mapStateToProps = (state) => ({
    listProducts: state.toJS().products.listProducts,
    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
    // listProductType: state.toJS().products.listProductType,
    // listShopifyCollections: state.toJS().products.listShopifyCollections,
    listSeller: state.toJS().products.listSeller,
    listProductTypeNoPaging: state.toJS().products.listProductTypeNoPaging,
    // currentShoptifyCollection: state.toJS().products.currentShoptifyCollection,
    // createLoading: state.toJS().products.createLoading,
    // createSuccess: state.toJS().products.createSuccess,
    // createError: state.toJS().products.createError,
    // editLoading: state.toJS().products.editLoading,
    // editSuccess: state.toJS().products.editSuccess,
    // editError: state.toJS().products.editError,

    editPrintFilesLoading: state.toJS().products.editPrintFilesLoading,
    editPrintFilesSuccess: state.toJS().products.editPrintFilesSuccess,
    editPrintFilesError: state.toJS().products.editPrintFilesError,
    // deleteLoading: state.toJS().products.deleteLoading,
    // deleteSuccess: state.toJS().products.deleteSuccess,
    // deleteError: state.toJS().products.deleteError,
});

const mapDispatchToProps = (dispatch) => ({
    // fetchAllProductType: (id) => dispatch(ProductsActions.fetchAllProductType(id)),
    fetchAllProducts: (params) => dispatch(ProductsActions.fetchAllProducts(params)),
    fetchAllProductTypeNoPaging: (params) => dispatch(ProductsActions.fetchAllProductTypeNoPaging()),
    fetchAllSeller: () => dispatch(ProductsActions.fetchAllSeller()),
    // fetchAllShopifyCollections: (id) => dispatch(ProductsActions.fetchAllShopifyCollections(id)),
    fetchAllSitesNoPaging: (id) => dispatch(SiteActions.fetchAllSitesNoPaging()),
    // createProduct: (params) => dispatch(ProductsActions.createProduct(params)),
    // createShoptifyCollection: (idSite, params) => dispatch(ProductsActions.createShoptifyCollection(idSite, params)),
    // editProduct: (params) => dispatch(ProductsActions.editProduct(params)),
    editPrintFiles: (params) => dispatch(ProductsActions.editPrintFiles(params)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Products);
