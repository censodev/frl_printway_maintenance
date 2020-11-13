import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {Drawer, Button, Form, Row, Col, Input, Select, Alert, message} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
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
        const {data, editSite} = this.props;
        if (data) {

            if (data.active) {

            } else {

            }

        } else {

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
                            name={_.get(data, 'id', '')}
                            ref={this.formRef}
                            layout="vertical"
                            hideRequiredMark
                            onFinish={this.onFinish}
                            initialValues={{
                                'title': _.get(data, 'title', ''),
                                'url': _.get(data, 'url', ''),
                                'siteType': _.get(data, 'siteType', ''),
                            }}
                        >
                            <Form.Item
                                name="title"
                                label="Store name"
                                rules={[{required: true, message: 'Please enter store name'}]}

                            >
                                <Input placeholder="Enter store name"/>
                            </Form.Item>
                            <Form.Item
                                name="url"
                                label="Site Url"
                                rules={[{type: 'url', required: true, message: 'Please enter correct site url'}]}
                            >
                                <Input placeholder="Enter site Url" disabled={_.get(data, 'active', false)}/>
                            </Form.Item>
                            <Form.Item
                                name="siteType"
                                label="Platform"
                                rules={[{required: true, message: 'Please select platform'}]}
                            >
                                <Select placeholder="Select platform" disabled={_.get(data, 'active', false)}>
                                    <Option value="SHOPIFY">SHOPIFY</Option>
                                    <Option value="WOO">WOO</Option>
                                </Select>
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
                                                loading={editLoading}>
                                            {data ? 'Save' : 'Connect'}
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
