import { connect } from 'react-redux';

import { OrdersActions, ProductsActions, SiteActions, CarriesActions } from '../../redux/actions';
import Orders from '../../views/Orders/Orders';

const mapStateToProps = state => ({
    listOrders: state.toJS().orders.listOrders,
    doSaveImageDesign: state.toJS().orders.doSaveImageDesign,
    saveImageDesignSuccess: state.toJS().orders.saveImageDesignSuccess,
    saveImageDesignError: state.toJS().orders.saveImageDesignError,
    listProductTypeNoPaging: state.toJS().products.listProductTypeNoPaging,
    listSeller: state.toJS().products.listSeller,
    doExport: state.toJS().orders.doExport,
    exportError: state.toJS().orders.exportError,
    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
    setActionRequiredLoading: state.toJS().orders.setActionRequiredLoading,
    setActionRequiredSuccess: state.toJS().orders.setActionRequiredSuccess,
    setActionRequiredError: state.toJS().orders.setActionRequiredError,

    doResolve: state.toJS().orders.doResolve,
    resolveSuccess: state.toJS().orders.resolveSuccess,
    resolveError: state.toJS().orders.resolveError,

    resolveOnHoldLoading: state.toJS().orders.resolveOnHoldLoading,
    resolveOnHoldSuccess: state.toJS().orders.resolveOnHoldSuccess,
    resolveOnHoldError: state.toJS().orders.resolveOnHoldError,

    listSuppliers: state.toJS().orders.listSuppliers,

    refundLoading: state.toJS().orders.refundLoading,
    refundSuccess: state.toJS().orders.refundSuccess,
    refundError: state.toJS().orders.refundError,

    resendLoading: state.toJS().orders.resendLoading,
    resendSuccess: state.toJS().orders.resendSuccess,
    resendError: state.toJS().orders.resendError,

    cancelSuccess: state.toJS().orders.cancelSuccess,
    cancelLoading: state.toJS().orders.cancelLoading,
    cancelError: state.toJS().orders.cancelError,

    assignSupplierLoading: state.toJS().orders.assignSupplierLoading,
    assignSupplierSuccess: state.toJS().orders.assignSupplierSuccess,
    assignSupplierError: state.toJS().orders.assignSupplierError,

    listCarriesNoPaging: state.toJS().carries.listCarriesNoPaging,
    assignCarrierLoading: state.toJS().orders.assignCarrierLoading,
    assignCarrierSuccess: state.toJS().orders.assignCarrierSuccess,
    assignCarrierError: state.toJS().orders.assignCarrierError,

    listStatistic: state.toJS().orders.listStatistic,
    suppliersAssign: state.toJS().orders.suppliersAssign,

    acceptCancelLoading: state.toJS().orders.acceptCancelLoading,
    acceptCancelSuccess: state.toJS().orders.acceptCancelSuccess,
    acceptCancelError: state.toJS().orders.acceptCancelError,

    rejectCancelLoading: state.toJS().orders.rejectCancelLoading,
    rejectCancelSuccess: state.toJS().orders.rejectCancelSuccess,
    rejectCancelError: state.toJS().orders.rejectCancelError,

    addTrackingIdLoading: state.toJS().orders.addTrackingIdLoading,
    addTrackingIdSuccess: state.toJS().orders.addTrackingIdSuccess,
    addTrackingIdError: state.toJS().orders.addTrackingIdError,

    exportErrorFileLoading: state.toJS().orders.exportErrorFileLoading,
    exportErrorFileSuccess: state.toJS().orders.exportErrorFileSuccess,
    exportErrorFileError: state.toJS().orders.exportErrorFileError,

    carriersAssign: state.toJS().orders.carriersAssign,

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
    fetchAllSeller: () => {
        dispatch(ProductsActions.fetchAllSeller())
    },
    fetchAllSitesNoPaging: () => {
        dispatch(SiteActions.fetchAllSitesNoPaging())
    },
    resolve: data => {
        dispatch(OrdersActions.resolve(data))
    },
    setActionRequired: data => {
        dispatch(OrdersActions.setActionRequired(data))
    },
    resolveOnHold: data => {
        dispatch(OrdersActions.resolveOnHold(data))
    },
    getAllSupplier: () => {
        dispatch(OrdersActions.getAllSupplier())
    },
    refund: data => {
        dispatch(OrdersActions.refund(data))
    },
    resend: data => {
        dispatch(OrdersActions.resend(data))
    },
    cancel: data => {
        dispatch(OrdersActions.cancel(data))
    },
    assignSupplier: data => {
        dispatch(OrdersActions.assignSupplier(data))
    },
    assignCarrier: data => {
        dispatch(OrdersActions.assignCarrier(data))
    },
    fetchAllCarriesNoPaging: () => {
        dispatch(CarriesActions.fetchAllCarriesNoPaging())
    },
    fetchStatistic: () => {
        dispatch(OrdersActions.fetchStatistic())
    },
    getAssignSupplier: id => {
        dispatch(OrdersActions.getAssignSupplier(id))
    },
    acceptCancel: data => {
        dispatch(OrdersActions.acceptCancel(data))
    },
    rejectCancel: data => {
        dispatch(OrdersActions.rejectCancel(data))
    },
    addTrackingId: params => {
        dispatch(OrdersActions.addTrackingId(params))
    },
    exportErrorFile: params => {
        dispatch(OrdersActions.exportErrorFile(params))
    },
    getAssignCarrier: id => {
        dispatch(OrdersActions.getAssignCarrier(id))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Orders)