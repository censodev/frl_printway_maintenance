import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import cls from './style.module.less';

// const { Option } = Select;

class OnHoldModal extends React.Component {

  onFinish = value => {
    const { onHold, nestedRowsSelected } = this.props;
    onHold(nestedRowsSelected.map(x => ({
      orderId: x.orderId,
      itemSku: x.sku,
      note: value.note
    })))
  }

  render() {
    const { visible, handleCancel, onHoldLoading } = this.props;
    return (
      <div>
        <Modal
          title={
            <div>
              <CheckCircleOutlined className={cls.green} style={{ marginRight: "8px" }} />
              On hold
            </div>
          }
          visible={visible}
          onOk={() => this.myRef.click()}
          confirmLoading={onHoldLoading}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Form onFinish={this.onFinish} layout="vertical" initialValues={{ type: "ADD", notes: "" }}>
            <Form.Item
              name="note"
              label="Note"

              rules={[{ required: true, message: 'Please input note' }]}

            >
              <Input.TextArea rows={5} placeholder="Input the note" style={{ width: "100%" }} />
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
export default OnHoldModal;
