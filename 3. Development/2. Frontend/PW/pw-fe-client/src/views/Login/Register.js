import React, {Component} from 'react';
import {Alert, Button, Form, Input, message, Result} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import CatchError from "../../core/util/CatchError";
import cls from "./login.module.scss";


class Register extends Component {

    onFinish = (values) => {
        // console.log(values);
        this.props.register(values);
    };

    render() {

        const {auth} = this.props;

        return (
            <Form
                name="register"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
            >
                {
                    auth.registerSuccess ? (
                        <Result
                            status="success"
                            title="Successfully"
                            subTitle='Please go to your email to verify account'
                            extra={[
                                <Button type="link"
                                        style={{float: 'none'}}
                                        className={cls.forgot}
                                        onClick={() => window.location.href = '/login'}>
                                    Back to Login
                                </Button>,
                            ]}
                            style={{padding: '32px'}}
                        />
                    ) : (
                        <>
                            {
                                auth.registerError && (
                                    <Form.Item>
                                        <Alert message={CatchError[auth.registerError] || auth.registerError}
                                               type="error" showIcon
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
                                <Input.Password
                                    size='large'
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item
                                name="firstName"
                                style={{textAlign: 'left'}}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input
                                    size='large'
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    placeholder="First Name"
                                />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                style={{textAlign: 'left'}}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <Input
                                    size='large'
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    placeholder="Last Name"
                                />
                            </Form.Item>
                            {/*<Form.Item style={{textAlign: 'left'}}>*/}
                            {/*   <span>*/}
                            {/*        By clicking on “Create Account”,*/}
                            {/*       I agree to the Ecomdy <a>Terms of Service</a> and <a>Privacy Policy</a>.*/}
                            {/*   </span>*/}
                            {/*</Form.Item>*/}
                            <br/>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={cls.loginBtn} size='large'
                                        loading={auth.registerLoading}>
                                    Create Account
                                </Button>
                            </Form.Item>
                        </>
                    )
                }

            </Form>
        );
    }
}

Register.propTypes = {};

export default Register;
