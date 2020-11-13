import React, { Component } from 'react';
import { Drawer, Collapse, Button, Select, DatePicker, Row } from 'antd';
import { isMobile } from 'react-device-detect';
import moment from 'moment';

import * as config from '../../../config/project.config';
import checkSiteStatus from '../../../core/util/checkSiteStatus';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class FilterOrdersDrawer extends Component {

    // clear all filter
    _onClearFilter = () => {
        this.props.onClearFilter()
    }
    // Done filter
    _onDone = () => {
        const { onClose, refreshTable } = this.props;
        refreshTable();
        onClose();
    }
    // on change created order input
    _onChangeProductType = value => {
        this.props.onChangeProductType(value)
    }
    // on change processing order input
    _onChangeDate = date => {
        this.props.onChangeDate(date)
    }
    // on  select name
    onChageSupplier = value => {
        this.props.onChangeSupplier(value);
    }
    // on seletct seller
    onChangeSeller = value => {
        this.props.onChangeSeller(value)
    }
    // onchange tabs
    onChangeTabs = value => {
        if (value) {
            this.props.onChangeTabs(value);
        }
        else {
            this.props.onChangeTabs("ALL")
        }
    }
    onChangeSite = value => {
        this.props.onChangeSite(value)
    }
    render() {
        const {
            onClose,
            visible,
            capitalize,
            startDate,
            endDate,
            startDate2,
            endDate2,
            listProductTypeNoPaging,
            listSeller,
            productTypeId,
            seller,
            suppliers,
            supplier,
            active,
            site,
            sites
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
            // destroyOnClose
            >

                <Row>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Product status</label>
                    <Select
                        showSearch
                        placeholder="Choose product status"
                        onChange={this.onChangeTabs}
                        style={{ marginTop: "16px", width: "100%" }}
                        allowClear
                        value={active === "ALL" ? undefined : active}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {config.ordersProductStatus.map((item, index) => {
                            return <Option key={index} value={item}>{capitalize(item)}</Option>
                        })}
                    </Select>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Timer</label>
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
                <Row style={{ marginTop: "20px" }}>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Site</label>
                    <Select
                        showSearch
                        placeholder="Choose site"
                        optionFilterProp="children"
                        onChange={this.onChangeSite}
                        allowClear
                        style={{ marginTop: "16px", width: "100%" }}
                        value={site}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {sites.map(value => (
                            <Option key={value.id} value={value.id}>{`${value.title} ${checkSiteStatus(value)}`}</Option>
                        ))}
                    </Select>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Product type</label>
                    <Select
                        showSearch
                        placeholder="Choose product type"
                        optionFilterProp="children"
                        onChange={this._onChangeProductType}
                        allowClear
                        style={{ marginTop: "16px", width: "100%" }}
                        value={productTypeId}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {listProductTypeNoPaging.productType.map((item, index) => {
                            return (
                                <Option key={index} value={item.id} children={item.title} />
                            )
                        })}
                    </Select>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Seller</label>
                    <Select
                        showSearch
                        placeholder="Select seller"
                        optionFilterProp="children"
                        onChange={this.onChangeSeller}
                        style={{ marginTop: "16px", width: "100%" }}
                        allowClear
                        value={seller}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {listSeller.sellers.map(value => (
                            <Option key={value.id}
                                value={value.email}>{`${value.firstName || ''} ${value.lastName || ''}`}</Option>
                        ))}
                    </Select>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Supplier</label>
                    <Select
                        showSearch
                        placeholder="Select supplier"
                        optionFilterProp="children"
                        style={{ marginTop: "16px", width: "100%" }}
                        onChange={this.onChageSupplier}
                        allowClear
                        value={supplier}
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
                </Row>
                {/* <Row style={{ marginTop: "20px" }}>
                    <label style={{ fontFamily: 'Poppins-Medium' }} >Tracking status</label>
                    <Select
                        showSearch
                        placeholder="Select tracking status"
                        onChange={this.onChangeTrackingStatus}
                        style={{ marginTop: "16px", width: "100%" }}
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >

                    </Select>
                </Row> */}


            </Drawer>
        )
    }
}
