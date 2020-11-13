import {connect} from 'react-redux';
import Category from '../../views/Category/Category';
// import {AuthActions} from '../../redux/actions';

const mapStateToProps = (state) => ({
    userInfo: state.toJS().auth.userInfo,
});

// const mapDispatchToProps = (dispatch) => ({
//     login: (params) => dispatch(AuthActions.login(params)),
//     register: (params) => dispatch(AuthActions.register(params)),
// });

export default connect(
    mapStateToProps,
    null,
)(Category);
