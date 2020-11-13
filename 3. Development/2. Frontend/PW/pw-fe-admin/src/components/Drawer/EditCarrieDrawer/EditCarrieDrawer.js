import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {Drawer, Button, Form, Row, Col, Input, Alert, message} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import CatchError from "../../../core/util/CatchError";


class EditCarrieDrawer extends Component {

    formRef = React.createRef();


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
        const {data, editCarrie, createCarrie} = this.props;
        values.url = `https://${values.url}`;
        if (data) {
            editCarrie({...values, id: data.id})
        } else {
            createCarrie(values);
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
                title={`${data ? 'Edit' : 'Add New'} Carrier`}
                destroyOnClose
                width={isMobile ? 360 : 526}
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
                            onFinish={this.onFinish}
                            initialValues={{
                                'name': _.get(data, 'name', ''),
                                'code': _.get(data, 'code', ''),
                                'url': _.get(data, 'url', '').replace("https://", ""),
                                'description': _.get(data, 'description', ''),
                            }}
                        >
                            <Form.Item
                                name="name"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Name</span>}
                                rules={[{required: true, message: 'Please enter name'}]}

                            >
                                <Input placeholder="Enter name"/>
                            </Form.Item>
                            <Form.Item
                                name="code"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Code</span>}
                                rules={[{required: true, message: 'Please enter code'}]}

                            >
                                <Input placeholder="Enter code"/>
                            </Form.Item>
                            <Form.Item
                                name="url"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Url</span>}
                                rules={[{required: true, message: 'Please enter url'}]}
                            >
                                <Input addonBefore="https://"/>
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Description</span>}
                                // rules={[{required: true, message: 'Please enter code'}]}

                            >
                                <Input.TextArea rows={4}/>
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
                                            {data ? 'Save' : 'Add'}
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

export default EditCarrieDrawer;
