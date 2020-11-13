import React, { Component } from 'react';
import { Card, Button, Input, Select, Row, Col, Menu, Badge, Table, Dropdown, Tooltip, message, DatePicker, Alert } from 'antd';
import {
    UploadOutlined,
    ShoppingCartOutlined,
    DownloadOutlined,
    SettingOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import * as _ from 'lodash';

import * as config from '../../config/project.config';
import PrintDesignDrawer from '../../components/Drawer/PrintDesign/PrintDesign';
import ImportOrderModal from '../../components/Modal/ImportOrder/ImportOrderModal';
import CancelModal from '../../components/Modal/CancelModal/CancelModal';
import ModalExport from '../../components/Modal/ModalExport/ModalExport';
import cls from './Orders.module.less';
import capitalize from '../../core/util/capitalize';
import moment from 'moment';
import ReactHtmlParser from "react-html-parser";


const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class Orders extends Component {
    state = {
        active: "ALL",
        currentPage: 0,
        pageSize: 10,
        keyword: "",
        startDate: null,
        endDate: null,
        isAll: false,
        lineItemCurrent: null,
        openPrintDesignDrawer: false,
        openModalImportOrder: false,
        openModalReportError: false,
        openModalExport: false,
        productTypeId: undefined,
        openModalCancel: false,
        rowsKeySelected: [],
        rowsSelected: [],
        onlyExport: true,
        totalLineItem:0,
    }
    componentDidMount() {
        const { fetchAllProductTypeNoPaging, fetchAllOrder, fetchStatistic, fetchUrgentNote } = this.props;
        fetchAllOrder(this.checkParam());
        fetchAllProductTypeNoPaging();
        fetchStatistic();
        fetchUrgentNote();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            exportSuccess,
            exportError,
            cancelSuccess,
            cancelError,
            reportSuccess,
            reportError
        } = this.props;
        if (nextProps.exportSuccess && nextProps.exportSuccess !== exportSuccess) {
            message.success("Export success!")
            this.setState({
                openModalExport: false,
                lineItemCurrent: null,
                rowsKeySelected: [],
                rowsSelected: [],
                onlyExport: true
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.exportError && nextProps.exportError !== exportError) {
            message.error("Export error!")
        }
        if (nextProps.cancelSuccess && nextProps.cancelSuccess !== cancelSuccess) {
            message.success("Cancel success!")
            this.setState({
                openModalCancel: false,
                lineItemCurrent: null,
                rowsKeySelected: [],
                rowsSelected: []
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.cancelError && nextProps.cancelError !== cancelError) {
            message.error("Cancel error!")
        }
        if (nextProps.reportSuccess && nextProps.reportSuccess !== reportSuccess) {
            message.success("Report error success!")
            this.setState({
                openModalReportError: false,
                lineItemCurrent: null,
                rowsKeySelected: [],
                rowsSelected: []
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.reportError && nextProps.reportError !== reportError) {
            message.error("Report error!")
        }

    }
    checkParam = () => {
        const {
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            active,
            startDate,
            endDate,
            productTypeId,
            isAll,
            onlyExport
        } = this.state;

        const dataParams = {};

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order}`
        }
        if (keyword) {
            dataParams.keyword = keyword;
        }
        if (active !== "ALL") {
            dataParams.itemStatus = active;
        }
        if (startDate && endDate) {
            dataParams.startDate = startDate;
            dataParams.endDate = endDate;
        }
        if (productTypeId) {
            dataParams.productTypeId = productTypeId;
        }
        dataParams.onlyExport = onlyExport;
        dataParams.page = currentPage;
        dataParams.size = pageSize;
        dataParams.isAll = isAll;

        return dataParams;
    };
    refreshTable = () => {
        this.props.fetchAllOrder(this.checkParam());
        this.props.fetchStatistic();
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

    onSearch = () => {
        this.setState({
            currentPage: 0
        }, this.refreshTable)
    }
    debounceSearch = _.debounce(e => {
        this.setState({
            currentPage: 0,
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
         // this.setState({ pageSize }, this.refreshTable)
    }

    onChangeProductType = (value) => {
        this.setState({
            productTypeId: value
        }, () => this.refreshTable(this.checkParam()))
    }
    onChangeTabs = (value) => {
        const {listStatistic} = this.props;
        const { statistic } = listStatistic;
        this.setState({
            currentPage: 0,
            active: value,
            totalLineItem: statistic.statistic[value]
        }, () => this.refreshTable())
    }
    lineItemAction = (action, record) => {
        switch (action) {
            case "REPORT_ERROR":
                this.setState({
                    openModalReportError: true,
                    lineItemCurrent: record
                })
                break;
            case "CANCEL":
                this.setState({
                    openModalCancel: true,
                    lineItemCurrent: record
                })
                break;
            default:
                break;
        }
    }
    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
            currentPage: pagination.current - 1
        }, () => this.props.fetchAllOrder(this.checkParam()))

    };
    onSelectRow = (selectedRowKeys, selectedRows) => {
        this.setState({ rowsSelected: selectedRows, rowsKeySelected: selectedRowKeys })
    }
    onExport = () => {
        const { rowsSelected } = this.state;
        if (rowsSelected.length > 0) {
            this.setState({
                isAll: false
            }, () => this.props.exportOrder(this.checkParam(), rowsSelected.map(el => ({ orderId: el.orderId, itemSku: el.sku }))))
        }
        else {
            this.setState({
                isAll: true
            }, () => this.props.exportOrder(this.checkParam(), []))

        }
    }
    onChangeOnlyExport = e => {
        this.setState({ onlyExport: !e.target.checked })
        // console.log(!e.target.checked)
    }
    render() {
        const {
            active,
            currentPage,
            pageSize,
            lineItemCurrent,
            openPrintDesignDrawer,
            openModalImportOrder,
            productTypeId,
            openModalCancel,
            // openModalReportError,
            openModalExport,
            rowsKeySelected,
            totalLineItem,
        } = this.state;
        const {
            listOrders,
            saveImageDesign,
            saveImageDesignSuccess,
            saveImageDesignError,
            doSaveImageDesign,
            listProductTypeNoPaging,
            doExport,
            cancel,
            cancelLoading,
            listStatistic,
            urgentNote,
            // report,
            // reportLoading,
        } = this.props;

        const { orders, loading, totalElements } = listOrders;
        const { statistic } = listStatistic;
        let orders2 = orders.map(order => {
            return {
                ...order,
                lineItems: order.lineItems.map(item => ({
                    ...item,
                    orderName: order.orderName,
                    currency: order.currency,
                    orderId: order.id,
                    resendId: order.id + "-" + item.sku
                })),
            }
        })
        const listlineItems = [];

        orders2.forEach(el => {
            listlineItems.push(...el.lineItems);
        });
        let totalLineItemForAll = 0;
        const renderStatusTab = () => {
            return config.ordersProductStatus.map((item, index) => {
                if (item === "PROCESSING" || item === "IN_PRODUCTION") {
                    return (
                        <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={99} key={item} style={{ backgroundColor: '#0033FF' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge>
                    )
                }
                if (item === "SHIPPED") {
                    return (
                        <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={99} key={index} style={{ backgroundColor: '#00FF00' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                Fulfillment
                            </li>
                        </Badge>
                    )
                }
                if (item === "ALL") {
                    totalLineItemForAll = statistic.statistic[item];
                    return (
                        <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={99} key={index} style={{ backgroundColor: '#808B96' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge>
                    )
                }
                return (
                    <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={99} key={item} style={{ backgroundColor: '#FF0000' }}>
                        <li
                            className={`${active === item ? cls.active : ""}`}
                            onClick={() => this.onChangeTabs(item)}

                        >
                            {capitalize(item)}
                        </li>
                    </Badge>
                )
            })
        }
        const menuLineItem = record => (
            <Menu>
                {config.orderAction.map((item, index) => {
                    if (item === "CANCEL" && (record.status === "CANCELED" || record.status === "IN_PRODUCTION" || record.status === "SHIPPED")) {
                        return null;
                    }
                    if (item === "CANCEL") {
                        return <Menu.Item key={index} children={<><CloseCircleOutlined className={cls.red} /> {capitalize(item)}</>} onClick={() => this.lineItemAction(item, record)} />
                    }
                    if (item === "REPORT_ERROR") {
                        return null
                        // return <Menu.Item key={index} children={<><SelectOutlined className={cls.green}/> {capitalize(item)}</>} onClick={() => this.lineItemAction(item, record)} />
                    }
                    return (
                        <Menu.Item key={index} children={capitalize(item)} onClick={() => this.lineItemAction(item, record)} />
                    )
                })}
            </Menu>
        );

        return (
            <>
                {
                    Array.isArray(urgentNote.note) && urgentNote.note.length > 0 && (
                        <>
                            <Alert
                                message={urgentNote.note[urgentNote.note.length - 1].title || ''}
                                description={ReactHtmlParser(urgentNote.note[urgentNote.note.length - 1].content || '')}
                                type="info"
                                showIcon
                                closable
                            />
                            <br />
                        </>
                    )
                }

                <Card
                    title={<span><ShoppingCartOutlined style={{ marginRight: '5px' }} /> ORDERS MANAGER</span>}
                    headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                    bodyStyle={{ paddingBottom: '12px' }}
                    extra={
                        <>
                            <Button
                                type="link"
                                icon={<DownloadOutlined />}
                                size={isMobile ? 'small' : 'middle'}
                                onClick={() => this.setState({ openModalImportOrder: true })}
                            >
                                Import Tracking
                            </Button>
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                onClick={() => this.setState({ openModalExport: true })}
                                size={isMobile ? 'small' : 'middle'}
                                disabled={doExport}
                                loading={doExport}
                            >
                                Export Orders
                            </Button>
                        </>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={8} xs={24}>
                                <Search
                                    allowClear
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{ width: '100%' }}
                                    placeholder="Search..."
                                    suffix={
                                        <Tooltip title="Search by order name, product name, product SKU">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Product types"
                                    onChange={this.onChangeProductType}
                                    value={productTypeId}
                                    optionFilterProp="children"
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
                    <div className={cls.tabs}>
                        <ul>
                            {statistic && statistic.statistic && renderStatusTab()}
                        </ul>
                    </div>
                    <Table
                        rowKey={record => record.resendId}
                        dataSource={listlineItems}
                        columns={[
                            {
                                title: "Order Name",
                                dataIndex: "orderName",
                                key: "orderName",
                                render: text => "#" + text,
                                fixed: "left",
                                // width: 80
                            },
                            {
                                title: "Product",
                                dataIndex: "name",
                                key: "name",
                                render: (text, record) => {
                                    return (
                                        <>
                                            <p style={{ marginBottom: 0 }}>{text}</p>
                                            <p style={{ fontSize: "12px" }}><i>Sku: </i><i>{record.sku}</i></p>
                                        </>
                                    )
                                },
                                fixed: "left",
                                width: 300
                            },
                            {
                                title: "Designs",
                                key: "design",
                                render: (text, record) => (
                                    <Badge count={record.numberDesignMissing}>
                                        <Button onClick={() => this.setState({
                                            openPrintDesignDrawer: true,
                                            lineItemCurrent: record
                                        })}
                                        >
                                            View
                                        </Button>
                                    </Badge>
                                )
                            },
                            {
                                title: "Supplier Cost",
                                dataIndex: "supplierCost",
                                key: "supplierCost",
                                ellipsis: !isMobile,
                                render: (text, record) => `${parseFloat(text).toLocaleString('en-GB')}${record.currency === 'VND' ? 'đ':'$'}`,
                            },
                            {
                                title: "Quantity",
                                dataIndex: "quantity",
                                key: "quantity",
                                ellipsis: !isMobile,
                                render: (text) => parseFloat(text).toLocaleString('en-GB')
                            },
                            {
                                title: "Carrier",
                                dataIndex: "carrier",
                                key: "carrier",
                                ellipsis: !isMobile,
                            },
                            {
                                title: "Processing date",
                                dataIndex: "lastStatusDate",
                                key: "lastStatusDate",
                                ellipsis: !isMobile,
                                render: text => new Date(text).toLocaleString('en-GB'),
                            },
                            {
                                title: "Status",
                                dataIndex: "status",
                                key: "status",
                                render: (text, record) => <span className={cls.black} children={capitalize(text)} />
                            },
                            {
                                title: "Action",
                                key: "action",
                                render: (text, record) => {
                                    if (record.status === "CANCELED" || record.status === "REQUEST_CANCEL" || record.status === "IN_PRODUCTION" || record.status === "SHIPPED") {
                                        return null
                                    }
                                    return <Dropdown.Button overlay={menuLineItem(record)} placement="bottomCenter" icon={<SettingOutlined />} type="link" />
                                }
                            },
                        ]}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: listlineItems.length,
                            total: active === 'ALL' ? totalLineItemForAll : totalLineItem,
                            // showSizeChanger: true,
                            // onShowSizeChange: this.onShowSizeChange,
                            // showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${totalElements} orders (${total} line item)`
                        }}
                        loading={loading}
                        // showSizeChanger
                        // onShowSizeChange={this.onShowSizeChange}
                        onChange={this.handleTableChange}
                        rowSelection={{
                            type: "checkbox",
                            onChange: this.onSelectRow,
                            selectedRowKeys: rowsKeySelected
                        }}
                    >

                    </Table>
                </Card>
                <PrintDesignDrawer
                    visible={openPrintDesignDrawer}
                    onClose={() => this.setState({ openPrintDesignDrawer: false, lineItemCurrent: null })}
                    lineItemCurrent={lineItemCurrent}
                    saveImageDesign={saveImageDesign}
                    doSaveImageDesign={doSaveImageDesign}
                    saveImageDesignSuccess={saveImageDesignSuccess}
                    saveImageDesignError={saveImageDesignError}
                />
                <ImportOrderModal
                    visible={openModalImportOrder}
                    handleCancel={() => this.setState({ openModalImportOrder: false })}
                    refreshTable={this.refreshTable}
                />
                <CancelModal
                    visible={openModalCancel}
                    handleCancel={() => this.setState({ openModalCancel: false, lineItemCurrent: null })}
                    lineItem={lineItemCurrent}
                    cancel={cancel}
                    cancelLoading={cancelLoading}
                />
                <ModalExport
                    visible={openModalExport}
                    handleCancel={() => this.setState({ openModalExport: false })}
                    doExport={doExport}
                    export={this.onExport}
                    onChangeCheckBox={this.onChangeOnlyExport}
                />
                {/* <ReportErrorModal
                    visible={openModalReportError}
                    handleCancel={() => this.setState({ openModalReportError: false, lineItemCurrent: null })}
                    lineItem={lineItemCurrent}
                    report={report}
                    reportLoading={reportLoading}
                /> */}
            </>
        )
    }
}
