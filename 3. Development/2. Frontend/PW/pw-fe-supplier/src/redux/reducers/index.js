import {combineReducers} from 'redux-immutable';

import {auth} from './AuthReducer';
import {news} from './NewsReducer';
import {balance} from './BalanceReducer';
import {products} from './ProductsReducer';
import {orders} from './OrdersReducer';
import {profile} from './ProfileReducer';
import {exportHistory} from './ExportHistoryReducer';
import {dashboard} from './DashboardReducer';

export default combineReducers({
    auth,
    news,
    balance,
    products,
    orders,
    profile,
    exportHistory,
    dashboard
});
