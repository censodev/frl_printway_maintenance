import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {Drawer, Button, Form, Row, Col, Input, InputNumber, Alert, message} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import CatchError from "../../../core/util/CatchError";


class EditSellerLevelsDrawer extends Component {

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
        const {data, editSellerLevel, createSellerLevel} = this.props;
        if (data) {
            editSellerLevel({...values, id: data.id})
        } else {
            createSellerLevel(values);
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
                title={`${data ? 'Edit' : 'Add New'} Seller Level`}
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
                            onFinish={this.onFinish}
                            initialValues={{
                                'name': _.get(data, 'name', ''),
                                'totalOrder': _.get(data, 'totalOrder', 0),
                                'discountInUsd': _.get(data, 'discountInUsd', 0),
                                'percentToAlert': _.get(data, 'percentToAlert', 0),
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
                                name="totalOrder"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Total Orders</span>}
                                rules={[{required: true, message: 'Please enter total orders'}]}

                            >
                                <InputNumber
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="Enter total orders" style={{width: '100%'}}
                                />
                            </Form.Item>
                            <Form.Item
                                name="percentToAlert"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Level up notification condition</span>}
                                rules={[{required: true, message: 'Please enter condition'}]}

                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    placeholder="Enter condition" style={{width: '100%'}}
                                />
                            </Form.Item>
                            <Form.Item
                                name="discountInUsd"
                                label={<span style={{fontFamily: 'Poppins-Medium'}}>Discount</span>}
                                rules={[{required: true, message: 'Please enter discount'}]}
                            >
                                <InputNumber
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="Enter discount"
                                    style={{width: '100%'}}
                                />
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

export default EditSellerLevelsDrawer;
