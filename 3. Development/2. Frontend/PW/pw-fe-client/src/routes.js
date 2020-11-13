import React from 'react';

const Category = React.lazy(() => import('./containers/Category/CategoryContainer'));
// const Categories = React.lazy(() => import('./containers/Categories/CategoriesContainer'));
const Sites = React.lazy(() => import('./containers/Sites/SitesContainer'));
const News = React.lazy(() => import('./containers/News/NewsContainer'));
const Balance = React.lazy(() => import('./containers/Balance/BalanceContainer'));
const Products = React.lazy(() => import('./containers/Products/ProductsContainer'));
const Profile = React.lazy(() => import('./containers/Profile/ProfileContainer'));

const Orders = React.lazy(() => import('./containers/Orders/OrdersContainer'));
const OrderDetail = React.lazy(() => import('./containers/OrderDetail/OrderDetailContainer'));
const Dashboard = React.lazy(() => import('./containers/Dashboard/DashboardContainer'));

const routes = [
    // {path: '/', exact: true, component: Sites},
    {path: '/', exact: true, component: Dashboard},
    {path: '/news', exact: true, component: News},
    {path: '/sites', exact: true, component: Sites},
    {path: '/category/:id', exact: true, component: Category},
    {path: '/balance', exact: true, component: Balance},
    {path: '/products', exact: true, component: Products},
    {path: '/profile', exact: true, component: Profile},
    {path: '/orders', exact: true, component: Orders},
    {path: '/order/:id', exact: true, component: OrderDetail},
];

export default routes;
