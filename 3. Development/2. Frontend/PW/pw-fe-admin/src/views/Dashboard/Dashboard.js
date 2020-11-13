import React, {Component} from 'react'
import {
    Card,
    Input,
    Row,
    Col,
    Select,
    DatePicker,
    Tooltip,
    Alert,
    Divider,
} from 'antd';
import {
    WalletOutlined,
    DollarOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {isMobile} from 'react-device-detect';
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import {Line} from 'react-chartjs-2';
import cls from "./dashboard.module.less";
import DoughnutChart from "./DoughnutChart";
import Status from "./Status";
import ReactHtmlParser from "react-html-parser";
import checkSiteStatus from "../../core/util/checkSiteStatus";

const {Option} = Select;
const {RangePicker} = DatePicker;
const lineOptions = {
    title: {
        display: false,
        // text: 'Total Orders',
        // fontSize: 23,
        // fontFamily: 'Source Sans Pro, Helvetica Neue, Arial, sans-serif',
    },
    legend: {
        display: true,
        position: 'bottom',
        labels: {
            boxWidth: 7,
            usePointStyle: true
        }
    },
    tooltips: {
        callbacks: {
            label(tooltipItem, data) {
                return `${data.datasets[tooltipItem.datasetIndex].label}: ${parseFloat(tooltipItem.yLabel).toLocaleString('en-GB')} `;
            },
        },
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                userCallback(value) {
                    return parseFloat(value).toLocaleString('en-GB');
                },
            },
        }],
        xAxes: [{
            ticks: {},
        }],
    },
};

const Item = ({title, content, footer, tooltip, hasCurrency, className}) => {
    return (
        <Card title={title}
              extra={tooltip ? <Tooltip
                  title={tooltip}
              >
                  <InfoCircleOutlined/>
              </Tooltip> : false}
              bordered={false}
              loading={false}
              headStyle={{
                  border: 'none',
                  padding: '0 10px',
              }}
              bodyStyle={{
                  padding: '0 10px',
              }}
              style={{
                  borderRadius: '0',
                  borderRight: '1px solid #f0f0f0',
              }}
        >
            <span className={classnames(cls.text, className)}>
                {content}
            </span>
            <Divider style={{margin: '15px 0'}}/>
            <span style={{fontSize: '14px'}}>
                New today: <a style={{cursor: 'default'}}>{hasCurrency && '$'}{parseFloat(footer).toLocaleString('en-GB')}</a>
            </span>
        </Card>
    )
};

export default class Dashboard extends Component {
    state = {
        sellerId: null,
        siteId: null,
        startDate: null,
        endDate: null,
    };

    componentDidMount() {
        const {listSeller, fetchAllSeller, listSitesNoPaging, fetchAllSitesNoPaging, fetchStatus, fetchTopProduct, fetchTopProductType, fetchStatistic, fetchUrgentNote} = this.props;
        fetchStatus();
        fetchTopProduct(this.checkParam());
        fetchTopProductType(this.checkParam());
        fetchStatistic(this.checkParam());
        fetchUrgentNote();
        if (listSeller.sellers.length === 0) {
            fetchAllSeller();
        }

        if (listSitesNoPaging.sites.length === 0) {
            fetchAllSitesNoPaging();
        }
    }


    onChangeDate = (dates, dateStrings) => {
        if (dates) {
            this.setState({
                startDate: dates[0],
                endDate: dates[1],
            }, () => {
                this.onSubmit();
            });
        } else {
            this.setState({
                startDate: undefined,
                endDate: undefined
            }, () => {
                this.onSubmit();
            })
        }
    };

    onChangeSite = (value) => {
        this.setState({
            siteId: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeSeller = (value) => {
        this.setState({
            sellerId: value
        }, () => {
            this.onSubmit();
        })
    };

    onSubmit = () => {
        this.props.fetchTopProduct(this.checkParam());
        this.props.fetchTopProductType(this.checkParam());
        this.props.fetchStatistic(this.checkParam());
    };

    checkParam = () => {
        const {
            siteId,
            sellerId,
            startDate,
            endDate,
        } = this.state;

        const dataParams = {};

        if (siteId) {
            dataParams.site = siteId;
        }
        if (sellerId) {
            dataParams.seller = sellerId;
        }
        if (startDate && endDate) {
            dataParams.startDate = `${startDate.format('YYYY-MM-DDT00:00:00.000')}Z`;
            dataParams.endDate = `${endDate.format('YYYY-MM-DDT23:59:59.000')}Z`;
        }
        return dataParams;
    };


    render() {
        const {listStatistic, listSeller, listSitesNoPaging, listStatus, topProduct, topProductType, urgentNote} = this.props;
        const {statistics} = listStatistic;
        let labelLineChart = _.get(statistics, 'revenueProfitChart', []).sort(function(a, b) { return new Date(a.date) - new Date(b.date) }).map(data => new Date(data.date).toLocaleDateString('en-GB'));
        let profitValue = _.get(statistics, 'revenueProfitChart', []).sort(function(a, b) { return new Date(a.date) - new Date(b.date) }).map(data => data.profit);
        let revenueValue = _.get(statistics, 'revenueProfitChart', []).sort(function(a, b) { return new Date(a.date) - new Date(b.date) }).map(data => data.revenue);
        let dataLineChart = {
            labels: labelLineChart,
            datasets: [
                {
                    label: 'Revenue',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#fff',
                    pointBackgroundColor: '#1890ff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: revenueValue,
                },
                {
                    label: 'Profit',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#2fc25b',
                    borderColor: '#2fc25b',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#fff',
                    pointBackgroundColor: '#2fc25b',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: profitValue,
                },
            ]
        };

        let sellerOptions = listSeller.sellers.map(data => (
            <Option key={data.id} value={data.email}>
                {data.fullName || ''}
            </Option>
        ));

        let siteOptions = listSitesNoPaging.sites.filter((site)=>{
            return this.state.sellerId ? site.email === this.state.sellerId : site;
        }).map(value => (
            <Option key={value.id} value={value.id}>
                {`${value.title} ${checkSiteStatus(value)}`}
            </Option>
        ));

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
                            <br/>
                        </>
                    )
                }
                <Input.Group>
                    <Row gutter={24}>
                        <Col md={6} xs={24}>
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
                                style={{width: '100%'}}
                            />
                        </Col>
                        <Col md={5} xs={24}>
                            <Select
                                showSearch
                                allowClear
                                style={{width: '100%'}}
                                placeholder="All sellers"
                                onChange={this.onChangeSeller}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    sellerOptions
                                }
                            </Select>
                        </Col>
                        <Col md={5} xs={24}>
                            <Select
                                showSearch
                                allowClear
                                style={{width: '100%'}}
                                placeholder="All sites"
                                onChange={this.onChangeSite}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    siteOptions
                                }
                            </Select>
                        </Col>
                    </Row>
                </Input.Group>
                <br/>
                <Card
                    title={<span><WalletOutlined style={{marginRight: '5px'}}/> BALANCE OVERVIEW</span>}
                    headStyle={{fontFamily: 'Poppins-Medium'}}
                    bodyStyle={{
                        paddingBottom: '12px'
                    }}
                    loading={listStatistic.loading}
                >
                    <div className={cls.box}>
                        <div>
                            <Item
                                className={classnames('blue', cls.text)}
                                title={<span><ShoppingCartOutlined/> Order</span>}
                                content={`${parseFloat(_.get(statistics, 'totalOrder', 0)).toLocaleString('en-GB')}`}
                                tooltip='Total Order'
                                footer={_.get(statistics, 'todayTotalOrders', 0)}
                            />
                        </div>
                        <div>
                            <Item
                                className={classnames('blue', cls.text)}
                                title={<span><UserOutlined/> Seller</span>}
                                content={`${parseFloat(_.get(statistics, 'totalSeller', 0)).toLocaleString('en-GB')}`}
                                tooltip='Total Seller'
                                footer={_.get(statistics, 'todayTotalSeller', 0)}
                            />
                        </div>
                        <div>
                            <Item
                                className={classnames('blue', cls.text)}
                                title={<span><DollarOutlined/> Supplier cost</span>}
                                content={`$${Math.abs(_.get(statistics, 'totalRevenue', 0) - _.get(statistics, 'totalProfit', 0)).toLocaleString('en-GB')}`}
                                hasCurrency
                                tooltip='Supplier Cost = SUM OF [Supplier cost*Line item Quantity]'
                                footer={Math.abs(_.get(statistics, 'todayTotalRevenue', 0) - _.get(statistics, 'todayTotalProfit', 0))}
                            />
                        </div>
                        <div>
                            <Item
                                className={classnames('orange', cls.text)}
                                title={<span><DollarOutlined/> Revenue</span>}
                                content={`$${parseFloat(_.get(statistics, 'totalRevenue', 0)).toLocaleString('en-GB')}`}
                                hasCurrency
                                tooltip='Revenue =SUM OF [(Base cost - Discount + Extra Shipping Fee) * Line Item Quantity]'
                                footer={_.get(statistics, 'todayTotalRevenue', 0)}
                            />
                        </div>
                        <div>
                            <Item
                                className={classnames('green', cls.text)}
                                title={<span><DollarOutlined/> Profit</span>}
                                content={`$${parseFloat(_.get(statistics, 'totalProfit', 0)).toLocaleString('en-GB')}`}
                                hasCurrency
                                tooltip='Profit = Revenue - Supplier cost'
                                footer={_.get(statistics, 'todayTotalProfit', 0)}
                            />
                        </div>
                        <div>
                            <Item
                                className={classnames('blue', cls.text)}
                                title={<span><DollarOutlined/> Total CusTom Transaction</span>}
                                content={`$${parseFloat(_.get(statistics, 'totalCustomBalance', 0)).toLocaleString('en-GB')}`}
                                hasCurrency
                                tooltip='SUM OF [Custom transaction]'
                                footer={_.get(statistics, 'todayCustomBalance', 0)}
                            />
                        </div>
                    </div>
                </Card>
                <br/>
                <Card
                    title={'Revenue/Profit'}
                    headStyle={{fontFamily: 'Poppins-Medium'}}
                    bodyStyle={{
                        //paddingBottom: '12px',
                    }}
                    extra={<Tooltip
                        title={'Revenue/Profit'}
                    >
                        <InfoCircleOutlined/>
                    </Tooltip>}
                    // loading={userBalance.loading}
                >
                    <Line data={dataLineChart} height={90} options={lineOptions}/>
                </Card>
                <br/>
                <DoughnutChart topProduct={topProduct} topProductType={topProductType}/>
                <br/>
                <Status listStatus={listStatus}/>
            </>
        )
    }
}
