import { connect } from 'react-redux';

import { OrdersActions, CarriesActions } from '../../redux/actions';
import OrderDetail from '../../views/OrderDetail/OrderDetail';
const mapStateToProps = state => ({
    oneOrder: state.toJS().orders.oneOrder,

    doSaveImageDesign: state.toJS().orders.doSaveImageDesign,
    saveImageDesignSuccess: state.toJS().orders.saveImageDesignSuccess,
    saveImageDesignError: state.toJS().orders.saveImageDesignError,

    // editNote: state.toJS().orders.editNote,
    // editNoteSuccess: state.toJS().orders.editNoteSuccess,
    // editNoteError: state.toJS().orders.editNoteError,
    editShipping: state.toJS().orders.editShipping,
    editShippingSuccess: state.toJS().orders.editShippingSuccess,
    editShippingError: state.toJS().orders.editShippingError,

    oneUser: state.toJS().orders.oneUser,

    setActionRequiredLoading: state.toJS().orders.setActionRequiredLoading,
    setActionRequiredSuccess: state.toJS().orders.setActionRequiredSuccess,
    setActionRequiredError: state.toJS().orders.setActionRequiredError,

    refundLoading: state.toJS().orders.refundLoading,
    refundSuccess: state.toJS().orders.refundSuccess,
    refundError: state.toJS().orders.refundError,

    resendLoading: state.toJS().orders.resendLoading,
    resendSuccess: state.toJS().orders.resendSuccess,
    resendError: state.toJS().orders.resendError,

    listSuppliers: state.toJS().orders.listSuppliers,
    assignSupplierLoading: state.toJS().orders.assignSupplierLoading,
    assignSupplierSuccess: state.toJS().orders.assignSupplierSuccess,
    assignSupplierError: state.toJS().orders.assignSupplierError,

    listCarriesNoPaging: state.toJS().carries.listCarriesNoPaging,
    assignCarrierLoading: state.toJS().orders.assignCarrierLoading,
    assignCarrierSuccess: state.toJS().orders.assignCarrierSuccess,
    assignCarrierError: state.toJS().orders.assignCarrierError,

    suppliersAssign: state.toJS().orders.suppliersAssign,

    addTrackingIdLoading: state.toJS().orders.addTrackingIdLoading,
    addTrackingIdSuccess: state.toJS().orders.addTrackingIdSuccess,
    addTrackingIdError: state.toJS().orders.addTrackingIdError,

    carriersAssign: state.toJS().orders.carriersAssign,

})

const mapDispatchToProps =  dispatch => ({
    fetchOneOrder : id => {
        dispatch(OrdersActions.fetchOneOrder(id))
    },
    saveImageDesign: value => {
        dispatch(OrdersActions.saveImageDesign(value))
    },
    // doEditNote: body => {
    //     dispatch(OrdersActions.doEditNote(body))
    // }
    doEditShipping: body => {
        dispatch(OrdersActions.doEditShipping(body))
    },
    fetchOneUser: email => {
        dispatch(OrdersActions.fetchOneUser(email))
    },
    setActionRequired: data => {
        dispatch(OrdersActions.setActionRequired(data))
    },
    refund: data => {
        dispatch(OrdersActions.refund(data))
    },
    resend: data => {
        dispatch(OrdersActions.resend(data))
    },
    assignSupplier: data => {
        dispatch(OrdersActions.assignSupplier(data))
    },
    assignCarrier: data => {
        dispatch(OrdersActions.assignCarrier(data))
    },
    getAllSupplier: () => {
        dispatch(OrdersActions.getAllSupplier())
    },
    fetchAllCarriesNoPaging: () => {
        dispatch(CarriesActions.fetchAllCarriesNoPaging())
    },
    getAssignSupplier: id => {
        dispatch(OrdersActions.getAssignSupplier(id))
    },
    addTrackingId: params => {
        dispatch(OrdersActions.addTrackingId(params))
    },
    getAssignCarrier: id => {
        dispatch(OrdersActions.getAssignCarrier(id))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)