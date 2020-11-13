import React from 'react';
import { Modal, Form, Input,Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons'
import cls from "../ResolveModal/style.module.less"

// const { Option } = Select;

class Refund extends React.Component {

  onFinish = value => {
    const { lineItem, acceptCancel, nestedRowsSelected } = this.props;
    if((nestedRowsSelected || []).length > 0 && !lineItem) {
      acceptCancel(nestedRowsSelected.map(item => ({
        orderId: item.orderId,
        itemSku: item.sku,
        note: value.note
      })))
    }
    else {
      acceptCancel([{
        orderId: lineItem.orderId,
        itemSku: lineItem.sku,
        note: value.note
      }])
    }
  }

  render() {
    const { visible, handleCancel, acceptCancelLoading } = this.props;
    return (
      <div>
        <Modal
          title={
            <div>
              <CheckCircleOutlined className={cls.green} style={{ marginRight: "8px" }} />
              Aprove cancel
            </div>
          }
          visible={visible}
          onOk={() => this.myRef.click()}
          confirmLoading={acceptCancelLoading}
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
export default Refund;
