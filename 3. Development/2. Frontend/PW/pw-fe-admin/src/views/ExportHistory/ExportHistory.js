import React, { Component } from 'react';
import { Card, Button, Input, Row, Col, Table, DatePicker, Select } from 'antd';
import {
    ClockCircleOutlined,
    PaperClipOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import * as _ from 'lodash';
import moment from 'moment';

import ImportTracking from '../../components/Modal/ImportTracking/ImportTracking';
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class Orders extends Component {
    state = {
        currentPage: 0,
        pageSize: 10,
        keyword: "",
        startDate: null,
        endDate: null,
        supplier: undefined,
        openModalImportTracking: false
    }
    componentDidMount() {
        this.props.fetchExportHistory(this.checkParam())
        this.props.getAllSupplier();
    }

    checkParam = () => {
        const {
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            startDate,
            endDate,
            supplier
        } = this.state;

        const dataParams = {};

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order}`
        }
        if (keyword) {
            dataParams.keyword = keyword;
        }
        if (startDate && endDate) {
            dataParams.startDate = startDate;
            dataParams.endDate = endDate;
        }
        if (supplier) {
            dataParams.supplierId = supplier
        }
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };
    refreshTable = () => {
        this.setState({
            currentPage: 0
        }, () => this.props.fetchExportHistory(this.checkParam()))

    }
    onSearch = () => {
        this.refreshTable();
    }
    debounceSearch = _.debounce(e => {
        this.setState({
            keyword: e.trim()
        }, () => {
            if (e.length !== 1) {
                this.refreshTable();
            }
        })
    }, 300);

    onChangeKeyWord = e => {
        this.debounceSearch(e.target.value);
    }

    onShowSizeChange = (current, pageSize) => {
        this.setState({ pageSize }, this.refreshTable)
    }
    onChangeDate = dates => {
        if (dates) {
            this.setState({
                startDate: `${dates[0].format('YYYY-MM-DDT00:00:00.000')}Z`,
                endDate: `${dates[1].format('YYYY-MM-DDT23:59:59.000')}Z`,
            }, this.refreshTable)

        }
        else {
            this.setState({
                startDate: null,
                endDate: null,
            }, this.refreshTable)
        }
    }
    onChangeSupplier = value => {
        this.setState({ supplier: value }, this.refreshTable)
    }
    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
            currentPage: pagination.current - 1
        }, () => this.props.fetchExportHistory(this.checkParam()))

    };
    render() {
        const {
            currentPage,
            pageSize,
            openModalImportTracking
        } = this.state;
        const { exportHistory, listSuppliers } = this.props;
        const { listExportHistory, loading, totalElements } = exportHistory;
        const { suppliers } = listSuppliers;
        return (
            <>
                <Card
                    title={<span><ClockCircleOutlined style={{ marginRight: '5px' }} /> EXPORT HISTORY</span>}
                    headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                    bodyStyle={{ paddingBottom: '12px' }}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => this.setState({ openModalImportTracking: true })}
                            size={isMobile ? 'small' : 'middle'}
                        >
                            Import Tracking
                        </Button>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            {/*<Col md={8} xs={24}>*/}
                            {/*    <Search*/}
                            {/*        allowClear*/}
                            {/*        onSearch={this.onSearch}*/}
                            {/*        onChange={this.onChangeKeyWord}*/}
                            {/*        style={{ width: '100%' }}*/}
                            {/*        placeholder="Search by file name"*/}
                            {/*    />*/}
                            {/*</Col>*/}
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Supplier"
                                    onChange={this.onChangeSupplier}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                // value={supplier}
                                >
                                    {Array.isArray(suppliers) && suppliers.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id} children={item.firstName + " " + item.lastName} />
                                        )
                                    })}
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
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
                                    onChange={this.onChangeDate}
                                    style={{ width: "100%" }}
                                    // value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
                                />
                            </Col>
                        </Row>
                    </Input.Group>
                    <br />
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: "Supplier",
                                dataIndex: "supplierName",
                                key: "supplierName"
                            },
                            {
                                title: "FileName",
                                dataIndex: "title",
                                key: "title"
                            },
                            {
                                title: "Created At",
                                dataIndex: "createdDate",
                                key: "createdDate",
                                render: text => new Date(text).toLocaleString('en-GB')
                            },
                            {
                                title: "Action",
                                render: (text, record) => <Button
                                    href={record.url}
                                    style={{ padding: 0 }}
                                    type="link"
                                    children={<> <PaperClipOutlined /> Download </>}
                                />
                            }
                        ]}
                        dataSource={listExportHistory}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} orders`
                        }}
                        loading={loading}
                        showSizeChanger
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.handleTableChange}
                    >

                    </Table>
                    <ImportTracking
                        visible={openModalImportTracking}
                        handleCancel={() => this.setState({ openModalImportTracking: false})}
                        refreshTable={this.refreshTable}
                    />
                </Card>
            </>
        )
    }
}
