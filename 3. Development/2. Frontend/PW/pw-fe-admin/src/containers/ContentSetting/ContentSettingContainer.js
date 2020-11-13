import {connect} from 'react-redux';

import {ContentSettingActions} from '../../redux/actions';
import Content from '../../views/ContentSetting/index';


const mapStateToProps = (state) => ({
    listContentSetting: state.toJS().contentSetting.listContentSetting,
    editContentLoading: state.toJS().contentSetting.editContentLoading,
    editContentSuccess: state.toJS().contentSetting.editContentSuccess,
    editContentError: state.toJS().contentSetting.editContentError,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllContentSetting: () => dispatch(ContentSettingActions.fetchAllContentSetting()),
    editContentSetting: (params) => dispatch(ContentSettingActions.editContentSetting(params)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Content);
