import {connect} from 'react-redux';

import {DashboardActions, ProductsActions, SiteActions} from '../../redux/actions';
import Dashboard from "../../views/Dashboard/Dashboard";

const mapStateToProps = (state) => ({
    listStatistic: state.toJS().dashboard.listStatistic,
    listSeller: state.toJS().products.listSeller,
    listStatus: state.toJS().dashboard.listStatus,
    topProduct: state.toJS().dashboard.topProduct,
    topProductType: state.toJS().dashboard.topProductType,
    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
    urgentNote: state.toJS().dashboard.urgentNote,
});

const mapDispatchToProps = (dispatch) => ({
    fetchStatistic: (params) => dispatch(DashboardActions.fetchStatistic(params)),
    fetchStatus: () => dispatch(DashboardActions.fetchStatus()),
    fetchTopProduct: (params) => dispatch(DashboardActions.fetchTopProduct(params)),
    fetchTopProductType: (params) => dispatch(DashboardActions.fetchTopProductType(params)),
    fetchAllSeller: () => dispatch(ProductsActions.fetchAllSeller()),
    fetchAllSitesNoPaging: () => dispatch(SiteActions.fetchAllSitesNoPaging()),
    fetchUrgentNote: () => dispatch(DashboardActions.fetchUrgentNote()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Dashboard);
