import { connect } from 'react-redux';

import { ExportHistoryActions } from '../../redux/actions';
import ExportHistory from '../../views/ExportHistory/ExportHistory';


const mapStateToProps = state => ({
    exportHistory: state.toJS().exportHistory.exportHistory,

})

const mapDispatchToProps =  dispatch => ({
    fetchExportHistory: params => {
        dispatch(ExportHistoryActions.fetchExportHistory(params))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory)