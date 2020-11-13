import {connect} from 'react-redux';
import {AuthActions} from '../../redux/actions';
import Activate from '../../views/Login/Activate/Activate';

const mapStateToProps = (state) => ({
    auth: state.toJS().auth,
});

const mapDispatchToProps = (dispatch) => ({
    activate: (key) => dispatch(AuthActions.activate(key)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Activate);
