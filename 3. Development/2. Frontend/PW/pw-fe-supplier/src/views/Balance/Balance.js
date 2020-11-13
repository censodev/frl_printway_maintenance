import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Table, Tooltip, Badge, message } from 'antd';
import { WalletOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import * as config from '../../config/project.config';
import MakeDepositDrawer from '../../components/Drawer/MakeDepositDrawer/MakeDepositDrawer';
import cls from "./balance.module.less";


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

const key = "balance";

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

export default class Balance extends Component {
    state = {
        pageSize: 10,
        totalElements: 0,
        currentPage: 0,
        keyword: "",
        openFilterDrawer: false,
        openMakeDepositDrawer: false,
        actionStatus: undefined,
        depositEdit: {},
        status: "",
        action: "",
        startDate: null,
        endDate: null
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
            endDate
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
            dataParams.startDate = startDate;
            dataParams.endDate = endDate;
        }
        dataParams.page = currentPage;
        dataParams.size = pageSize;
        return dataParams;
    };
    componentDidMount() {
        this.props.fetchOverview();
        this.props.fetchAllBalances(this.checkParam());
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { deleteSuccess, deleteError } = this.props;
        if (nextProps.deleteSuccess && nextProps.deleteSuccess !== deleteSuccess) {
            message.success({
                content: "Success",
                duration: 1.5,
                key,
                onClose: this.onSubmit
            })
        }
        if (nextProps.deleteError && nextProps.deleteError !== deleteError) {
            message.error({
                content: nextProps.deleteError,
                duration: 1.5,
                key,
                onClose: this.onSubmit
            })
        }
    }
    onSubmit = () => {
        this.setState({ currentPage: 0 }, () => this.props.fetchAllBalances(this.checkParam()));
    }
    // search click event
    onSearch = () => {
        this.onSubmit();
    }
    debounceSearch = _.debounce(e => {
        this.setState({
            keyword: e.trim()
        }, () => {
            if (e.length !== 1) {
                this.onSubmit();
            }
        })
    }, 300);
    // change key word search
    onChangeKeyWord = e => {
        this.debounceSearch(e.target.value);
    }
    // // onchange filter action
    // onChangeAction = e => {
    //     this.setState({ action: e }, this.onSubmit)
    // }
    // onchange fiter status
    onChangeStatus = e => {
        this.setState({
            status: e
        }, this.onSubmit)
    }
    // onChangeDate
    onChangeDate = dates => {
        if (dates) {
            // this.setState({
            //     startDate: date[0].toISOString(),
            //     endDate: date[1].toISOString(),
            // }, this.refreshTable)
            this.setState({
                startDate: `${dates[0].format('YYYY-MM-DDT00:00:00.000')}Z`,
                endDate: `${dates[1].format('YYYY-MM-DDT23:59:59.000')}Z`
            }, this.onSubmit)

        }
        else {
            this.setState({
                startDate: null,
                endDate: null,
            }, this.onSubmit)
        }
    }
    // change pagesize tabel
    onShowSizeChange = (current, pageSize) => {
        this.setState({ pageSize }, this.onSubmit)
    }

    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
            currentPage: pagination.current - 1
        }, () => this.props.doFetchAllBalances(this.checkParam()))

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
    renderNote = (text, record) => {
        if (record.type === "PAID_ITEM") {
            const arrText = text.split(" - Line item:");
            const order = arrText[0].substr(14);
            const lineItem = arrText[1];
            return (
                <div>
                    <div><span style={{fontWeight: "bold"}}>Order:</span> {order}</div>
                    <div><span style={{fontWeight: "bold"}}>LineItem: </span>{lineItem}</div>
                </div>
            )
        }
        return text
    }

    render() {
        const {
            currentPage,
            pageSize,
            openMakeDepositDrawer,
            depositEdit,
        } = this.state;
        const { listBalances,
            overview,
            doCreateDeposit,
            createDeposit,
            createDepositError,
            createDepositSuccess,
            doUpdateDeposit,
            updateDeposit,
            updateDepositSuccess,
            updateDepositError
        } = this.props;
        const { balances, loading, totalElements } = listBalances;
        const { data } = overview;
        return (
            <>
                <Card
                    title={<span><WalletOutlined style={{ marginRight: '5px' }} /> BALANCE OVERVIEW</span>}
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
                    // extra={
                    //     <>
                    //         <Button
                    //             type="primary"
                    //             size={isMobile ? 'small' : 'middle'}
                    //             onClick={this.openMakeDepositDrawer}
                    //         >
                    //             Make a deposit
                    //         </Button>
                    //     </>
                    // }
                    loading={overview.loading}
                >
                    <Row gutter={24} type={'flex'}>
                        {/* <Col {...topColResponsiveProps}>
                            <CardItem className={cls.green} title='AVAILABLE AMOUNT'
                                content={`$${_.get(data, 'availableAmount', 0).toLocaleString()}`}
                                tooltip='Available amount' />
                        </Col> */}
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.red} title='UPCOMING AMOUNT'
                                content={`$${parseFloat(_.get(data, 'upcomingAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Upcoming Amount' />
                        </Col>
                        <Col {...topColResponsiveProps}>
                            <CardItem className={cls.black} title='PAID AMOUNT'
                                content={`$${parseFloat(_.get(data, 'paidAmount', 0)).toLocaleString('en-GB')}`}
                                tooltip='Paid Amount' />
                        </Col>
                        {/* <Col {...topColResponsiveProps}>
                            <CardItem className={cls.orange} title='PENDING DEPOSIT'
                                content={`$${_.get(data, 'pendingAmount', 0).toLocaleString()}`}
                                tooltip='Pending Deposit' />
                        </Col> */}

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
                                    placeholder="Search transaction ID or created by"
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
                                    // value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
                                />
                            </Col>
                            {/* <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by action"
                                    onChange={this.onChangeAction}
                                >
                                    {config.balanceActions.map((item, index) => (
                                        <Option key={index} value={item}>{capitalize(item)}</Option>
                                    ))}
                                </Select>
                            </Col> */}
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
                                    {config.balanceStatus.map((item, index) => {
                                        if (item === "DEBT") {
                                            return <Option key={index} value={item}>Upcoming amount</Option>
                                        }
                                        return <Option key={index} value={item}>{capitalize(item)}</Option>
                                    })}
                                </Select>
                            </Col>
                            {/* <Col md={4} xs={24}>
                                <Button
                                    style={{ width: '100%' }}
                                    icon={<FilterOutlined />}
                                    onClick={this.openMoreFilter}
                                >
                                    More filters
                                </Button>
                            </Col> */}
                        </Row>
                    </Input.Group>
                    <br />
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: "Id",
                                dataIndex: "number",
                                key: "number",
                                render: text => "#" + text
                            },
                            {
                                title: "Amount",
                                dataIndex: "amount",
                                key: "amount",
                                render: text => parseFloat(text).toLocaleString('en-GB')

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
                                ),
                                width: 150
                            },
                            {
                                title: "Note",
                                dataIndex: "note",
                                key: "note",
                                render: this.renderNote,
                                width: 200
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
                    >

                    </Table>
                </Card>
                <MakeDepositDrawer
                    visible={openMakeDepositDrawer}
                    onClose={this.closeMakeDepositDrawer}
                    doCreateDeposit={doCreateDeposit}
                    createDeposit={createDeposit}
                    createDepositError={createDepositError}
                    createDepositSuccess={createDepositSuccess}
                    onSubmit={this.onSubmit}
                    data={depositEdit}
                    doUpdateDeposit={doUpdateDeposit}
                    updateDeposit={updateDeposit}
                    updateDepositSuccess={updateDepositSuccess}
                    updateDepositError={updateDepositError}
                />
            </>
        )
    }
}
