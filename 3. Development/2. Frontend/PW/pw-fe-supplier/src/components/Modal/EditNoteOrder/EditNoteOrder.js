import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Alert } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons'
import cls from '../OnHoldModal/style.module.less';
import CatchError from "../../../core/util/CatchError";


class EditNoteOrder extends React.Component {
    state = {
        note: ""
    }

    handleOk = () => {
        this.myRef.click()
    };

    onFinish = value => {
        const { order, doEditNote } = this.props;
        doEditNote({
            orderId: order.id,
            note: value.note
        })
    }


    render() {
        const { visible, handleCancel, editNote, editNoteError } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <CloseCircleOutlined className={cls.green} style={{ marginRight: "8px" }} />
                            Edit note
                        </div>
                    }
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={editNote}
                    onCancel={handleCancel}
                    destroyOnClose
                >
                    <Form onFinish={this.onFinish} layout="vertical" initialValues={{ note: "" }}>
                        <Form.Item
                            name="note"
                            label="Note"
                            rules={[{ required: true, message: 'Please input note' }]}

                        >
                            <Input.TextArea
                                rows={5}
                                placeholder="Input the note"
                                style={{ width: "100%" }}
                            />
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
export default EditNoteOrder;
