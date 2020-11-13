import React from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons'



class AssignSupplier extends React.Component {
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
        const { confirmLoading } = this.state;
        const { visible, handleCancel, nestedRowsSelected } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            <ImportOutlined style={{ marginRight: "8px" }} />
                            Assign Supplier
                        </div>
                    }
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    okText="Assign"
                    destroyOnClose
                    bodyStyle={{padding: "50px"}}
                >
                    <Form onFinish={this.onFinish} layout="vertical">
                        <p><span style={{fontWeight: "bold"}}>{nestedRowsSelected.length}</span> products have been selected</p>
                        <Form.Item label="Choose Supplier">
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select supplier"
                                optionFilterProp="children"
                            >

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
