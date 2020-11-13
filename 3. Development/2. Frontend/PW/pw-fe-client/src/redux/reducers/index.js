import {combineReducers} from 'redux-immutable';

import {auth} from './AuthReducer';
import {sites} from './SitesReducer';
import {news} from './NewsReducer';
import {balance} from './BalanceReducer';
import {products} from './ProductsReducer';
import {orders} from './OrdersReducer';
import {profile} from './ProfileReducer';
import {dashboard} from './DashboardReducer';

export default combineReducers({
    auth,
    sites,
    news,
    balance,
    products,
    orders,
    profile,
    dashboard,
});
