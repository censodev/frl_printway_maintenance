import React from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons'


const { Option } = Select;

class AssignSupplier extends React.Component {
    onFinish = value => {
        const { nestedRowsSelected, assignSupplier, lineItem } = this.props;
        // assignSupplier(nestedRowsSelected.map(item => ({
        //     orderId: item.orderId,
        //     itemSku: item.sku,
        //     assignId: value.supplier
        // })))
        if ((nestedRowsSelected || []).length > 0 && !lineItem) {
            assignSupplier(nestedRowsSelected.map(item => ({
                orderId: item.orderId,
                itemSku: item.sku,
                assignId: value.supplier
            })))
        }
        else {
            assignSupplier([{
                orderId: lineItem.orderId,
                itemSku: lineItem.sku,
                assignId: value.supplier
            }])
        }
    }

    render() {

        const { visible, handleCancel, nestedRowsSelected, suppliers, assignSupplierLoading, lineItem } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <EditOutlined style={{ marginRight: "8px", color: "green" }}  /> 
                            Assign Supplier
                        </div>
                    }
                    visible={visible}
                    onOk={() => this.myRef.click()}
                    confirmLoading={assignSupplierLoading}
                    onCancel={handleCancel}
                    okText="Assign"
                    destroyOnClose
                    bodyStyle={{ padding: "50px" }}
                >
                    <Form onFinish={this.onFinish} layout="vertical">
                        {(nestedRowsSelected || []).length > 0 && !lineItem && <p><span style={{ fontWeight: "bold" }}>{nestedRowsSelected.length || 1}</span> products have been selected</p>}
                        <Form.Item
                            label="Choose Supplier"
                            rules={[{ required: true, message: 'Please choose supplier' }]}
                            name="supplier"
                        >
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select supplier"
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {suppliers && suppliers.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.id} children={item.firstName + " " + item.lastName} />
                                    )
                                })}
                            </Select>
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
export default AssignSupplier;
