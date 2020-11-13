import React, { Component } from 'react'
import { Card, Button, Input, Row, Col, Select, DatePicker, Table, Tooltip, Badge, message } from 'antd';
import { HistoryOutlined, UploadOutlined, FilterOutlined, WalletOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import * as config from '../../config/project.config';
import NewTransaction from '../../components/Drawer/NewTransaction/NewTransaction';
import cls from "../UserBalances/balance.module.less";
import capitalize from '../../core/util/capitalize';


const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24 },
};

const CardItem = ({ title, content, tooltip, className }) => {
    return (
        <Card title={title}
            extra={<Tooltip
                title={tooltip}
            >
                <InfoCircleOutlined />
            </Tooltip>}
            bordered={false}
            loading={false}
            headStyle={{
                border: 'none'
            }}
            bodyStyle={{
                paddingTop: '10px',
                paddingBottom: '15px'
            }}
            style={{
                borderRadius: '0',
                borderRight: '1px solid #f0f0f0',
            }}
        >
            <span className={classnames(cls.text, className)}>
                {content}
            </span>
        </Card>
    )
};

export default class SupplierBalances extends Component {
    state = {
        pageSize: 10,
        totalElements: 0,
        currentPage: 0,
        keyword: "",
        startDate: null,
        endDate: null,
        status: undefined,
        openNewTransaction: false
    }
    componentDidMount() {
        this.props.fetchAllBalances(this.checkParam());
        this.props.fetchOverview(this.checkParamOverview());
        this.props.getAllSupplier();
    }
    checkParamOverview = () => {
        const { supplierId } = this.state;
        const dataParams = {};
        if (supplierId) {
            dataParams.supplierId = supplierId
        }

        return dataParams;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { customTransactionSuccess, customTransactionError, exportError } = this.props
        if (nextProps.customTransactionSuccess && nextProps.customTransactionSuccess !== customTransactionSuccess) {
            message.success("Custom transaction success!", () => {
                this.setState({ openNewTransaction: false });
                this.refreshTable()
            })
        }
        if (nextProps.customTransactionError && nextProps.customTransactionError !== customTransactionError) {
            message.error("Custom transaction error!")
        }
        if (nextProps.exportError && nextProps.exportError !== exportError) {
            message.error("Export error!")
        }
    }
    checkParam = () => {
        const {
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            startDate,
            endDate,
            supplierId,
            status
        } = this.state;

        const dataParams = {};

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order}`
        }
        if (keyword) {
            dataParams.keyword = keyword;
        }
        if (startDate && endDate) {
            dataParams.startDate = `${startDate.format('YYYY-MM-DDT00:00:00.000')}Z`;
            dataParams.endDate = `${endDate.format('YYYY-MM-DDT23:59:59.000')}Z`;
        }
        if (supplierId) {
            dataParams.supplierId = supplierId
        }
        if (status) {
            dataParams.status = status
        }
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };
    refreshTable = () => {
        this.setState({
            currentPage: 0
        }, () => this.props.fetchAllBalances(this.checkParam()))

    }
    // export event
    export = () => {

    }
    onChangeDate = date => {
        if (date) {
            this.setState({
                startDate: date[0],
                endDate: date[1],
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
    // change key word search
    onChangeKeyWord = e => {
        this.debounceSearch(e.target.value);
    }
    // onchange filter supplier
    onChangeSupplier = e => {
        this.setState({ supplierId: e }, () => {
            this.refreshTable();
            this.props.fetchOverview(this.checkParamOverview());
        })
    }
    // onchange fiter status
    onChangeStatus = e => {
        this.setState({
            status: e
        }, this.refreshTable)
    }
    // change pagesize tabel
    onShowSizeChange = (current, pageSize) => {
        this.setState({ pageSize }, this.refreshTable)
    }
    // open custom transaction
    openNewTransaction = () => {
        this.setState({
            openNewTransaction: true
        })
    }
    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
            currentPage: pagination.current - 1
        }, () => this.props.fetchAllBalances(this.checkParam()))

    };
    checkStatus = status => {
        switch (status) {
            case "APPROVED":
                return "success"
            case "PENDING":
                return "warning"
            case "REJECTED":
                return "yellow"
            case "DEBT":
                return "error"
            default:
                break;
        }
    }
    render() {
        const {
            currentPage,
            pageSize,
            openNewTransaction,
            startDate,
            endDate
        } = this.state;
        const { listBalances, overView, listSuppliers, customTransaction, customTransactionLoading, exportTransaction, exportLoading } = this.props;
        const { balances, loading, totalElements } = listBalances;
        const { data } = overView;
        const { suppliers } = listSuppliers;
        return (
            <>
                <Card
                    title={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <WalletOutlined style={{ marginRight: '5px' }} />
                            <span style={{ marginRight: '16px' }}>BALANCE OVERVIEW</span>
                            <Select
                                showSearch
                                allowClear
                                style={{ width: '200px' }}
                                placeholder="Filter by Supplier"
                                onChange={this.onChangeSupplier}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {Array.isArray(suppliers) && suppliers.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.id} children={item.firstName + " " + item.lastName} />
                                    )
                                })}
                            </Select>
                        </div>
                    }
                    headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                    bodyStyle={{
                        paddingBottom: '12px'
                    }}
                    // extra={
                    //     <Button type="primary" icon={<PlusOutlined />} size={isMobile ? 'small' : 'middle'}
                    //         onClick={this.showModal}>
                    //         Add funds
                    //     </Button>
                    // }
                    extra={
                        <>
                            <Button
                                type="link"
                                icon={<UploadOutlined />}
                                onClick={exportTransaction}
                                style={{ marginRight: '16px' }}
                                size={isMobile ? 'small' : 'middle'}
                                loading={exportLoading}
                            >
                                Export
                            </Button>
                            <Button
                                type="primary"
                                size={isMobile ? 'small' : 'middle'}
                                onClick={this.openNewTransaction}
                            >
                                New transaction
                            </Button>
                        </>
                    }
                    loading={overView.loading}
                >
                    <Row gutter={24} type={'flex'}>
                        {/* <Col {...topColResponsiveProps}>
                            <CardItem className={cls.green} title='AVAILABALE AMOUNT'
                                content={`$${_.get(data, 'availableAmount', 0).toLocaleString()}`}
                                tooltip='Paid Amount' />
                        </Col> */}
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.red} title='UPCOMING AMOUNT'
                                content={`$${parseFloat(_.get(data, 'upcomingAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Upcoming Amount = Supplier Cost - Paid amount' />
                        </Col>
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.black} title='PAID AMOUNT'
                                content={`$${parseFloat(_.get(data, 'paidAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='The total money that admin paid to Supplier' />
                        </Col>

                    </Row>
                </Card>
                <Card
                    style={{ marginTop: "25px" }}
                // title={<span><HistoryOutlined style={{ marginRight: '5px' }} />BALANCE</span>}
                // headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={8} xs={24}>
                                <Search
                                    allowClear
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{ width: '100%' }}
                                    placeholder="Search by transaction ID or created by"
                                />
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
                                />
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by status"
                                    onChange={this.onChangeStatus}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value="DEBT">Upcoming amount</Option>
                                    <Option value="APPROVED">Approved</Option>
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                {/* <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by Supplier"
                                    onChange={this.onChangeSupplier}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {Array.isArray(suppliers) && suppliers.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id} children={item.firstName + " " + item.lastName} />
                                        )
                                    })}
                                </Select> */}
                            </Col>
                        </Row>
                    </Input.Group>
                    <br />
                    <Table
                        rowKey={record => record.id}
                        dataSource={balances}
                        columns={[
                            {
                                title: "Supplier",
                                dataIndex: "email",
                                key: "email"
                            },
                            {
                                title: "ID",
                                dataIndex: "number",
                                key: "number",
                                ellipsis: !isMobile,
                                render: text => "#" + text
                            },
                            {
                                title: "Amount",
                                dataIndex: "amount",
                                key: "amount",
                                render: text => {
                                    if (text < 0) return "-$" + Math.abs(text).toLocaleString('en-GB');
                                    return "$" + parseFloat(text).toLocaleString('en-GB');
                                }
                            },
                            {
                                title: "Transaction ID",
                                dataIndex: "transactionId",
                                key: "transactionId"
                            },
                            {
                                title: "Created by",
                                dataIndex: "createdBy",
                                key: "createdBy",
                            },
                            {
                                title: "Created Date",
                                dataIndex: "createdDate",
                                key: "createdDate",
                                render: text => new Date(text).toLocaleString('en-GB')
                            },
                            {
                                title: "Status",
                                dataIndex: "status",
                                key: "status",
                                render: text => (
                                    <Badge
                                        status={this.checkStatus(text)}
                                        text={text === "DEBT" ? "Upcoming amount" : capitalize(text)}
                                    />
                                )
                            },
                            {
                                title: "Note",
                                dataIndex: "note",
                                key: "note",
                                render: this.renderNote,
                                width: 200
                            },
                        ]}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} balances`
                        }}
                        loading={loading}
                        showSizeChanger
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.handleTableChange}

                    >

                    </Table>
                </Card>
                <NewTransaction
                    visible={openNewTransaction}
                    onClose={() => this.setState({ openNewTransaction: false })}
                    suppliers={suppliers}
                    customTransaction={customTransaction}
                    customTransactionLoading={customTransactionLoading}
                />
            </>
        )
    }
}
