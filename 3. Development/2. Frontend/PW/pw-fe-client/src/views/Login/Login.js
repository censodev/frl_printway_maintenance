import React, {Component} from 'react';
import {Button, Checkbox, Form, Input, Alert} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import cls from "./login.module.scss";
import CatchError from "../../core/util/CatchError";
import ForgotPass from "./ForgotPass";

class Login extends Component {

    onFinish = (values) => {
        delete values.remember;
        // console.log(values);
        const {login} = this.props;
        login(values);
    };

    render() {

        const {auth, history} = this.props;
        const {error, loading} = auth;


        return <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={this.onFinish}
        >
            {
                error && (
                    <Form.Item>
                        <Alert message={CatchError[error] || error} type="error" showIcon
                               style={{textAlign: 'left'}}/>
                    </Form.Item>
                )
            }
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input correct email!',
                        type: 'email'
                    },
                ]}
                style={{textAlign: 'left'}}
            >
                <Input size='large' prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Email"/>
            </Form.Item>
            <Form.Item
                name="password"
                style={{textAlign: 'left'}}
                rules={[
                    {
                        required: true,
                        message: 'Please input your password! (at least 5 characters)',
                        min: 5
                    },
                ]}
            >
                <Input
                    size='large'
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item style={{marginBottom: '5px'}}>
                <Form.Item name="remember" valuePropName="" className={cls.remember}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Button className={cls.forgot} type='link' onClick={() => history.push('/forgot')}>
                    Forgot password?
                </Button>
            </Form.Item>

            <Form.Item>
                <Button size='large' type="primary" htmlType="submit" className={cls.loginBtn} loading={loading}>
                    Log in
                </Button>
            </Form.Item>
        </Form>;
    }
}

Login.propTypes = {};

export default Login;
