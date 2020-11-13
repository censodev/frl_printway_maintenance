import {connect} from 'react-redux';
import {AuthActions} from '../../redux/actions';
import ResetPass from '../../views/Login/ResetPass/ResetPass';

const mapStateToProps = (state) => ({
    auth: state.toJS().auth,
});

const mapDispatchToProps = (dispatch) => ({
    resetPass: (params) => dispatch(AuthActions.resetPass(params)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResetPass);
