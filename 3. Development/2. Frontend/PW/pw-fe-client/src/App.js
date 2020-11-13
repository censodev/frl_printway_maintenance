import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import {IntlProvider} from 'react-intl';
import {Spin} from 'antd';
import messages from './config/messages';
import './global.less';

const loading = () => (
    <div className="page-loading">
        <Spin size='large'/>
    </div>
);

// Pages
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const Login = React.lazy(() => import('./containers/Login/LoginContainer'));
const Activate = React.lazy(() => import('./containers/Activate/ActivateContainer'));
const Reset = React.lazy(() => import('./containers/ResetPass/ResetPassContainer'));

class App extends React.Component {
    render() {
        const lang = localStorage.lang || 'VN';

        let locale = 'vi';
        if (lang === 'GB') {
            locale = 'en';
        }

        return (
            <IntlProvider
                locale={locale}
                messages={messages[lang]}
                key={lang}
            >
                <Router>
                    <React.Suspense fallback={loading()}>
                        <Switch>
                            <Route
                                exact
                                path="/login"
                                name="Login Page"
                                render={(props) => <Login {...props} />}
                            />
                            <Route
                                exact
                                path="/activate"
                                name="Activate Page"
                                render={(props) => <Activate {...props} />}
                            />
                            <Route
                                exact
                                path="/forgot"
                                name="Forgot Page"
                                render={(props) => <Login {...props} />}
                            />
                            <Route
                                exact
                                path="/account/reset/finish"
                                name="Reset Password Page"
                                render={(props) => <Reset {...props} />}
                            />
                            <Route
                                path="/"
                                name="Home"
                                render={(props) => <DefaultLayout {...props} />}
                            />
                        </Switch>
                    </React.Suspense>
                </Router>
            </IntlProvider>
        );
    }
}

export default App;
