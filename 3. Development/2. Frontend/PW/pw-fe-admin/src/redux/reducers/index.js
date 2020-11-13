import { combineReducers } from 'redux-immutable';

import { auth } from './AuthReducer';
import { carries } from './CarriesReducer';
import { categories } from './CategoriesReducer';
import { sellerLevels } from './SellerLevelsReducer';
import { news } from './NewsReducer';
import { sites } from './SitesReducer';
import { users } from './UsersReducer';
import { suppliers } from './SuppliersReducer';
import { productTypes } from './ProductTypesReducer';
import { userBalances } from './UserBalancesReducer';
import { supplierBalances } from './SupplierBalanceReducer';
import { orders } from './OrdersReducer';
import { products } from './ProductsReducer';
import { profile } from './ProfileReducer';
import { dashboard } from './DashboardReducer';
import { exportHistory } from './ExportHistoryReducer';
import { contentSetting } from './ContentSettingReducer';

export default combineReducers({
    auth,
    carries,
    categories,
    sellerLevels,
    news,
    sites,
    users,
    suppliers,
    productTypes,
    userBalances,
    supplierBalances,
    orders,
    products,
    profile,
    dashboard,
    exportHistory,
    contentSetting
});
