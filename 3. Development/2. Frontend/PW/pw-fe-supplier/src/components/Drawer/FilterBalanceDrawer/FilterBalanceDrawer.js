import React, { Component } from 'react';
import { Drawer, Collapse, Button, Select, DatePicker, Row, Radio } from 'antd';
import { isMobile } from 'react-device-detect';

import * as config from '../../../config/project.config';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};
export default class FilterBalancesDrawer extends Component {
    // clear all filter
    _onClearFilter = () => {

    }
    // Done filter
    _onDone = () => {

    }
    // on change created order input
    _onChangeCreatedOrder = () => {

    }
    // on change processing order input
    _onChangeProcessingOrder = () => {

    }
    // on change radio group action
    _onChangeAction = (e) => {
        console.log(e.target.value)
    }
    _onResetAction = () => {

    }
    // onchane radio status
    _onChangeStatus = () => {

    }
    _onResetStatus = () => {

    }
    // on  select name
    _onSelectName = () => {

    }
    render() {
        const { onClose, visible, actionStatus } = this.props
        return (
            <Drawer
                title="More fitlers"
                destroyOnClose
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
                            Clear all filter
                        </Button>
                        <Button
                            type="primary"
                            onClick={this._onDone}
                        >
                            Done
                        </Button>

                    </div>
                }
            >
                <Collapse
                    defaultActiveKey={['1', '2', '3', '4', '5']}
                    expandIconPosition='right'
                    bordered={false}
                    style={{ backgroundColor: 'white' }}
                >
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Time filter</span>}
                        key="1"
                    >
                        <Row>
                            <label >By created order</label>
                            <RangePicker
                                showTime
                                style={{ marginTop: "16px" }}
                                onChange={this._onChangeCreatedOrder}
                            />
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <label >By processing order</label>
                            <RangePicker
                                showTime
                                style={{ marginTop: "16px" }}
                                onChange={this._onChangeProcessingOrder}
                            />
                        </Row>
                        <Button
                            style={{ paddingLeft: '0', marginTop: '10px' }}
                            type='link'
                        >
                            Clear
                        </Button>
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Action</span>}
                        key="2"
                    >
                        <Radio.Group onChange={this._onChangeAction}>
                            {config.balanceActions.map((action, index) => (
                                <Radio key={index} style={radioStyle} value={action}>{action}</Radio>
                            ))}
                            <Button style={{ paddingLeft: '0' }} type='link' onClick={this._onResetAction}>Clear</Button>
                        </Radio.Group>
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Status</span>}
                        key="3"
                    >
                        <Radio.Group onChange={this._onChangeStatus}>
                            {config.balanceStatus.map((action, index) => (
                                <Radio key={index} style={radioStyle} value={action}>{action}</Radio>
                            ))}
                            <Button style={{ paddingLeft: '0' }} type='link' onClick={this._onResetStatus}>Clear</Button>
                        </Radio.Group>
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Site name</span>}
                        key="4"
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Select seller"
                            optionFilterProp="children"
                            onChange={this._onSelectName}
                        >

                        </Select>
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Seller</span>}
                        key="5"
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Select seller"
                            optionFilterProp="children"
                            onChange={this._onSelectName}
                        >

                        </Select>
                    </Panel>
                </Collapse>
            </Drawer>
        )
    }
}
