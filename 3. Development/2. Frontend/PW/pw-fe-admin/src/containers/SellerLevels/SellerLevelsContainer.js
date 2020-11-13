import {connect} from 'react-redux';

import {SellerLevelsActions} from '../../redux/actions';
import sellerLevels from "../../views/SellerLevels/SellerLevels";

const mapStateToProps = (state) => ({
    listLevels: state.toJS().sellerLevels.listLevels,
    createLoading: state.toJS().sellerLevels.createLoading,
    createSuccess: state.toJS().sellerLevels.createSuccess,
    createError: state.toJS().sellerLevels.createError,
    editLoading: state.toJS().sellerLevels.editLoading,
    editSuccess: state.toJS().sellerLevels.editSuccess,
    editError: state.toJS().sellerLevels.editError,
    deleteLoading: state.toJS().sellerLevels.deleteLoading,
    deleteSuccess: state.toJS().sellerLevels.deleteSuccess,
    deleteError: state.toJS().sellerLevels.deleteError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllSellerLevels: (params) => dispatch(SellerLevelsActions.fetchAllSellerLevels(params)),
    createSellerLevel: (params) => dispatch(SellerLevelsActions.createSellerLevel(params)),
    editSellerLevel: (params) => dispatch(SellerLevelsActions.editSellerLevel(params)),
    deleteSellerLevel: (id) => dispatch(SellerLevelsActions.deleteSellerLevel(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(sellerLevels);
