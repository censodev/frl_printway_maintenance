import React, { Component } from 'react'
import { Card, Button, Input, Row, Col, Select, DatePicker, Table, Tooltip, Badge, Space, Popconfirm, message, Tag } from 'antd';
import { CheckCircleOutlined, UploadOutlined, FilterOutlined, WalletOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import * as config from '../../config/project.config';
import UserFilterBalancesDrawer from '../../components/Drawer/FilterUserBalancesDrawer/FilterUserBalancesDrawer';
import UserCustomTransactionDrawer from '../../components/Drawer/CustomTransaction/CustomTransactionDrawer';
import RejectModal from '../../components/Modal/RejectDeposit/RejectDeposit';
import cls from "./balance.module.less";
import checkSiteStatus from "../../core/util/checkSiteStatus";


const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24 },
};
const capitalize = text => {
    const arr = text.split("");
    return arr.map((item, index) => {
        if (item === "_") return " "
        if (index === 0) return item
        else return item.toLowerCase()
    }).join("")
}

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
const key = "userBalance";
const tagStyle = {
    marginBottom: '15px',
    fontSize: '13px',
    padding: '2px 8px',
    borderStyle: 'dashed',
};


export default class UserBalances extends Component {
    state = {
        pageSize: 10,
        currentPage: 0,
        keyword: "",
        status: undefined,
        action: undefined,
        startDate: null,
        endDate: null,
        openFilterDrawer: false,
        openCustomTransactionDrawer: false,
        openModalReject: false,
        notes: "",
        site: undefined,
        seller: undefined,
        record: null,
    }
    componentDidMount() {
        this.props.doFetchUserBalance();
        this.props.doFetchAllBalances(this.checkParam());
        this.props.fetchAllSeller();
        this.props.fetchAllSitesNoPaging();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { approveSuccess, rejectSuccess, approveError, rejectError, customTransactionSuccess, customTransactionError, exportError } = this.props;
        if (nextProps.approveSuccess && nextProps.approveSuccess !== approveSuccess) {
            message.success({
                content: "Success",
                duration: 1.5,
                key,
                onClose: this.refreshTable
            })
        }
        if (nextProps.rejectSuccess && nextProps.rejectSuccess !== rejectSuccess) {
            message.success({
                content: "Success",
                duration: 1.5,
                key,
                onClose: () => {
                    this.refreshTable();
                    this.setState({ openModalReject: false })
                }
            })
        }
        if (nextProps.approveError && nextProps.approveError !== approveError) {
            message.error({
                content: nextProps.approveError,
                duration: 1.5,
                key,
                onClose: () => {
                    this.refreshTable();
                    this.setState({ openModalReject: false })
                }
            })
        }
        if (nextProps.rejectError && nextProps.rejectError !== rejectError) {
            message.error({
                content: nextProps.rejectError,
                duration: 1.5,
                key,
                onClose: () => {
                    this.refreshTable();
                    this.setState({ openModalReject: false })
                }
            })
        }
        if (nextProps.customTransactionSuccess && nextProps.customTransactionSuccess !== customTransactionSuccess) {
            message.success("Custom transaction success!", () => {
                this.setState({ openCustomTransactionDrawer: false });
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
            status,
            action,
            startDate,
            endDate,
            site,
            seller
        } = this.state;

        const dataParams = {};

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order}`
        }
        if (keyword) {
            dataParams.keyword = keyword;
        }
        if (status) {
            dataParams.status = status;
        }
        if (action) {
            dataParams.action = action;
        }
        if (startDate && endDate) {
            dataParams.startDate = `${startDate.format('YYYY-MM-DDT00:00:00.000')}Z`;
            dataParams.endDate = `${endDate.format('YYYY-MM-DDT23:59:59.000')}Z`;
        }
        if (seller) {
            dataParams.email = seller
        }
        if (site) {
            dataParams.siteId = site
        }
        dataParams.page = currentPage;
        dataParams.size = pageSize;
        return dataParams;
    };
    refreshTable = () => {
        this.setState({
            currentPage: 0
        }, () => this.props.doFetchAllBalances(this.checkParam()))

    }
    // export event
    export = () => {
        this.props.exportOrder(this.checkParam())
    }
    // search click event
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
    // change key word search
    onChangeKeyWord = e => {
        this.debounceSearch(e.target.value);
    }
    // onchange filter action
    onChangeAction = e => {
        this.setState({ action: e, currentPage: 0 }, this.refreshTable)
    }
    // onchange fiter status
    onChangeStatus = e => {
        this.setState({
            currentPage: 0,
            status: e
        }, this.refreshTable)
    }
    onChangeSite = site => {
        this.setState({ site, currentPage: 0 }, this.refreshTable)
    }
    onChangeSeller = seller => {
        this.setState({ seller, currentPage: 0 }, () => {
            this.refreshTable();
            this.props.doFetchUserBalance(this.props.listSeller?.sellers.find(item => item.email === seller)?.id)
        })
    }
    // change date
    onChangeDate = date => {
        if (date) {
            this.setState({
                currentPage: 0,
                startDate: date[0],
                endDate: date[1],
            }, this.refreshTable)

        }
        else {
            this.setState({
                currentPage: 0,
                startDate: null,
                endDate: null,
            }, this.refreshTable)
        }
    }
    // change pagesize tabel
    onShowSizeChange = (current, pageSize) => {
        this.setState({ pageSize }, this.refreshTable)
    }
    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
            currentPage: pagination.current - 1
        }, () => this.props.doFetchAllBalances(this.checkParam()))

    };
    // open more filter
    openMoreFilter = () => {
        this.setState({
            openFilterDrawer: true
        })
    }
    // close filter drawer
    onCloseFilterDrawer = () => {
        this.setState({
            openFilterDrawer: false
        })
    }
    // open custom transaction
    openCustomTransactionDrawer = () => {
        this.setState({
            openCustomTransactionDrawer: true
        })
    }
    // close custom transaction
    onCloseCustomTransactionDrawer = () => {
        this.setState({
            openCustomTransactionDrawer: false
        })
    }
    // approve
    approve = id => {
        this.props.approve(id);
    }
    // reject
    reject = id => {
        this.props.reject(id);
    }
    // remove tag
    onRemoveTag = (key) => {
        switch (key) {
            case 'status':
                return this.onChangeStatus(undefined);
            case 'action':
                return this.onChangeAction(undefined);
            case 'date':
                return this.onChangeDate(null)
            case 'seller':
                return this.onChangeSeller(undefined)
            case "site":
                return this.onChangeSite(undefined)
            default:
                break;
        }
    };
    openModalReject = value => {
        this.setState({
            notes: value,
            openModalReject: true
        })
    }
    clearAllFilter = () => {
        this.setState({
            startDate: null,
            endDate: null,
            action: undefined,
            status: undefined,
            site: undefined,
            seller: undefined
        })
    }
    clearStatusFilter = () => {
        this.setState({
            status: undefined
        }, this.refreshTable)
    }
    clearActionFilter = () => {
        this.setState({
            action: undefined
        }, this.refreshTable)
    }
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
    renderNote = (text, record) => {
        if (record.type === "PAID_ITEM") {
            const arrText = text.split(" - Line item:");
            const order = arrText[0].substr(14);
            const lineItem = arrText[1];
            return (
                <div>
                    <div><span style={{ fontWeight: "bold" }}>Order:</span> {order}</div>
                    <div><span style={{ fontWeight: "bold" }}>LineItem: </span>{lineItem}</div>
                </div>
            )
        }
        return text
    }
    render() {
        const {
            currentPage,
            pageSize,
            openFilterDrawer,
            openCustomTransactionDrawer,
            status,
            action,
            startDate,
            endDate,
            site,
            seller,
            openModalReject,
            record
        } = this.state;
        const { listBalances, userBalance, listSeller, customTransaction, customTransactionLoading, listSitesNoPaging, rejectLoading } = this.props;
        const { balances, loading, totalElements } = listBalances;
        const { data } = userBalance;
        const { sites } = listSitesNoPaging;
        return (
            <>
                <Card
                    title={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <WalletOutlined style={{ marginRight: '5px' }} />
                            <span style={{ marginRight: '16px' }}>BALANCE OVERVIEW</span>
                            <Select
                                showSearch
                                style={{ width: "200px" }}
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
                                style={{ marginRight: '16px' }}
                                size={isMobile ? 'small' : 'middle'}
                                onClick={this.export}
                                loading={this.props.exportLoading}
                            >
                                Export
                            </Button>
                            <Button
                                type="primary"
                                size={isMobile ? 'small' : 'middle'}
                                onClick={this.openCustomTransactionDrawer}
                            >
                                Custom transaction
                            </Button>
                        </>
                    }
                    loading={userBalance.loading}
                >
                    <Row gutter={24} type={'flex'}>
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.green} title='AVAILABLE AMOUNT'
                                content={`$${parseFloat(_.get(data, 'availableAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Available amount = Approved Deposit - Paid amount: The money amount that is available for charging orders' />
                        </Col>
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.red} title='UNPAID'
                                content={`$${parseFloat(_.get(data, 'upcomingAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Unpaid = Sum of your non-charge orders – Available amount: Here the money you need to make deposit so that all non-charged orders can be paid and processed.' />
                        </Col>
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.orange} title='PENDING DEPOSIT'
                                content={`$${parseFloat(_.get(data, 'pendingAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Pending deposit = All Deposit that Admin not Approved nor Rejected yet' />
                        </Col>
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.blue} title='PAID AMOUNT'
                                content={`$${parseFloat(_.get(data, 'paidAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Paid amount = Your total money that is charged on your orders.' />
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
                            <Col md={4} xs={24}>
                                <Search
                                    allowClear
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{ width: '100%' }}
                                    placeholder="Search"
                                    suffix={
                                        <Tooltip title="Search by transaction ID or created by">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
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
                                    value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
                                />
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by site"
                                    onChange={this.onChangeSite}
                                    value={site}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        sites.map(value => (
                                            <Option key={value.id} value={value.id}>{`${value.title} ${checkSiteStatus(value)}`}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by action"
                                    onChange={this.onChangeAction}
                                    value={action}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {config.balanceActions.map((item, index) => {
                                        if (item === "PAID_ITEM") {
                                            return <Option key={index} value={item}>Fulfilled</Option>
                                        }
                                        if (item === "CUSTOM_TRANSACTION") {
                                            return <Option key={index} value={"CUSTOM"}>{capitalize(item)}</Option>
                                        }
                                        return <Option key={index} value={item}>{capitalize(item)}</Option>
                                    })}

                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by status"
                                    onChange={this.onChangeStatus}
                                    value={status}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {config.balanceStatus.map((item, index) => {
                                        if (item === "DEBT") {
                                            return <Option key={index} value={item}>Upcoming amount</Option>
                                        }
                                        return <Option key={index} value={item}>{capitalize(item)}</Option>
                                    })}

                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Button
                                    style={{ width: '100%' }}
                                    icon={<FilterOutlined />}
                                    onClick={this.openMoreFilter}
                                >
                                    More filters
                                </Button>
                            </Col>
                        </Row>
                    </Input.Group>
                    <br />
                    <div style={{ marginBottom: '10px' }}>
                        {
                            status && (
                                <Tag closable onClose={() => this.onRemoveTag('status')} style={tagStyle}>
                                    {/* {`${status.charAt(0).toUpperCase() + status.slice(1)}`} */}
                                    {"Status is: " + capitalize(status)}
                                </Tag>
                            )
                        }
                        {
                            action && (
                                <Tag closable onClose={() => this.onRemoveTag('action')} style={tagStyle}>
                                    {/* {`${status.charAt(0).toUpperCase() + status.slice(1)}`} */}
                                    Action is: {action !== "PAID_ITEM" ? capitalize(action) : "Fulfilled"}
                                </Tag>
                            )
                        }
                        {
                            // seller && (
                            //     <Tag closable onClose={() => this.onRemoveTag('seller')} style={tagStyle}>
                            //         {/* {`${status.charAt(0).toUpperCase() + status.slice(1)}`} */}
                            //         {"Seller is: " + listSeller.sellers.find(x => x.id === seller).email}
                            //     </Tag>
                            // )
                            seller && (
                                <Tag closable onClose={() => this.onRemoveTag('seller')} style={tagStyle}>
                                    {`Seller is: ${listSeller.sellers.find(item => item.email === seller).firstName + "" + listSeller.sellers.find(item => item.email === seller).lastName}`}
                                </Tag>
                            )
                        }
                        {
                            site && (
                                <Tag closable onClose={() => this.onRemoveTag('site')} style={tagStyle}>
                                    {`Site: ${sites.find(item => item.id === site).title}`}
                                </Tag>
                            )
                        }
                        {
                            startDate && endDate && (
                                <Tag closable onClose={() => this.onRemoveTag('date')} style={tagStyle}>
                                    {/* {`${status.charAt(0).toUpperCase() + status.slice(1)}`} */}
                                    {`From ${new Date(startDate).toLocaleDateString('en-GB')} to ${new Date(endDate).toLocaleDateString('en-GB')} `}
                                </Tag>
                            )
                        }
                    </div>

                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: "ID",
                                dataIndex: "number",
                                key: "number",
                                render: text => "#" + text,
                                width: 80,
                                fixed: 'left'
                            },
                            {
                                title: "Seller",
                                dataIndex: "email",
                                key: "seller",
                                render: text => text,
                                width: 200,
                            },
                            {
                                title: "Amount",
                                dataIndex: "amount",
                                key: "amount",
                                render: (text, record) => {
                                    if (record.type === "CUSTOM_SUBTRACT") return <div style={{ color: "red" }}>{"-$" + parseFloat(text).toLocaleString('en-GB')}</div>
                                    return "$" + parseFloat(text).toLocaleString('en-GB')
                                },
                                width: 100
                            },
                            {
                                title: "Discount",
                                dataIndex: "discount",
                                key: "discount",
                                width: 100
                            },
                            {
                                title: "Transaction ID",
                                dataIndex: "transactionId",
                                key: "transactionId",
                                width: 120,
                                ellipsis: true
                            },
                            {
                                title: "Site",
                                dataIndex: "site",
                                key: "site",
                                render: text => text && text.virtual ? "Virtual site" :
                                    <a target='blank' href={(text || { url: "" }).url}>{(text || { title: "" }).title}</a>,
                                width: 100,
                                ellipsis: true
                            },
                            {
                                title: "Created by",
                                dataIndex: "createdBy",
                                key: "createdBy",
                                ellipsis: true,
                                width: 150
                            },
                            {
                                title: "Created Date",
                                dataIndex: "createdDate",
                                key: "createdDate",
                                render: text => new Date(text).toLocaleString('en-GB'),
                                width: 120
                            },
                            {
                                title: "Action",
                                dataIndex: "type",
                                key: "type",
                                render: text => {
                                    if (text === "PAID_ITEM") return "Fulfilled"
                                    if (text === "CUSTOM_ADD" || text === "CUSTOM_SUBTRACT") return "Custom transaction"
                                    return capitalize(text)
                                },
                                width: 100
                            },
                            {
                                title: "Note",
                                dataIndex: "note",
                                key: "note",
                                render: this.renderNote,
                                width: 150
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
                                ),
                                width: 150
                            },
                            {
                                key: "action",
                                render: (text, record) => (
                                    record.status === "PENDING" && <Space size="middle">
                                        {/* <Tooltip title='Approve'>
                                            <CheckCircleOutlined
                                                className={classnames('green', cls.icon)}
                                                onClick={() => this.approve(record.id)}
                                            />
                                        </Tooltip> */}
                                        <Popconfirm
                                            title="Are you sure to accept?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                                this.approve(record.id)
                                            }}
                                        >
                                            <CheckCircleOutlined className={classnames('green', cls.icon)} />
                                        </Popconfirm>
                                        {/* <Popconfirm
                                            title="Are you sure to reject?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                                this.reject(record.id)
                                            }}
                                        >

                                        </Popconfirm> */}
                                        <CloseCircleOutlined
                                            className={classnames('red', cls.icon)}
                                            onClick={() => this.setState({ openModalReject: true, record })}
                                        />
                                    </Space>

                                ),
                                width: 100,
                                fixed: 'right',
                            }
                        ]}
                        dataSource={balances}
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
                        scroll={{x: 1300}}
                    >

                    </Table>
                </Card>
                <UserFilterBalancesDrawer
                    capitalize={capitalize}
                    visible={openFilterDrawer}
                    onClose={this.onCloseFilterDrawer}
                    status={status}
                    action={action}
                    startDate={startDate}
                    endDate={endDate}
                    onChangeDate={this.onChangeDate}
                    onChangeAction={this.onChangeAction}
                    onChangeStatus={this.onChangeStatus}
                    onChangeSite={this.onChangeSite}
                    onChangeSeller={this.onChangeSeller}
                    refreshTable={this.refreshTable}
                    clearAllFilter={this.clearAllFilter}
                    clearActionFilter={this.clearActionFilter}
                    clearStatusFilter={this.clearStatusFilter}
                    listSeller={listSeller}
                    seller={seller}
                    sites={sites}
                    site={site}
                />
                <UserCustomTransactionDrawer
                    visible={openCustomTransactionDrawer}
                    onClose={this.onCloseCustomTransactionDrawer}
                    listSeller={listSeller}
                    customTransaction={customTransaction}
                    customTransactionLoading={customTransactionLoading}
                />
                <RejectModal
                    visible={openModalReject}
                    handleCancel={() => this.setState({ openModalReject: false, record: null })}
                    record={record}
                    reject={this.reject}
                    rejectLoading={rejectLoading}
                />
            </>
        )
    }
}
