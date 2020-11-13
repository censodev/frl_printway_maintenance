import {connect} from 'react-redux';
import Login from '../../views/Login/index.js';
import {AuthActions} from '../../redux/actions';

const mapStateToProps = (state) => ({
    auth: state.toJS().auth,
});

const mapDispatchToProps = (dispatch) => ({
    login: (params) => dispatch(AuthActions.login(params)),
    register: (params) => dispatch(AuthActions.register(params)),
    forgotPass: (params) => dispatch(AuthActions.forgotPass(params)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
