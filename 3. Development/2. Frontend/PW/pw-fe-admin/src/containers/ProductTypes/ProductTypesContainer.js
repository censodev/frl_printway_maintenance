import {connect} from 'react-redux';

import {
    ProductTypesActions,
    CategoriesActions,
    CarriesActions,
    SuppliersActions,
} from '../../redux/actions';
import ProductTypes from "../../views/ProductTypes/ProductTypes";

const mapStateToProps = (state) => ({
    listProductTypes: state.toJS().productTypes.listProductTypes,
    listCountries: state.toJS().productTypes.listCountries,
    listCategoriesNoPaging: state.toJS().categories.listCategoriesNoPaging,
    listCarriesNoPaging: state.toJS().carries.listCarriesNoPaging,
    listSuppliersNoPaging: state.toJS().suppliers.listSuppliersNoPaging,
    createLoading: state.toJS().productTypes.createLoading,
    createSuccess: state.toJS().productTypes.createSuccess,
    createError: state.toJS().productTypes.createError,
    editLoading: state.toJS().productTypes.editLoading,
    editSuccess: state.toJS().productTypes.editSuccess,
    editError: state.toJS().productTypes.editError,
    deleteLoading: state.toJS().productTypes.deleteLoading,
    deleteSuccess: state.toJS().productTypes.deleteSuccess,
    deleteError: state.toJS().productTypes.deleteError,
    activateLoading: state.toJS().productTypes.activateLoading,
    activateSuccess: state.toJS().productTypes.activateSuccess,
    activateError: state.toJS().productTypes.activateError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllProductTypes: (params) => dispatch(ProductTypesActions.fetchAllProductTypes(params)),
    fetchAllCountries: () => dispatch(ProductTypesActions.fetchAllCountries()),
    fetchAllCategoriesNoPaging: () => dispatch(CategoriesActions.fetchAllCategoriesNoPaging()),
    fetchAllCarriesNoPaging: () => dispatch(CarriesActions.fetchAllCarriesNoPaging()),
    fetchAllSuppliersNoPaging: () => dispatch(SuppliersActions.fetchAllSuppliersNoPaging()),
    createProductType: (params) => dispatch(ProductTypesActions.createProductType(params)),
    editProductType: (params) => dispatch(ProductTypesActions.editProductType(params)),
    deleteProductType: (id) => dispatch(ProductTypesActions.deleteProductType(id)),
    activateProductType: (params) => dispatch(ProductTypesActions.activateProductType(params)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProductTypes);
