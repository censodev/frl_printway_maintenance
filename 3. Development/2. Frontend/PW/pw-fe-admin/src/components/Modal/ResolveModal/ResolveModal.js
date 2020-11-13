import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons'
import cls from './style.module.less';

// const { Option } = Select;

class ResolveActionRequired extends React.Component {

  onFinish = value => {
    const { lineItem, resolve } = this.props;
    resolve([{
      orderId: lineItem.orderId,
      itemSku: lineItem.sku,
      note: value.note
    }])
  }

  render() {
    const { visible, handleCancel, doResolve } = this.props;
    return (
      <div>
        <Modal
          title={
            <div>
              <CheckCircleOutlined className={cls.green} style={{ marginRight: "8px" }} />
              Resolve action required
            </div>
          }
          visible={visible}
          onOk={() => this.myRef.click()}
          confirmLoading={doResolve}
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
export default ResolveActionRequired;
