import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Alert, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons'
import cls from '../ResolveModal/style.module.less';
import CatchError from "../../../core/util/CatchError";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

class EditShippingOrder extends React.Component {
    state = {
        note: ""
    }

    handleOk = () => {
        this.myRef.click()
    }

    onFinish = value => {
        const { order, doEditShipping } = this.props;
        doEditShipping({
            orderId: order.id,
            firstName: value.firstName,
            lastName: value.lastName,
            company: value.company,
            address1: value.address1,
            address2: value.address2,
            city: value.city,
            province: value.province,
            country: value.country,
            postcode: value.postcode,
            phone: value.phone
        })
        this.setState({ note: "" })
    }


    render() {
        const { visible, handleCancel, editShipping, order } = this.props;

        return (
            <div>
                <Modal
                    title={
                        <div>
                            <CheckCircleFilled className={cls.green} style={{ marginRight: "8px" }} />
                            Edit shipping
                        </div>
                    }
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={editShipping}
                    onCancel={handleCancel}
                    destroyOnClose
                >
                    <Form
                        onFinish={this.onFinish}
                        layout="horizontal"
                        initialValues={{ 
                            firstName: order.shippingAddress && order.shippingAddress.firstName,
                            lastName: order.shippingAddress && order.shippingAddress.lastName,
                            company: order.shippingAddress && order.shippingAddress.company,
                            address1: order.shippingAddress && order.shippingAddress.address1,
                            address2: order.shippingAddress && order.shippingAddress.address2,
                            city: order.shippingAddress && order.shippingAddress.city,
                            province: order.shippingAddress && order.shippingAddress.province,
                            country: order.shippingAddress && order.shippingAddress.country,
                            postcode: order.shippingAddress && order.shippingAddress.postcode,
                            phone: order.billingAddress && order.billingAddress.phone
                        }}
                        {...layout}
                    >
                        <Form.Item
                            name="firstName"
                            label="First name"
                            rules={[{ required: true, message: 'Please input first name' }]}

                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                        <Form.Item
                            name="lastName"
                            label="Last name"
                            rules={[{ required: true, message: 'Please input last name' }]}

                        >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                        <Form.Item
                            name="company"
                            label="Company"

                        >
                            <Input placeholder="Enter company" />
                        </Form.Item>
                        <Form.Item
                            name="address1"
                            label="Address 1"
                            rules={[{ required: true, message: 'Please input address 1' }]}

                        >
                            <Input placeholder="Enter address 1" />
                        </Form.Item>
                        <Form.Item
                            name="address2"
                            label="Address 2"

                        >
                            <Input placeholder="Enter address 2" />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="City"
                            rules={[{ required: true, message: 'Please input city' }]}

                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>
                        <Form.Item
                            name="province"
                            label="Province"
                            rules={[{ required: true, message: 'Please input province' }]}

                        >
                            <Input placeholder="Enter province" />
                        </Form.Item>
                        <Form.Item
                            name="country"
                            label="Country"
                            rules={[{ required: true, message: 'Please input country' }]}

                        >
                            <Input placeholder="Enter country" />
                        </Form.Item>
                        <Form.Item
                            name="postcode"
                            label="Shipping zip"
                            rules={[{ required: true, message: 'Please input zip' }]}

                        >
                            <Input placeholder="Enter zip" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[{ required: true, message: 'Please input phone' }]}

                        >
                            <Input placeholder="Enter phone" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" ref={input => this.myRef = input} style={{ display: "none" }}>
                            Submit
                        </Button>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default EditShippingOrder;
