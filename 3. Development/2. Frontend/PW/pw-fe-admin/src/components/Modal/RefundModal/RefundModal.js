import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons'
import cls from "../ResolveModal/style.module.less"

// const { Option } = Select;

class Refund extends React.Component {

  onFinish = value => {
    const { lineItem, refund, nestedRowsSelected } = this.props;
    if(nestedRowsSelected.length > 0 && !lineItem) {
      refund(nestedRowsSelected.map(item => ({
        orderId: item.orderId,
        itemSku: item.sku,
        // note: value.note
      })))
    }
    else {
      refund([{
        orderId: lineItem.orderId,
        itemSku: lineItem.sku,
        // note: value.note
      }])
    }
  }

  render() {
    const { visible, handleCancel, refundLoading } = this.props;
    return (
      <div>
        <Modal
          title={
            <div>
              <ImportOutlined className={cls.blue} style={{ marginRight: "8px" }}  />
              Refund
            </div>
          }
          visible={visible}
          onOk={() => this.myRef.click()}
          confirmLoading={refundLoading}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Form onFinish={this.onFinish} layout="vertical" initialValues={{ type: "ADD", notes: "" }}>
            <Form.Item
              name="note"
              label="Note"

              rules={[{ required: true, message: 'Please input note' }]}

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
export default Refund;
