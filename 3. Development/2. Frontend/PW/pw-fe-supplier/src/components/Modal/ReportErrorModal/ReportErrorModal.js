import React from 'react';
import { Modal, Form, Input,Button } from 'antd';
import { SelectOutlined } from '@ant-design/icons'
import cls from "../ResolveModal/style.module.less"

// const { Option } = Select;

class CancelModal extends React.Component {

    onFinish = value => {
        const { lineItem, report } = this.props;
        report([{
            orderId: lineItem.orderId,
            itemSku: lineItem.sku,
            note: value.note
        }])
    }

    render() {
        const { visible, handleCancel, reportLoading } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <SelectOutlined className={cls.green} style={{ marginRight: "8px" }} />
                            Report Error
                        </div>
                    }
                    visible={visible}
                    onOk={() => this.myRef.click()}
                    confirmLoading={reportLoading}
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
export default CancelModal;
