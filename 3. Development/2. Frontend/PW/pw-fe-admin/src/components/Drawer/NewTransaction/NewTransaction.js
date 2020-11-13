import React, { Component, useState } from 'react'
import { Drawer, Button, Form, Select, Input, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

const { Option } = Select;
const PriceInput = ({ value = {}, onChange }) => {
    const [number, setNumber] = useState(0);
    const [add, setadd] = useState('true');

    const triggerChange = changedValue => {
        if (onChange) {
            onChange({
                number,
                add,
                ...value,
                ...changedValue,
            });
        }
    };

    const onNumberChange = e => {
        const newNumber = e

        if (Number.isNaN(number)) {
            return;
        }

        if (!('number' in value)) {
            setNumber(newNumber);
        }

        triggerChange({
            number: newNumber,
        });
    };

    const onaddChange = newadd => {
        if (!('add' in value)) {
            setadd(newadd);
        }

        // triggerChange({
        //     add: newadd,
        // });
    };

    return (
        <span>
            {/* <Input
                type="text"
                value={value.number || number}
                onChange={onNumberChange}
                style={{
                    width: 100,
                }}
            /> */}
            <Select
                value={value.add || add}
                style={{
                    width: "35%",
                }}
                onChange={onaddChange}
            >
                {/* <Option value="rmb">RMB</Option>
                <Option value="dollar">Dollar</Option> */}
                <Option value="true"><PlusCircleOutlined /> Add</Option>
                <Option value="false"><MinusCircleOutlined /> Substract</Option>
            </Select>
            <InputNumber
                value={value.number || number}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: "65%" }}
                onChange={onNumberChange}
                min={0}
                
            />
        </span>
    );
};
export default class CustomTransactionDrawer extends Component {
    formRef = React.createRef();
    onFinish = value => {
        const { customTransaction } = this.props;
        // customTransaction({
        //     amount: value.amount,
        //     email: value.email,
        //     note: value.note,
        //     add: true
        // })
        customTransaction({ ...value, add: value.amount.add === "true" ? true : false, amount: value.amount.number })
    }
    render() {
        const { visible, onClose, suppliers, customTransactionLoading } = this.props;
        return (
            <Drawer
                title="New transaction"
                visible={visible}
                onClose={onClose}
                destroyOnClose
                width={isMobile ? 360 : 426}
            >
                <Form
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    layout="vertical"
                    initialValues={{
                        price: {
                            number: 0,
                            add: 'true',
                        },
                    }}
                >
                    <Form.Item
                        name="email"
                        label={<span style={{fontFamily: 'Poppins-Medium'}}>Select supplier</span>}
                        rules={[{ required: true, message: 'Please pick supplier' }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Select supplier"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {Array.isArray(suppliers) && suppliers.map((item, index) => {
                                return (
                                    <Option key={index} value={item.email} children={item.firstName + " " + item.lastName} />
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label={<span style={{ fontFamily: 'Poppins-Medium' }}>Amount</span>}
                        rules={[
                            {
                                required: true, message: "Please enter amount"
                            }
                        ]}
                    >
                        <PriceInput />
                    </Form.Item>
                    <Form.Item
                        name="transactionID"
                        label={<span style={{fontFamily: 'Poppins-Medium'}}>Transaction ID</span>}
                    >
                        <Input placeholder="Input transaction ID" />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label={<span style={{fontFamily: 'Poppins-Medium'}}>Note</span>}
                    // rules={[{required: true, message: 'Please enter code'}]}

                    >
                        <Input.TextArea rows={5} placeholder="Input notes" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={customTransactionLoading}
                        >
                            Send
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        )
    }
}
