import { connect } from 'react-redux';

import { OrdersActions, ProductsActions, SiteActions } from '../../redux/actions';
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
    resolveOnHoldLoading: state.toJS().orders.resolveOnHoldLoading,
    resolveOnHoldSuccess: state.toJS().orders.resolveOnHoldSuccess,
    resolveOnHoldError: state.toJS().orders.resolveOnHoldError,
    onHoldLoading: state.toJS().orders.onHoldLoading,
    onHoldSuccess: state.toJS().orders.onHoldSuccess,
    onHoldError: state.toJS().orders.onHoldError,

    resendLoading: state.toJS().orders.resendLoading,
    resendSuccess: state.toJS().orders.resendSuccess,
    resendError: state.toJS().orders.resendError,

    cancelSuccess: state.toJS().orders.cancelSuccess,
    cancelLoading: state.toJS().orders.cancelLoading,
    cancelError: state.toJS().orders.cancelError,
    
    listSuppliers: state.toJS().orders.listSuppliers,
    
    listStatistic: state.toJS().orders.listStatistic,

    listCarriesNoPaging: state.toJS().orders.listCarriesNoPaging,
    assignCarrierLoading: state.toJS().orders.assignCarrierLoading,
    assignCarrierSuccess: state.toJS().orders.assignCarrierSuccess,
    assignCarrierError: state.toJS().orders.assignCarrierError,
    
    carriersAssign: state.toJS().orders.carriersAssign,

    exportErrorFileLoading: state.toJS().orders.exportErrorFileLoading,
    exportErrorFileSuccess: state.toJS().orders.exportErrorFileSuccess,
    exportErrorFileError: state.toJS().orders.exportErrorFileError
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
    resolveOnHold: data => {
        dispatch(OrdersActions.resolveOnHold(data))
    },
    onHold: data => {
        dispatch(OrdersActions.onHold(data))
    },
    getAllSupplier: () => {
        dispatch(OrdersActions.getAllSupplier())
    },
    resend: data => {
        dispatch(OrdersActions.resend(data))
    },
    cancel: data => {
        dispatch(OrdersActions.cancel(data))
    },
    fetchStatistic: () => {
        dispatch(OrdersActions.fetchStatistic())
    },
    assignCarrier: data => {
        dispatch(OrdersActions.assignCarrier(data))
    },
    fetchAllCarriesNoPaging: () => {
        dispatch(OrdersActions.fetchAllCarriesNoPaging())
    },
    getAssignCarrier: id => {
        dispatch(OrdersActions.getAssignCarrier(id))
    },
    exportErrorFile: params => {
        dispatch(OrdersActions.exportErrorFile(params))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Orders)