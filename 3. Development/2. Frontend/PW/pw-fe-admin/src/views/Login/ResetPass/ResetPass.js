import React, {Component} from 'react';
import {Button, Result, Alert, Form, Input} from "antd";
import CatchError from "../../../core/util/CatchError";
import cls from './resetPass.module.scss';
import {LockOutlined} from "@ant-design/icons";

class ResetPass extends Component {


    UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            auth,
        } = this.props;

        if (nextProps.auth.resetPassSuccess === true && nextProps.auth.resetPassSuccess !== auth.resetPassSuccess) {
            window.location.href = '/login';
        }
    }


    onFinish = (values) => {
        const {search} = this.props.location;
        const params = new URLSearchParams(search);
        const key = params.get('key');

        if (key) {
            values.key = key;
            this.props.resetPass(values);
        }
    };

    render() {

        const {auth} = this.props;

        return (
            <div className={cls.wrap}>
                <Result
                    status="info"
                    title="Reset Password"
                />
                <Form
                    name="reset_password"
                    className="login-form"
                    initialValues={{
                        // remember: true,
                    }}
                    onFinish={this.onFinish}
                >
                    <>
                        {
                            auth.resetPassError && (
                                <Form.Item>
                                    <Alert message={CatchError[auth.resetPassError] || auth.resetPassError}
                                           type="error" showIcon
                                           style={{textAlign: 'left'}}/>
                                </Form.Item>
                            )
                        }
                        <Form.Item
                            name="newPassword"
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
                                placeholder="Type new password"
                            />
                        </Form.Item>
                        <br/>
                        <Form.Item style={{marginBottom: '10px'}}>
                            <Button type="primary" htmlType="submit" style={{width: '100%'}} size='large'
                                    loading={auth.resetPassLoading}>
                                Reset
                            </Button>
                        </Form.Item>
                    </>

                </Form>
            </div>
        );
    }
}

export default ResetPass;
