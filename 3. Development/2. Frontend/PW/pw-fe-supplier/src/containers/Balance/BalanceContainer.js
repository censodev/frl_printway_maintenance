import { connect } from 'react-redux';

import { BalanceActions } from '../../redux/actions';
import Balance from '../../views/Balance/Balance';


const mapStateToProps = state => ({
    listBalances: state.toJS().balance.listBalances,
    overview: state.toJS().balance.overview,

    createDeposit: state.toJS().balance.createDeposit,
    createDepositError: state.toJS().balance.createDepositError,
    createDepositSuccess: state.toJS().balance.createDepositSuccess,

    updateDeposit: state.toJS().balance.updateDeposit,
    updateDepositSuccess: state.toJS().balance.updateDepositSuccess,
    updateDepositError: state.toJS().balance.updateDepositError,

    delete: state.toJS().balance.delete,
    deleteSuccess: state.toJS().balance.deleteSuccess,
    deleteError: state.toJS().balance.deleteError,
})

const mapDispatchToProps =  dispatch => ({
    fetchAllBalances: params => {
        dispatch(BalanceActions.fetchAllBalances(params))
    },
    fetchOverview: () => {
        dispatch(BalanceActions.fetchOverview())
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
})
export default connect(mapStateToProps, mapDispatchToProps)(Balance)