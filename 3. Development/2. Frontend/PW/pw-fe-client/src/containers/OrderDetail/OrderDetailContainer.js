import { connect } from 'react-redux';

import { OrdersActions } from '../../redux/actions';
import OrderDetail from '../../views/OrderDetail/OrderDetail';
const mapStateToProps = state => ({
    oneOrder: state.toJS().orders.oneOrder,

    doSaveImageDesign: state.toJS().orders.doSaveImageDesign,
    saveImageDesignSuccess: state.toJS().orders.saveImageDesignSuccess,
    saveImageDesignError: state.toJS().orders.saveImageDesignError,

    editNote: state.toJS().orders.editNote,
    editNoteSuccess: state.toJS().orders.editNoteSuccess,
    editNoteError: state.toJS().orders.editNoteError,

    editShipping: state.toJS().orders.editShipping,
    editShippingSuccess: state.toJS().orders.editShippingSuccess,
    editShippingError: state.toJS().orders.editShippingError,

    oneUser: state.toJS().orders.oneUser,

    onHoldLoading: state.toJS().orders.onHoldLoading,
    onHoldSuccess: state.toJS().orders.onHoldSuccess,
    onHoldError: state.toJS().orders.onHoldError,

    
    resendLoading: state.toJS().orders.resendLoading,
    resendSuccess: state.toJS().orders.resendSuccess,
    resendError: state.toJS().orders.resendError,

    auth: state.toJS().auth,
})

const mapDispatchToProps =  dispatch => ({
    fetchOneOrder : id => {
        dispatch(OrdersActions.fetchOneOrder(id))
    },
    saveImageDesign: value => {
        dispatch(OrdersActions.saveImageDesign(value))
    },
    doEditNote: body => {
        dispatch(OrdersActions.doEditNote(body))
    },
    doEditShipping: body => {
        dispatch(OrdersActions.doEditShipping(body))
    },
    fetchOneUser: email => {
        dispatch(OrdersActions.fetchOneUser(email))
    },
    onHold: data => {
        dispatch(OrdersActions.onHold(data))
    },
    resend: data => {
        dispatch(OrdersActions.resend(data))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)