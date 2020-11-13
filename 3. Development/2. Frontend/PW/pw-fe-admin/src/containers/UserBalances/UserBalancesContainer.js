import { connect } from 'react-redux';

import { UserBalancesActions, ProductsActions, SiteActions } from '../../redux/actions';
import UserBalances from '../../views/UserBalances/UserBalances';
const mapStateToProps = state => ({
    listBalances: state.toJS().userBalances.listBalances,
    userBalance: state.toJS().userBalances.userBalance,

    approve: state.toJS().userBalances.approve,
    approveSuccess: state.toJS().userBalances.approveSuccess,
    approveError: state.toJS().userBalances.approveError,

    rejectLoading: state.toJS().userBalances.reject,
    rejectSuccess: state.toJS().userBalances.rejectSuccess,
    rejectError: state.toJS().userBalances.rejectError,

    listSeller: state.toJS().products.listSeller,

    customTransactionLoading: state.toJS().userBalances.customTransactionLoading,
    customTransactionSuccess: state.toJS().userBalances.customTransactionSuccess,
    customTransactionError: state.toJS().userBalances.customTransactionError,

    exportLoading: state.toJS().userBalances.exportLoading,
    exportSuccess: state.toJS().userBalances.exportSuccess,
    exportError: state.toJS().userBalances.exportError,

    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
})

const mapDispatchToProps =  dispatch => ({
    doFetchAllBalances: params => {
        dispatch(UserBalancesActions.doFetchAllBalances(params))
    },
    doFetchUserBalance: (sellerId) => {
        dispatch(UserBalancesActions.doFetchUserBalance(sellerId))
    },
    approve: id => {
        dispatch(UserBalancesActions.approve(id))
    },
    reject: obj => {
        dispatch(UserBalancesActions.reject(obj))
    },
    fetchAllSeller: () => {
        dispatch(ProductsActions.fetchAllSeller())
    },
    customTransaction: params => {
        dispatch(UserBalancesActions.customTransaction(params))
    },
    exportOrder: (params) => {
        dispatch(UserBalancesActions.exportOrder(params))
    },
    fetchAllSitesNoPaging: () => {
        dispatch(SiteActions.fetchAllSitesNoPaging())
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(UserBalances)