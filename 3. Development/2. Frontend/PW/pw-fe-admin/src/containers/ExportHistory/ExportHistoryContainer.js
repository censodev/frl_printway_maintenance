import { connect } from 'react-redux';

import { ExportHistoryActions, OrdersActions } from '../../redux/actions';
import ExportHistory from '../../views/ExportHistory/ExportHistory';


const mapStateToProps = state => ({
    exportHistory: state.toJS().exportHistory.exportHistory,
    listSuppliers: state.toJS().orders.listSuppliers,
})

const mapDispatchToProps =  dispatch => ({
    fetchExportHistory: params => {
        dispatch(ExportHistoryActions.fetchExportHistory(params))
    },
    getAllSupplier: () => {
        dispatch(OrdersActions.getAllSupplier())
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory)