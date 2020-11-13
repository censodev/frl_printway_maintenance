import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons'
import cls from '../ResolveModal/style.module.less';


class NotAcceptOrder extends React.Component {
    state = {
        confirmLoading: false,
    };

    handleOk = () => {
        const { handleCancel } = this.props;
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                confirmLoading: false,
            }, () => {
                this.myRef.click();
            });

            handleCancel();
        }, 2000);
    };

    onFinish = value => {
        console.log(value)
    }

    render() {
        const { confirmLoading, ModalText } = this.state;
        const { visible, handleCancel } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <CloseCircleOutlined className={cls.red} style={{ marginRight: "8px" }} />
                            Not accept!
                        </div>
                    }
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    destroyOnClose
                >
                    <Form onFinish={this.onFinish} layout="vertical" initialValues={{ type: "ADD", notes: "" }}>
                        <Form.Item
                            name="notes"
                            label="Notes"
                            rules={[{ required: true, message: 'Please input node' }]}
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
export default NotAcceptOrder;
