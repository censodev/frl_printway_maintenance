import React, {Component} from 'react';
import {Alert, Button, Checkbox, Form, Input, Result} from "antd";
import {UserOutlined} from "@ant-design/icons";
import CatchError from "../../core/util/CatchError";
import cls from "./login.module.less";


class ForgotPass extends Component {

    onFinish = (values) => {
        // console.log(values);
        this.props.forgotPass(values);
    };

    render() {

        const {auth, history} = this.props;

        return (
            <Form
                name="for"
                className="login-form"
                initialValues={{
                    // remember: true,
                }}
                onFinish={this.onFinish}
            >
                {
                    auth.forgotSuccess ? (
                        <Result
                            status="success"
                            title="Successfully"
                            subTitle={`An authentication link has been sent to your email. Please check your mailbox to activate your account!`}
                            extra={[
                                <Button type="primary"
                                        onClick={() => window.location.href = '/login'}>
                                    Login
                                </Button>,
                            ]}
                            style={{padding: '32px'}}
                        />
                    ) : (
                        <>
                            <Form.Item style={{textAlign: 'center', marginBottom: 0, marginTop: '40px'}}>
                                <h2>
                                    Forgot Password
                                </h2>
                            </Form.Item>
                            <Form.Item style={{textAlign: 'center'}}>
                               <span>
                                    Enter the email address associated with your account to reset your password
                               </span>
                            </Form.Item>
                            {
                                auth.forgotError && (
                                    <Form.Item>
                                        <Alert message={CatchError[auth.forgotError] || auth.forgotError}
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
                                       placeholder="Your email"/>
                            </Form.Item>
                            <br/>
                            <Form.Item style={{marginBottom: '10px'}}>
                                <Button type="primary" htmlType="submit" className={cls.loginBtn} size='large'
                                        loading={auth.forgotLoading}>
                                    Send
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button className={cls.forgot}
                                        type='link'
                                        onClick={() => history.push('/login')}>
                                    Back to LogIn?
                                </Button>
                            </Form.Item>
                        </>
                    )
                }

            </Form>
        );
    }
}

ForgotPass.propTypes = {};

export default ForgotPass;
