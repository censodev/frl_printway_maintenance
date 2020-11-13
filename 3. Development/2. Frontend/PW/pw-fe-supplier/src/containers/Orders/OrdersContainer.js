import { connect } from 'react-redux';

import { OrdersActions, ProductsActions, DashboardActions } from '../../redux/actions';
import Orders from '../../views/Orders/Orders';
const mapStateToProps = state => ({
    listOrders: state.toJS().orders.listOrders,
    doSaveImageDesign: state.toJS().orders.doSaveImageDesign,
    saveImageDesignSuccess: state.toJS().orders.saveImageDesignSuccess,
    saveImageDesignError: state.toJS().orders.saveImageDesignError,
    listProductTypeNoPaging: state.toJS().products.listProductTypeNoPaging,
    doExport: state.toJS().orders.doExport,
    exportSuccess: state.toJS().orders.exportSuccess,
    exportError: state.toJS().orders.exportError,

    cancelSuccess: state.toJS().orders.cancelSuccess,
    cancelLoading: state.toJS().orders.cancelLoading,
    cancelError: state.toJS().orders.cancelError,

    listStatistic: state.toJS().orders.listStatistic,

    reportLoading: state.toJS().orders.reportLoading,
    reportSuccess: state.toJS().orders.reportSuccess,
    reportError: state.toJS().orders.reportError,
    urgentNote: state.toJS().dashboard.urgentNote,
})

const mapDispatchToProps = dispatch => ({
    fetchAllOrder: params => {
        dispatch(OrdersActions.fetchAllOrder(params))
    },
    exportOrder: (params, arr) => {
        dispatch(OrdersActions.exportOrder(params, arr))
    },
    importOrder: () => {
        dispatch(OrdersActions.importOrder())
    },
    saveImageDesign: value => {
        dispatch(OrdersActions.saveImageDesign(value))
    },
    fetchAllProductTypeNoPaging: (params) => {
        dispatch(ProductsActions.fetchAllProductTypeNoPaging())
    },
    cancel: data => {
        dispatch(OrdersActions.cancel(data))
    },
    fetchStatistic: () => {
        dispatch(OrdersActions.fetchStatistic())
    },
    report: params => {
        dispatch(OrdersActions.report(params))
    },
    fetchUrgentNote: () => dispatch(DashboardActions.fetchUrgentNote()),
})
export default connect(mapStateToProps, mapDispatchToProps)(Orders)
