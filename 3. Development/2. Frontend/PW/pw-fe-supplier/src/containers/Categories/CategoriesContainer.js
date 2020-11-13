import {connect} from 'react-redux';

import {CategoriesActions} from '../../redux/actions';
import Categories from "../../views/Categories/Categories";

const mapStateToProps = (state) => ({
    listCategories: state.toJS().categories.listCategories,
    createLoading: state.toJS().categories.createLoading,
    createSuccess: state.toJS().categories.createSuccess,
    createError: state.toJS().categories.createError,
    editLoading: state.toJS().categories.editLoading,
    editSuccess: state.toJS().categories.editSuccess,
    editError: state.toJS().categories.editError,
    deleteLoading: state.toJS().categories.deleteLoading,
    deleteSuccess: state.toJS().categories.deleteSuccess,
    deleteError: state.toJS().categories.deleteError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllCategories: (params) => dispatch(CategoriesActions.fetchAllCategories(params)),
    createCategory: (params) => dispatch(CategoriesActions.createCategory(params)),
    editCategory: (params) => dispatch(CategoriesActions.editCategory(params)),
    deleteCategory: (id) => dispatch(CategoriesActions.deleteCategory(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Categories);
