import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { PauseCircleOutlined } from '@ant-design/icons'
import cls from './style.module.less';

// const { Option } = Select;

class OnHoldModal extends React.Component {

  onFinish = value => {
    const { onHold, nestedRowsSelected, lineItem } = this.props;
    if(nestedRowsSelected.length > 0 && !lineItem) {
      onHold(nestedRowsSelected.map(x => ({
        orderId: x.orderId,
        itemSku: x.sku,
        note: value.note
      })))
    }
    else {
      onHold([{
        orderId: lineItem.orderId,
        itemSku: lineItem.sku,
        note: value.note
      }])
    }
  }

  render() {
    const { visible, handleCancel, onHoldLoading } = this.props;
    return (
      <div>
        <Modal
          title={
            <div>
              <PauseCircleOutlined className={cls.orange} style={{ marginRight: "8px" }}/>

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

              // rules={[{ required: true, message: 'Please input note' }]}

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
