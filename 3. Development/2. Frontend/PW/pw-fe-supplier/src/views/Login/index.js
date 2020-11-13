import React, {Component} from 'react';
// import SelectLang from "../../components/SelectLang";
import {Layout, Tabs} from "antd";
import logo2 from '../../assets/logo2.svg';
import cls from './login.module.scss';
import Register from "./Register";
import Login from "./Login";
import _ from "lodash";
import ForgotPass from "./ForgotPass";

const {Content, Footer} = Layout;
const {TabPane} = Tabs;


class Auth extends Component {

    callback = (key) => {
        // console.log(key);
    };

    render() {

        const {login, register, auth, match, history, forgotPass} = this.props;


        const token = _.get(auth, 'id_token');
        if (token || localStorage.id_token) {
            window.location.href = '/';
        }

        return (
            <Layout className={cls.wrap}>
                {/*<Header style={{backgroundColor: 'transparent'}}>*/}
                {/*    <div className={cls.lang}>*/}
                {/*        <SelectLang/>*/}
                {/*    </div>*/}
                {/*</Header>*/}
                <Content className={cls.contentWrap}>
                    <div className={cls.title}>
                        <img src={logo2}/>
                    </div>
                    <div className={cls.content}>
                        {/*{*/}
                        {/*    match && match.path && match.path === '/forgot' ? (*/}
                        {/*        <ForgotPass auth={auth} forgotPass={forgotPass} history={history}/>*/}
                        {/*    ) : (*/}
                        {/*        <Tabs defaultActiveKey="1" onChange={this.callback} animated={false}*/}
                        {/*              style={{textAlign: 'center'}} size='large'>*/}
                        {/*            <TabPane tab="Login" key="1">*/}
                        {/*                <Login login={login} auth={auth} match={match} history={history}/>*/}
                        {/*            </TabPane>*/}
                        {/*            <TabPane tab="Register" key="2">*/}
                        {/*                <Register auth={auth} register={register}/>*/}
                        {/*            </TabPane>*/}
                        {/*        </Tabs>*/}
                        {/*    )*/}
                        {/*}*/}
                        <Login login={login} auth={auth} match={match} history={history}/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    Copyright © 2020 PrintWay. <span>All rights reserved.</span>
                </Footer>
            </Layout>
        );
    }
}

export default Auth;
