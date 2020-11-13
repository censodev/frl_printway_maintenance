import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons'

// const { Option } = Select;

class RejectDeposit extends React.Component {

    onFinish = value => {
        const { reject, record } = this.props;
        value.id = record.id;
        reject(value)
    }

    render() {
        const { visible, handleCancel, rejectLoading } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <CloseCircleOutlined  style={{ marginRight: "8px", color: "red" }} />
                            Reject 
                        </div>
                    }
                    visible={visible}
                    onOk={() => this.myRef.click()}
                    confirmLoading={rejectLoading}
                    onCancel={handleCancel}
                    destroyOnClose
                >
                    <Form onFinish={this.onFinish} layout="vertical" initialValues={{ type: "ADD", notes: "" }}>
                        <Form.Item
                            name="note"
                            label="Note"

                            // rules={[{ required: true, message: 'Please input note' }]}

                        >
                            <Input.TextArea rows={5} placeholder="Input the reason" style={{ width: "100%" }} />
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
export default RejectDeposit;
