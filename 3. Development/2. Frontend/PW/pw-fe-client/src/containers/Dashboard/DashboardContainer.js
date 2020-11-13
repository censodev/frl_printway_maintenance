import {connect} from 'react-redux';

import {DashboardActions, SiteActions} from '../../redux/actions';
import Dashboard from "../../views/Dashboard/Dashboard";

const mapStateToProps = (state) => ({
    listStatistic: state.toJS().dashboard.listStatistic,
    listStatus: state.toJS().dashboard.listStatus,
    topProduct: state.toJS().dashboard.topProduct,
    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
    urgentNote: state.toJS().dashboard.urgentNote,
});

const mapDispatchToProps = (dispatch) => ({
    fetchStatistic: (params) => dispatch(DashboardActions.fetchStatistic(params)),
    fetchStatus: () => dispatch(DashboardActions.fetchStatus()),
    fetchTopProduct: (params) => dispatch(DashboardActions.fetchTopProduct(params)),
    fetchAllSitesNoPaging: () => dispatch(SiteActions.fetchAllSitesNoPaging()),
    fetchUrgentNote: () => dispatch(DashboardActions.fetchUrgentNote()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Dashboard);
