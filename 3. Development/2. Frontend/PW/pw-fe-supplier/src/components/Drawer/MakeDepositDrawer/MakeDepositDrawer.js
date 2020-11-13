import React, { Component } from 'react'
import { Drawer, Button, Form, Select, Input, Descriptions, Row, Col, Alert, message, InputNumber, Space } from 'antd';
import { isMobile } from 'react-device-detect';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';

const { Option } = Select;
const key = "Make Deposit"
export default class CustomTransactionDrawer extends Component {
    formRef = React.createRef();

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { createDepositSuccess, onClose, resquestTable, updateDepositSuccess, onSubmit } = this.props;
        if (nextProps.createDepositSuccess && nextProps.createDepositSuccess !== createDepositSuccess) {
            onClose();
            message.success({
                content: "Success",
                duration: 1.5,
                key,
                onClose: resquestTable
            }, onSubmit)
        }
        if (nextProps.updateDepositSuccess && nextProps.updateDepositSuccess !== updateDepositSuccess) {
            onClose();
            message.success({
                content: "Success",
                duration: 1.5,
                key,
                onClose: resquestTable
            },onSubmit)
        }
    }
    onFinish = values => {
        const { doCreateDeposit, doUpdateDeposit, data } = this.props;
        if (data.id) {
            doUpdateDeposit({
                ...values, id: data.id
            })
        }
        else doCreateDeposit(values)
    }
    onReset = () => {
        this.formRef.current.resetFields();
    };
    render() {
        const { visible, onClose, createDeposit, createDepositError, data, updateDeposit, updateDepositError } = this.props;
        const { transactionId, amount, note } = data;
        return (
            <Drawer
                title="Make deposit"
                visible={visible}
                onClose={onClose}
                destroyOnClose
                width={isMobile ? 360 : 426}
            >
                <Descriptions title="Please send payment to">
                    <span span={3} style={{ paddingBottom: 0, color: "red", fontWeight: 600 }}>Paypal: xxx</span>
                    <span span={3} style={{ paddingBottom: 0, color: "red", fontWeight: 600 }}>Payoneer: xxx</span>
                    <span style={{ fontWeight: 600 }}>then submit the form below</span>
                </Descriptions>
                <Form
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    layout="vertical"
                    initialValues={{
                        transactionId, amount, note
                    }}
                >
                    <Form.Item
                        name="transactionId"
                        label="Transaction ID"
                        rules={[{ required: true, message: 'Please enter transaction Id' }]}

                    >
                        <Input placeholder="Input transaction ID" />
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter amount' }]}

                    >
                        <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{width: "100%"}}
                        />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Notes"

                    // rules={[{required: true, message: 'Please enter code'}]}

                    >
                        <Input.TextArea rows={5} placeholder="Input notes" />
                    </Form.Item>
                    {createDepositError && (
                        <Form.Item>
                            <Alert message={createDepositError} type="error" showIcon />
                        </Form.Item>
                    )}
                    {updateDepositError && (
                        <Form.Item>
                            <Alert message={updateDepositError} type="error" showIcon closable />
                        </Form.Item>
                    )}
                    <Form.Item style={{textAlign: "right"}}>
                        <Space>
                            <Button
                                icon={<SaveOutlined />} type="primary"
                                htmlType="submit"
                                loading={createDeposit || updateDeposit}
                            >
                                {data && data.id ? 'Save' : 'Add'}
                            </Button>
                            {data && data.id && (
                                <Button
                                    icon={<UndoOutlined />}
                                    htmlType="button"
                                    onClick={this.onReset}
                                >
                                    Reset
                                </Button>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        )
    }
}
