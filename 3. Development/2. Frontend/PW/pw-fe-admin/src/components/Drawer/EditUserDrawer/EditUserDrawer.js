import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import moment from 'moment';
import {Drawer, Button, Form, Row, Col, Input, Alert, message, Space, DatePicker, Select, Checkbox, Radio} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import configs from '../../../config/project.config';
import CatchError from "../../../core/util/CatchError";
import capitalizeRole from "../../../core/util/capitalizeRole";

moment.locale('en');

const {Option} = Select;


class EditUserDrawer extends Component {

    formRef = React.createRef();

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editSuccess,
            createSuccess,
            onClose,
        } = this.props;

        if (
            nextProps.editSuccess === true
            && nextProps.editSuccess !== editSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                window.location.reload()
            });
        }

        if (
            nextProps.createSuccess === true
            && nextProps.createSuccess !== createSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                window.location.reload()
            });
        }

    }

    onFinish = (values) => {
        const {data, editUser, createUser} = this.props;
        if (values.sellerLevel) {
            values.sellerLevel = {
                id: values.sellerLevel
            };
        } else {
            delete values.sellerLevel;
        }
        values.roles = [values.roles];
        values.fbLink = `https://${values.fbLink}`;

        if (values.dob) {
            values.dob = values.dob.toISOString();
        }

        if (data) {
            // edit
            editUser({
                ...values,
                id: data.id,
            });
        } else {
            // create
            createUser({...values});
        }

        // console.log({...values, dob: values.dob.toISOString()})

    };

    onReset = () => {
        this.formRef.current.resetFields();
    };

    render() {

        const {
            visible,
            onClose,
            editLoading,
            data,
            editError,
            createError,
            createLoading,
            listLevelsNoPaging,
        } = this.props;

        const {levels, loading} = listLevelsNoPaging;


        return (
            <Drawer
                title={`${data ? 'Edit' : 'Add New'} User`}
                destroyOnClose
                width={isMobile ? '90%' : '75%'}
                onClose={onClose}
                visible={visible}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Space>
                            <Button
                                onClick={() => this.submitBtn.click()}
                                icon={<SaveOutlined/>} type="primary"
                                htmlType="submit"
                                loading={editLoading || createLoading}
                            >
                                {data ? 'Save' : 'Create'}
                            </Button>
                            {data && (
                                <Button
                                    icon={<UndoOutlined/>}
                                    htmlType="button"
                                    onClick={this.onReset}
                                >
                                    Reset
                                </Button>
                            )}
                            <Button onClick={onClose} style={{marginRight: 8}}>
                                Cancel
                            </Button>
                        </Space>
                    </div>
                }
            >

                <Form
                    ref={this.formRef}
                    layout="vertical"
                    onFinish={this.onFinish}
                    initialValues={{
                        'firstName': _.get(data, 'firstName', ''),
                        'lastName': _.get(data, 'lastName', ''),
                        'email': _.get(data, 'email', ''),
                        'password': _.get(data, 'password', ''),
                        'phone': _.get(data, 'phone', ''),
                        'address': _.get(data, 'address', ''),
                        'roles': _.get(data, 'roles', [])[0],
                        'dob': _.get(data, 'dob') ? moment(_.get(data, 'dob')) : '',
                        'fbLink': _.get(data, 'fbLink', '').replace("https://", ""),
                        'note': _.get(data, 'note', ''),
                        'sellerLevel': _.get(data, 'sellerLevel', '').id,
                    }}
                >

                    <Row gutter={24}>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item

                                name="firstName"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>First Name</span>}
                                rules={[{required: true, message: 'Please enter first name'}]}
                                style={{fontWeight: '500'}}
                            >
                                <Input placeholder="Enter first name"/>
                            </Form.Item>
                        </Col>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="lastName"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Last Name</span>}
                                rules={[{required: true, message: 'Please enter last name'}]}
                                style={{fontWeight: '500'}}
                            >
                                <Input placeholder="Enter last name"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="email"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Email</span>}
                                rules={[{type: 'email', required: true, message: 'Please enter correct email'}]}
                                style={{fontWeight: '500'}}
                            >
                                <Input placeholder="Enter email"/>
                            </Form.Item>
                        </Col>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="phone"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Phone number</span>}
                                rules={[{required: true, message: 'Please enter phone number'}]}
                                style={{fontWeight: '500'}}
                            >
                                <Input placeholder="Enter phone number"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        {
                            <Col md={12} xs={24} style={{textAlign: 'left'}}>
                                <Form.Item
                                    name="password"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Password</span>}
                                    rules={[
                                        {
                                            required: !data,
                                            message: 'Please input your password! (at least 6 characters)',
                                            min: 6
                                        },
                                    ]}
                                    style={{fontWeight: '500'}}
                                >
                                    <Input.Password placeholder="Enter password"/>
                                </Form.Item>
                            </Col>
                        }

                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="address"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Address</span>}
                                // rules={[{required: true, message: 'Please enter'}]}
                                style={{fontWeight: '500'}}
                            >
                                <Input placeholder="Enter address"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>BirthDay</span>}
                                // rules={[{required: true, message: 'Please enter your birthday'}]}
                                name="dob"
                                style={{fontWeight: '500'}}
                            >
                                <DatePicker
                                    style={{width: '100%'}}
                                    placeholder='Enter your birthday'
                                    showToday={false}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.roles !== currentValues.roles}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="sellerLevel"
                                        label={<span style={{fontFamily: 'Poppins-Medium'}}>Level</span>}
                                        // rules={[{required: true, message: 'Please select level'}]}
                                        style={{fontWeight: '500'}}
                                    >
                                        <Select placeholder="Select level" loading={loading}
                                                disabled={getFieldValue('roles') !== 'ROLE_SELLER'}>
                                            {
                                                levels && levels.map(value => (
                                                    <Option key={value.id || ''}
                                                            value={value.id || ''}
                                                    >
                                                        {value.name || ''}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                }}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="fbLink"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Facebook link</span>}
                                rules={[{message: 'Please enter correct url'}]}
                                style={{fontWeight: '500'}}

                            >
                                <Input addonBefore="https://"/>
                            </Form.Item>
                        </Col>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="note"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Note</span>}
                                // rules={[{required: true, message: 'Please enter'}]}
                                style={{fontWeight: '500'}}
                            >
                                <Input.TextArea rows={2}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>
                            <Form.Item
                                name="roles"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Role</span>}
                                rules={[{required: true, message: 'Please choose role'}]}
                            >
                                <Radio.Group>
                                    <Row>
                                        {
                                            configs.roles.map(value => (
                                                <Col span={8} style={{marginBottom: 15}} key={value}>
                                                    <Radio
                                                        disabled={data}
                                                        value={value}
                                                    >
                                                        {
                                                            capitalizeRole(value)
                                                        }
                                                    </Radio>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col md={12} xs={24} style={{textAlign: 'left'}}>

                            {
                                editError && (
                                    <Row>
                                        <Col span={24}>
                                            <Alert message={CatchError[editError] || editError}
                                                   type="error" showIcon
                                                   style={{marginTop: '20px'}}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }
                            {
                                createError && (
                                    <Row>
                                        <Col span={24}>
                                            <Alert message={CatchError[createError] || createError}
                                                   type="error" showIcon style={{marginTop: '20px'}}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }
                            <Form.Item style={{display: 'none'}}>
                                <Row>
                                    <Col md={data ? 12 : 24} xs={data ? 12 : 24}>
                                        <Button
                                            ref={input => this.submitBtn = input}
                                            icon={<SaveOutlined/>} type="primary"
                                            htmlType="submit"
                                            loading={editLoading || createLoading}
                                        >
                                            {data ? 'Save' : 'Add'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
        );
    }
}

export default EditUserDrawer;
