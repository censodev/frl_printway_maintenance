import React from 'react';
import { Modal, Form, Select, Button, Input } from 'antd';
import { FileAddOutlined } from '@ant-design/icons'



class TrackingModal extends React.Component {
    onFinish = value => {
        const { addTrackingId, lineItem } = this.props;
        addTrackingId([{
            orderId: lineItem.orderId,
            itemSku: lineItem.sku,
            trackingNumber: value.trackingNumber,
            trackingUrl: value.trackingUrl
        }])
    }

    render() {

        const { visible, handleCancel, addTrackingIdLoading, lineItem } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <FileAddOutlined style={{ marginRight: "8px" }} />
                            Add import tracking ID
                        </div>
                    }
                    visible={visible}
                    onOk={() => this.myRef.click()}
                    confirmLoading={addTrackingIdLoading}
                    onCancel={handleCancel}
                    okText="Add"
                    destroyOnClose
                    bodyStyle={{ padding: "50px" }}
                >
                    <Form
                        onFinish={this.onFinish}
                        layout="vertical"
                        initialValues={{
                            trackingNumber: lineItem?.trackingNumber || "",
                            trackingUrl: lineItem?.trackingUrl || ""
                        }}
                    >
                        <Form.Item
                            label="Tracking number"
                            rules={[{ required: true, message: 'Please input tracking number' }]}
                            name="trackingNumber"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tracking url"
                            rules={[{ required: true, message: 'Please input tracking url' }]}
                            name="trackingUrl"
                        >
                            {/* <Input addonBefore="https://"/> */}
                            <Input />
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
export default TrackingModal;
