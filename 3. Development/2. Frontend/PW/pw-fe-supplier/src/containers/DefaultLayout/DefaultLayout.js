import React, {Component, Suspense} from 'react';
import {Layout, Spin} from 'antd';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import routes from '../../routes';
import cls from './style.module.less';

const {Content} = Layout;

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

    loading = () => (
        <div className="page-loading">
            <Spin/>
        </div>
    );

    signOut = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    validateLoggedIn = () => {
        if (!localStorage.id_token) {
            return false;
        }

        // check if auth token exists and is valid
        return true;
    };

    render() {

        const {history, match} = this.props;

        return (
            <Layout>
                <DefaultAside history={history} match={match}/>
                <Layout>
                    <DefaultHeader signOut={this.signOut} history={history}/>
                    <Suspense fallback={this.loading()}>
                        <Content className={cls.wrap}>
                            <Suspense fallback={this.loading()}>
                                <Switch>
                                    {routes.map((route, idx) => (route.component ? (
                                        <Route
                                            key={idx.toString()}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={(props) => (this.validateLoggedIn()
                                                ? (<route.component {...props} />)
                                                : (<Redirect to={{pathname: '/login'}}/>))}
                                        />
                                    ) : (null)))}
                                    <Redirect from="/" to="/orders"/>
                                </Switch>
                            </Suspense>
                        </Content>
                    </Suspense>
                    <DefaultFooter/>
                </Layout>
            </Layout>
        );
    }
}

export default DefaultLayout;
