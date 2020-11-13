import React, { Component } from 'react';
import { Drawer, Collapse, Button, Select, DatePicker, Row } from 'antd';
import { isMobile } from 'react-device-detect';
import moment from 'moment';

import * as config from '../../../config/project.config';

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
    // onChangeSeller = value => {
    //     this.props.onChangeSeller(value)
    // }
    onChangeTabs = value => {
        if (value) {
            this.props.onChangeTabs(value);
        }
        else {
            this.props.onChangeTabs("ALL")
        }
    }
    render() {
        const {
            onClose,
            visible,
            capitalize,
            startDate,
            endDate,
            listProductTypeNoPaging,
            // listSeller,
            onChangeSeller,
            onChangeProductType,
            productTypeId,
            suppliers,
            supplier,
            // seller,
            active
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
                    <label >Product status</label>
                    <Select
                        showSearch
                        placeholder="Choose product status"
                        optionFilterProp="children"
                        onChange={this.onChangeTabs}
                        style={{ marginTop: "16px", width: "100%" }}
                        allowClear
                        value={active === "ALL"? undefined : active}
                    >
                        {config.ordersProductStatus.map((item, index) => {
                            return <Option key={index} value={item}>{capitalize(item)}</Option>
                        })}
                    </Select>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <label >Timer</label>
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
                    <label>Product type</label>
                    <Select
                        showSearch
                        placeholder="Choose product type"
                        optionFilterProp="children"
                        onChange={this._onChangeProductType}
                        allowClear
                        style={{ marginTop: "16px", width: "100%" }}
                        value={productTypeId}
                    >
                        {listProductTypeNoPaging.productType.map((item, index) => {
                            return (
                                <Option key={index} value={item.id} children={item.title} />
                            )
                        })}
                    </Select>
                </Row>
                {/* <Row style={{ marginTop: "20px" }}>
                    <label>Seller</label>
                    <Select
                        showSearch
                        placeholder="Select seller"
                        optionFilterProp="children"
                        onChange={this.onChangeSeller}
                        style={{ marginTop: "16px", width: "100%" }}
                        allowClear
                        value={seller}
                    >
                        {listSeller.sellers.map(value => (
                            <Option key={value.id}
                                value={value.id}>{`${value.lastName || ''} ${value.firstName || ''}`}</Option>
                        ))}
                    </Select>
                </Row> */}
                <Row style={{ marginTop: "20px" }}>
                    <label>Supplier</label>
                    <Select
                        showSearch
                        placeholder="Select supplier"
                        optionFilterProp="children"
                        style={{ marginTop: "16px", width: "100%" }}
                        onChange={this.onChageSupplier}
                        allowClear
                        value={supplier}
                    >
                        {suppliers && suppliers.map((item, index) => {
                            return (
                                <Option key={index} value={item.id} children={item.firstName + " " + item.lastName} />
                            )
                        })}
                    </Select>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <label>Tracking status</label>
                    <Select
                        showSearch
                        placeholder="Select tracking status"
                        optionFilterProp="children"
                        onChange={this.onChangeTrackingStatus}
                        style={{ marginTop: "16px", width: "100%" }}
                        allowClear
                    >

                    </Select>
                </Row>


            </Drawer>
        )
    }
}
