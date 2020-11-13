import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { NotificationOutlined  } from '@ant-design/icons'
import cls from './style.module.less';

// const { Option } = Select;

class SetActionRequiredModal extends React.Component {

  onFinish = value => {
    const { setActionRequired, lineItem } = this.props;
    setActionRequired([{
      orderId: lineItem.orderId,
      itemSku: lineItem.sku,
      note: value.note
    }])
  }

  render() {
    const { visible, handleCancel, setActionRequiredLoading } = this.props;
    return (
      <div>
        <Modal
          title={
            <div>
              <NotificationOutlined className={cls.orange}  style={{ marginRight: "8px" }} />
              Action required
            </div>
          }
          visible={visible}
          onOk={() => this.myRef.click()}
          confirmLoading={setActionRequiredLoading}
          onCancel={handleCancel}
          destroyOnClose
        >
          {/* {nestedRowsSelected && <p><span style={{fontWeight: "bold"}}>{nestedRowsSelected.length}</span> products have been selected </p>} */}
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
export default SetActionRequiredModal;
