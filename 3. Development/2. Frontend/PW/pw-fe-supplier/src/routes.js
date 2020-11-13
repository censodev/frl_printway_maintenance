import React from 'react';

const Category = React.lazy(() => import('./containers/Category/CategoryContainer'));
// const Categories = React.lazy(() => import('./containers/Categories/CategoriesContainer'));
const News = React.lazy(() => import('./containers/News/NewsContainer'));
const Balance = React.lazy(() => import('./containers/Balance/BalanceContainer'));
const Profile = React.lazy(() => import('./containers/Profile/ProfileContainer'));

const Orders = React.lazy(() => import('./containers/Orders/OrdersContainer'));
const OrderDetail = React.lazy(() => import('./containers/OrderDetail/OrderDetailContainer'));
const ExportHistory = React.lazy(() => import('./containers/ExportHistory/ExportHistoryContainer'));

const routes = [
    {path: '/news', exact: true, component: News},
    {path: '/category/:id', exact: true, component: Category},
    {path: '/balance', exact: true, component: Balance},
    {path: '/profile', exact: true, component: Profile},
    {path: '/orders', exact: true, component: Orders},
    {path: '/order/:id', exact: true, component: OrderDetail},
    {path: '/export_history', exact: true, component: ExportHistory}
];

export default routes;
