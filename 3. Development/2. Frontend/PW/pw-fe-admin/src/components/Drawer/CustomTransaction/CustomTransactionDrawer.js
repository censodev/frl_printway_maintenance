import React, { Component, useState } from 'react'
import { Drawer, Button, Form, Select, Input, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

const { Option } = Select;
// const InputAmount = () => {
//     const [add, setadd] = useState(false);
//     const [amount, setAmount] = useState(0);
//     return (
//         <>
//             <Select style={{ width: '35%' }} value={add} onChange={e => setadd(e)}>
//                 <Option value={true}><PlusCircleOutlined /> add</Option>
//                 <Option value={false}><MinusCircleOutlined /> Substract</Option>
//             </Select>
//             <InputNumber
//                 value={amount}
//                 formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                 parser={value => value.replace(/\$\s?|(,*)/g, '')}
//                 style={{ width: "65%" }}
//             />
//         </>
//     )
// }
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
        const newNumber = e;

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
    checkPrice = (rule, value) => {
        if (value.number > 0) {
            return Promise.resolve();
        }

        return Promise.reject('Price must be greater than zero!');
    };
    render() {
        const { visible, onClose, listSeller, customTransactionLoading } = this.props;

        return (
            <Drawer
                title="Custom transaction"
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
                        label={<span style={{ fontFamily: 'Poppins-Medium' }}>Send to</span>}
                        rules={[{ required: true, message: 'Please pick seller' }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Select seller"
                            onChange={this.onPickSeller}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {listSeller && listSeller.sellers.map(value => (
                                <Option key={value.id}
                                    value={value.email}>{`${value.firstName || ''} ${value.lastName || ''}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {/* <Form.Item
                        name="number"
                        label={<span style={{ fontFamily: 'Poppins-Medium' }}>Amount</span>}
                        rules={[{ required: true, message: 'Please enter amount' }]}

                    >
                        <InputAmount />
                    </Form.Item> */}
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
                        label={<span style={{ fontFamily: 'Poppins-Medium' }}>Transaction ID</span>}
                    >
                        <Input placeholder="Input transaction ID" />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label={<span style={{ fontFamily: 'Poppins-Medium' }}>Note</span>}
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
