import {connect} from 'react-redux';

import {NewsActions} from '../../redux/actions';
import News from "../../views/News/News";

const mapStateToProps = (state) => ({
    listNews: state.toJS().news.listNews,
    createLoading: state.toJS().news.createLoading,
    createSuccess: state.toJS().news.createSuccess,
    createError: state.toJS().news.createError,
    editLoading: state.toJS().news.editLoading,
    editSuccess: state.toJS().news.editSuccess,
    editError: state.toJS().news.editError,
    deleteLoading: state.toJS().news.deleteLoading,
    deleteSuccess: state.toJS().news.deleteSuccess,
    deleteError: state.toJS().news.deleteError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllNews: (params) => dispatch(NewsActions.fetchAllNews(params)),
    createNew: (params) => dispatch(NewsActions.createNew(params)),
    editNew: (params) => dispatch(NewsActions.editNew(params)),
    deleteNew: (id) => dispatch(NewsActions.deleteNew(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(News);
