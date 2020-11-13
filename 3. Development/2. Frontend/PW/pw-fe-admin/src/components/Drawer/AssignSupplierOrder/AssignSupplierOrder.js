import React, { Component } from 'react';
import { Drawer, Collapse, Button, Select, DatePicker, Row } from 'antd';
import { isMobile } from 'react-device-detect';

const { Panel } = Collapse;
const { Option } = Select;

export default class AssignSupplierDrawer extends Component {

    // clear all filter
    _onClearFilter = () => {

    }
    // Done filter
    _onDone = () => {
        const { onClose, refreshTable } = this.props;
        refreshTable();
        onClose();
    }

    // on  select name
    onChangeSupplier = () => {

    }

    render() {
        const {
            onClose,
            visible,
            lineItems
        } = this.props;

        return (
            <Drawer
                title="More fitlers"
                // destroyOnClose
                width={isMobile ? 360 : 426}
                visible={visible}
                onClose={onClose}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}>

                        <Button
                            type="link"
                            onClick={this._onClearFilter}
                        >
                            Clear all 
                        </Button>
                        <Button
                            type="primary"
                            onClick={this._onDone}
                        >
                            Done
                        </Button>

                    </div>
                }
                destroyOnClose
            >
                <Collapse
                    defaultActiveKey={['1', '2', '3', '4', '5']}
                    expandIconPosition='right'
                    bordered={false}
                    style={{ backgroundColor: 'white' }}
                >
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Assign supplier</span>}
                        key="1"
                    >
                        
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Choose supplier</span>}
                        key="2"
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Select supplier"
                            optionFilterProp="children"
                            onChange={this.onChangeSupplier}
                            allowClear

                        >

                        </Select>

                    </Panel>
                </Collapse>
            </Drawer>
        )
    }
}
