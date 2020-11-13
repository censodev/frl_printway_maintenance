import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {Drawer, Button, Form, Row, Col, Input, Select, Alert, message, Checkbox} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import {v4 as uuidv4} from 'uuid';
import CatchError from "../../../core/util/CatchError";

const {Option} = Select;

class EditSiteDrawer extends Component {

    formRef = React.createRef();


    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editSuccess,
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

    }

    onFinish = (values) => {
        const {data, editSite, createSite} = this.props;
        if (values.virtual) {
            values.url = `https://virtual_${uuidv4()}`;
            values.siteType = 'VIRTUAL';
        }
        if (data) {
            if (data.active) {
                editSite({...values, id: data.id}, false)
            } else {
                editSite({...values, id: data.id}, true)
            }
        } else {
            createSite(values);
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

        return (
            <Drawer
                title={`${data ? 'Edit' : 'Add New'} Site`}
                destroyOnClose
                width={isMobile ? 360 : 426}
                onClose={() => {
                    onClose();
                }}
                visible={visible}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onClose} style={{marginRight: 8}}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <Row gutter={24}>
                    <Col md={24} xs={24} style={{textAlign: 'left'}}>
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            onFinish={this.onFinish}
                            initialValues={{
                                'title': _.get(data, 'title', ''),
                                'url': _.get(data, 'url', ''),
                                'siteType': _.get(data, 'siteType', ''),
                                'virtual': _.get(data, 'virtual', false),
                            }}
                        >
                            <Form.Item
                                name="title"
                                label="Site name"
                                rules={[{required: true, message: 'Please enter site name'}]}

                            >
                                <Input placeholder="Enter site name"/>
                            </Form.Item>
                            <Form.Item
                                name="virtual"
                                // label="virtual site"
                                // rules={[{required: true, message: 'Please enter site name'}]}
                                style={{marginBottom: '15px'}}
                                help='Check this box, you will create a virtual site that does not connect to your store.'
                                valuePropName="checked"
                            >
                                <Checkbox disabled={_.get(data, 'active')}>
                                    <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>
                                        Virtual site
                                    </span>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.virtual !== currentValues.virtual}
                            >
                                {({getFieldValue}) => {
                                    return !getFieldValue('virtual') ? (
                                        <>
                                            <Form.Item
                                                name="url"
                                                label="Site Url"
                                                rules={[{
                                                    type: 'url',
                                                    required: true,
                                                    message: 'Please enter correct site url'
                                                }]}
                                            >
                                                <Input placeholder="https://" disabled={_.get(data, 'active', false)}/>
                                            </Form.Item>
                                            <Form.Item
                                                name="siteType"
                                                label="Platform"
                                                rules={[{required: true, message: 'Please select platform'}]}
                                            >
                                                <Select placeholder="Select platform"
                                                        disabled={_.get(data, 'active', false)}>
                                                    <Option value="SHOPIFY">SHOPIFY</Option>
                                                    <Option value="WOO">WOO</Option>
                                                </Select>
                                            </Form.Item>
                                        </>
                                    ) : null;
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
                            <Form.Item style={{marginTop: '40px'}}>
                                <Row>
                                    <Col md={data ? 12 : 24} xs={data ? 12 : 24}>
                                        <Button icon={<SaveOutlined/>} type="primary" htmlType="submit"
                                                style={{width: data ? '90%' : '100%'}}
                                                loading={editLoading || createLoading}>
                                            {((data && !data.active) || !data) ? 'Connect' : 'Save'}
                                        </Button>
                                    </Col>
                                    {
                                        data && (
                                            <Col md={12} xs={12} style={{textAlign: 'right'}}>
                                                <Button icon={<UndoOutlined/>} style={{width: '90%'}} htmlType="button"
                                                        onClick={this.onReset}>
                                                    Reset
                                                </Button>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Drawer>
        );
    }
}

export default EditSiteDrawer;
