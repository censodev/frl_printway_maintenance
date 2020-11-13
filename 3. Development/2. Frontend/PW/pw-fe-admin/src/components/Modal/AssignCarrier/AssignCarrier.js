import React from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons'


const { Option } = Select;

class AssignCarrier extends React.Component {
    onFinish = value => {
        const { nestedRowsSelected, assignCarrier,lineItem } = this.props;
        // assignCarrier(nestedRowsSelected.map(item => ({
        //     orderId: item.orderId,
        //     itemSku: item.sku,
        //     assignId: value.carrier
        // })))
        if (nestedRowsSelected.length > 0 && !lineItem) {
            assignCarrier(nestedRowsSelected.map(item => ({
                orderId: item.orderId,
                itemSku: item.sku,
                assignId: value.carrier
            })))
        }
        else {
            assignCarrier([{
                orderId: lineItem.orderId,
                itemSku: lineItem.sku,
                assignId: value.carrier
            }])
        }
    }

    render() {

        const { visible, handleCancel, nestedRowsSelected, listCarriesNoPaging, assignCarrierLoading, lineItem } = this.props;
        const { listCarriersAssign } = listCarriesNoPaging;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <FormOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                            Assign Carrier
                        </div>
                    }
                    visible={visible}
                    onOk={() => this.myRef.click()}
                    confirmLoading={assignCarrierLoading}
                    onCancel={handleCancel}
                    okText="Assign"
                    destroyOnClose
                    bodyStyle={{ padding: "50px" }}
                >
                    <Form onFinish={this.onFinish} layout="vertical">
                        {(nestedRowsSelected || []).length > 0 && !lineItem && <p><span style={{ fontWeight: "bold" }}>{nestedRowsSelected.length}</span> products have been selected</p>}
                        <Form.Item
                            label="Choose carrier"
                            rules={[{ required: true, message: 'Please choose carrier' }]}
                            name="carrier"

                        >
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select carrier"
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {listCarriersAssign && listCarriersAssign.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.id} children={item.name}/>
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
export default AssignCarrier;
