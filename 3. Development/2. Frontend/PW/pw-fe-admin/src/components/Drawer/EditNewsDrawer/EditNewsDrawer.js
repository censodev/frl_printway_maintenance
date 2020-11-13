import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {Drawer, Button, Form, Row, Col, Input, Alert, message, Select, Space, Card, Switch} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import CatchError from "../../../core/util/CatchError";
import CKEditor from "ckeditor4-react";
import configs from '../../../config/project.config';
import capitalizeRole from "../../../core/util/capitalizeRole";

const {Option} = Select;

class EditNewsDrawer extends Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        CKEditor.editorConfig = function (config) {
            config.fillEmptyBlocks = false;
        };
    }


    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editSuccess,
            onClose,
            createSuccess,
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
        const {data, editNew, createNew} = this.props;
        if (data) {
            editNew({...values, id: data.id})
        } else {
            createNew(values);
        }
    };

    onReset = () => {
        this.formRef.current.resetFields();
    };

    render() {

        const {
            visible,
            onClose,
            editLoading,
            createLoading,
            data,
            editError,
            createError
        } = this.props;

        // console.log(data);

        const roleOptions = configs.roles.map(value => (
            <Option key={value} value={value}>{capitalizeRole(value)}</Option>
        ));

        return (
            <Drawer
                title={`${data ? 'Edit' : 'Send'} News`}
                destroyOnClose
                width={isMobile ? '90%' : '80%'}
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
                                {data ? 'Save' : 'Send'}
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
                        'title': _.get(data, 'title', ''),
                        'content': _.get(data, 'content', ''),
                        'notification': _.get(data, 'notification', false),
                        'email': _.get(data, 'email', false),
                        'roles': _.get(data, 'roles', []),
                        'type': _.get(data, 'type', 'NEWS'),
                    }}
                >
                    <Row gutter={24}>
                        <Col md={16} xs={24} style={{textAlign: 'left'}}>
                            <Card
                                title='Detail'
                                // size='small'
                            >
                                <Form.Item
                                    name="roles"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Send to</span>}
                                    rules={[{required: true, message: 'Please select receiver', type: 'array'}]}

                                >
                                    <Select mode="multiple" placeholder="Please select receiver">
                                        {roleOptions}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="title"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Title</span>}
                                    rules={[{required: true, message: 'Please enter title'}]}

                                >
                                    <Input placeholder="Enter name"/>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) => prevValues.name !== currentValues.name}
                                >
                                    {({getFieldValue}) => {
                                        return <Form.Item
                                            name="content"
                                            label={<span style={{fontFamily: 'Poppins-Medium'}}>Content</span>}
                                            rules={[{required: true, message: 'Please enter content'}]}
                                        >
                                            <CKEditor
                                                name="content"
                                                data={getFieldValue('content')}
                                                onBeforeLoad={(CKEDITOR) => {
                                                    CKEDITOR.disableAutoInline = true;
                                                }}
                                                config={{
                                                    extraPlugins: 'justify',
                                                }}
                                                onChange={(evt) => this.formRef.current.setFieldsValue({'content': evt.editor.getData()})}
                                            />
                                        </Form.Item>
                                    }}
                                </Form.Item>
                                {
                                    editError && (
                                        <Form.Item>
                                            <Alert message={CatchError[editError] || editError}
                                                   type="error" showIcon
                                            />
                                        </Form.Item>
                                    )
                                }
                                {
                                    createError && (
                                        <Form.Item>
                                            <Alert message={CatchError[createError] || createError}
                                                   type="error" showIcon
                                            />
                                        </Form.Item>
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
                            </Card>
                        </Col>
                        <Col md={8} xs={24}>
                            <Card
                                title='Options'
                                // size='small'
                            >
                                <Row>
                                    <Form.Item
                                        name="type"
                                        label={<span style={{fontFamily: 'Poppins-Medium'}}>Type of notification</span>}
                                        style={{width: '100%'}}
                                    >
                                        <Select
                                            placeholder="Select Type of notification"
                                        >
                                            <Option value='NEWS'>News</Option>
                                            <Option value='URGENT_NOTE'>Urgent note</Option>
                                        </Select>
                                    </Form.Item>
                                </Row>
                                {/*<Row>*/}
                                {/*    <Col md={12} xs={12} style={{marginTop: '6px'}}>*/}
                                {/*        Notification:*/}
                                {/*    </Col>*/}
                                {/*    <Col md={12} xs={12} style={{textAlign: 'right'}}>*/}
                                {/*        <Form.Item*/}
                                {/*            name="notification"*/}
                                {/*            valuePropName="checked"*/}
                                {/*        >*/}
                                {/*            <Switch disabled={data}/>*/}
                                {/*        </Form.Item>*/}
                                {/*    </Col>*/}
                                {/*</Row>*/}
                                <Row>
                                    <Col md={12} xs={12} style={{marginTop: '6px'}}>
                                        Send Mail:
                                    </Col>
                                    <Col md={12} xs={12} style={{textAlign: 'right'}}>
                                        <Form.Item
                                            name="email"
                                            valuePropName="checked"
                                        >
                                            <Switch disabled={data}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Form>

            </Drawer>
        );
    }
}

export default EditNewsDrawer;
