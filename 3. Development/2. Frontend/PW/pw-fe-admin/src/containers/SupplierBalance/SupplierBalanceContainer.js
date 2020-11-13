import { connect } from 'react-redux';

import { SupplierBalanceAction, OrdersActions, UserBalancesActions } from '../../redux/actions';
import SupplierBalances from '../../views/SupplierBanlances/SupplierBalances';
const mapStateToProps = state => ({
    listBalances: state.toJS().supplierBalances.listBalances,
    overView: state.toJS().supplierBalances.overView,
    listSuppliers: state.toJS().orders.listSuppliers,

    customTransactionLoading: state.toJS().userBalances.customTransactionLoading,
    customTransactionSuccess: state.toJS().userBalances.customTransactionSuccess,
    customTransactionError: state.toJS().userBalances.customTransactionError,

    exportLoading: state.toJS().userBalances.exportLoading,
    exportSuccess: state.toJS().userBalances.exportSuccess,
    exportError: state.toJS().userBalances.exportError,
})

const mapDispatchToProps =  dispatch => ({
    fetchAllBalances: params => {
        dispatch(SupplierBalanceAction.fetchAllBalances(params))
    },
    fetchOverview: params => {
        dispatch(SupplierBalanceAction.fetchOverview(params))
    },
    getAllSupplier: () => {
        dispatch(OrdersActions.getAllSupplier())
    },
    customTransaction: params => {
        dispatch(UserBalancesActions.customTransaction(params))
    },
    exportTransaction: () => {
        dispatch(SupplierBalanceAction.exportOrder())
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(SupplierBalances)