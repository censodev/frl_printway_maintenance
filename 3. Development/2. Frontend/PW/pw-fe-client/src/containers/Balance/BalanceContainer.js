import { connect } from 'react-redux';

import { BalanceActions, SiteActions } from '../../redux/actions';
import Balance from '../../views/Balance/Balance';


const mapStateToProps = state => ({
    listBalances: state.toJS().balance.listBalances,
    sellerBalance: state.toJS().balance.sellerBalance,

    createDeposit: state.toJS().balance.createDeposit,
    createDepositError: state.toJS().balance.createDepositError,
    createDepositSuccess: state.toJS().balance.createDepositSuccess,

    updateDeposit: state.toJS().balance.updateDeposit,
    updateDepositSuccess: state.toJS().balance.updateDepositSuccess,
    updateDepositError: state.toJS().balance.updateDepositError,

    delete: state.toJS().balance.delete,
    deleteSuccess: state.toJS().balance.deleteSuccess,
    deleteError: state.toJS().balance.deleteError,

    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,

})

const mapDispatchToProps =  dispatch => ({
    doFetchAllBalances: params => {
        dispatch(BalanceActions.doFetchAllBalances(params))
    },
    doFetchSellerBalance: () => {
        dispatch(BalanceActions.doFetchSellerBalance())
    },
    doCreateDeposit: params => {
        dispatch(BalanceActions.doCreateDeposit(params))
    },
    doUpdateDeposit: params => {
        dispatch(BalanceActions.doUpdateDeposit(params))
    },
    doDeleteDeposit: id => {
        dispatch(BalanceActions.doDeleteDeposit(id))
    },
    resetError: () => {
        dispatch(BalanceActions.resetError())
    },
    fetchAllSitesNoPaging: () => {
        dispatch(SiteActions.fetchAllSitesNoPaging())
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Balance)