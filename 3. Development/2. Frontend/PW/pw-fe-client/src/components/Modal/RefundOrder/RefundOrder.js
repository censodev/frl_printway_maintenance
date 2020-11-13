import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import cls from '../ResolveModal/style.module.less';

const { Option } = Select;

class AcceptOrder extends React.Component {
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
              <CheckCircleOutlined className={cls.green} style={{ marginRight: "8px" }} />
              Refund!
            </div>
          }
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Form onFinish={this.onFinish} layout="vertical" initialValues={{ type: "ADD", notes: "" }}>
            <Form.Item label="Fee change ...">
              <Input.Group compact>
                <Form.Item

                  name="type"
                  noStyle
                >
                  <Select placeholder="Select type" style={{ width: '30%' }}>
                    <Option value="ADD"> <PlusCircleOutlined /> Add</Option>
                    <Option value="SUBSTRACT"> <MinusCircleOutlined /> Substract</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="amount"
                  noStyle
                  rules={[{ required: true, message: 'amount is required' }]}
                >
                  <InputNumber
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '70%' }}
                  />
                </Form.Item>

              </Input.Group>
            </Form.Item>
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
export default AcceptOrder;
