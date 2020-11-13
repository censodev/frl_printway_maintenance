import React from 'react';

const Categories = React.lazy(() => import('./containers/Categories/CategoriesContainer'));
const Carries = React.lazy(() => import('./containers/Carries/CarriesContainer'));
const SellerLevels = React.lazy(() => import('./containers/SellerLevels/SellerLevelsContainer'));
const News = React.lazy(() => import('./containers/News/NewsContainer'));
const Sites = React.lazy(() => import('./containers/Sites/SitesContainer'));
const Users = React.lazy(() => import('./containers/Users/UsersContainer'));
const Suppliers = React.lazy(() => import('./containers/Suppliers/SuppliersContainer'));
const ProductTypes = React.lazy(() => import('./containers/ProductTypes/ProductTypesContainer'));
const UserBalances = React.lazy(() => import('./containers/UserBalances/UserBalancesContainer'));
const SupplierBalances = React.lazy(() => import('./containers/SupplierBalance/SupplierBalanceContainer'));
const Orders = React.lazy(() => import('./containers/Orders/OrdersContainer'));
const OrderDetail = React.lazy(() => import('./containers/OrderDetail/OrderDetailContainer'))
const Products = React.lazy(() => import('./containers/Products/ProductsContainer'));
const Profile = React.lazy(() => import('./containers/Profile/ProfileContainer'));
const Dashboard = React.lazy(() => import('./containers/Dashboard/DashboardContainer'));
const ExportHistory = React.lazy(() => import('./containers/ExportHistory/ExportHistoryContainer'));
const ContentSetting = React.lazy(() => import('./containers/ContentSetting/ContentSettingContainer'));

const routes = [
    {path: '/', exact: true, component: Dashboard},
    {path: '/categories', exact: true, component: Categories},
    {path: '/carriers', exact: true, component: Carries},
    {path: '/levels', exact: true, component: SellerLevels},
    {path: '/news', exact: true, component: News},
    {path: '/sites', exact: true, component: Sites},
    {path: '/users', exact: true, component: Users},
    {path: '/suppliers', exact: true, component: Suppliers},
    {path: '/productTypes', exact: true, component: ProductTypes},
    {path: '/balance/user', exact: true, component: UserBalances},
    {path: '/balance/supplier', exact: true, component: SupplierBalances},
    {path: '/orders', exact: true, component: Orders},
    {path: '/order/:id', exact: true, component: OrderDetail},
    {path: '/products', exact: true, component: Products},
    {path: '/profile', exact: true, component: Profile},
    {path: '/export_history', exact: true, component: ExportHistory},
    {path: '/content_setting', exact: true, component: ContentSetting}
];

export default routes;
