import React, { Component } from 'react';
import { Drawer, Collapse, Button, Select, DatePicker, Row, Radio } from 'antd';
import { isMobile } from 'react-device-detect';
import moment from 'moment';

import * as config from '../../../config/project.config';
import checkSiteStatus from '../../../core/util/checkSiteStatus';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};
export default class FilterBalancesDrawer extends Component {
    // clear all filter
    _onClearFilter = () => {
        this.props.clearAllFilter()
    }
    // Done filter
    _onDone = () => {
        const { refreshTable, onClose } = this.props;
        refreshTable();
        onClose();
    }
    // on change created order input
    _onChangeProduct = () => {

    }
    // on change processing order input
    _onChangeDate = date => {
        this.props.onChangeDate(date)
    }
    // on change radio group action
    _onChangeAction = (e) => {
        this.props.onChangeAction(e.target.value);
    }
    _onResetAction = () => {
        this.props.clearActionFilter()
    }
    // onchane radio status
    _onChangeStatus = (e) => {
        this.props.onChangeStatus(e.target.value)
    }
    _onResetStatus = () => {
        this.props.clearStatusFilter()
    }
    // on  select name
    onChangeSite = value => {
        this.props.onChangeSite(value)
    }
    // on seletct seller
    onChangeSeller = value => {
        this.props.onChangeSeller(value)
    }
    render() {
        const {
            onClose,
            visible,
            capitalize,
            startDate,
            endDate,
            status,
            action,
            listSeller,
            sites,
            site,
            seller
        } = this.props
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
                            <RangePicker
                                ranges={{
                                    Today: [moment(), moment()],
                                    Yesterday: [moment().add(-1, 'days'), moment().add(-1, 'days')],
                                    'Last 7 days': [moment().subtract(6, 'days'), moment()],
                                    'Last 30 days': [moment().subtract(29, 'days'), moment()],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    'Last Month': [moment().subtract(1, 'months').startOf('month'),
                                    moment().subtract(1, 'months').endOf('month')],
                                    // 'Last 3 Month': [moment().subtract(3, 'months').startOf('month'),
                                    //     moment().subtract(1, 'months').endOf('month')],
                                }}
                                // renderExtraFooter={() => <div>MyFooter</div>}
                                // showToday
                                showTime={!!isMobile}
                                format="DD/MM/YYYY"
                                // defaultValue={[moment().subtract(6, 'days'), moment()]}
                                onChange={this._onChangeDate}
                                style={{ marginTop: "16px", width: "100%" }}
                                value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
                            />
                        </Row>
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Action</span>}
                        key="2"
                    >
                        <Radio.Group onChange={this._onChangeAction} value={action}>
                            {config.balanceActions.map((action, index) => {
                                if (action === "PAID_ITEM") return <Radio key={index} style={radioStyle} value={action}>Fulfilled</Radio>
                                if (action === "CUSTOM_TRANSACTION") return <Radio key={index} style={radioStyle} value='CUSTOM'>Custom Transaction</Radio>
                                return <Radio key={index} style={radioStyle} value={action}>{capitalize(action)}</Radio>
                            })}
                            <Button style={{ paddingLeft: '0' }} type='link' onClick={this._onResetAction}>Clear</Button>
                        </Radio.Group>
                    </Panel>
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>Status</span>}
                        key="3"
                    >
                        <Radio.Group onChange={this._onChangeStatus} value={status}>
                            {config.balanceStatus.map((status, index) => {
                                if (status === "DEBT") return <Radio key={index} style={radioStyle} value={status}>Upcoming amount</Radio>
                                return <Radio key={index} style={radioStyle} value={status}>{capitalize(status)}</Radio>
                            })}
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
                            placeholder="Select Site"
                            optionFilterProp="children"
                            onChange={this.onChangeSite}
                            allowClear
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            value={site}
                        >
                            {
                                sites.map(value => (
                                    <Option key={value.id} value={value.id}>{`${value.title} ${checkSiteStatus(value)}`}</Option>
                                ))
                            }
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
                            onChange={this.onChangeSeller}
                            allowClear
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            value={seller}
                        >
                            {listSeller && listSeller.sellers.map(value => (
                                <Option key={value.id}
                                    value={value.email}>{`${value.firstName || ''} ${value.lastName || ''}`}</Option>
                            ))}
                        </Select>
                    </Panel>
                </Collapse>
            </Drawer>
        )
    }
}
