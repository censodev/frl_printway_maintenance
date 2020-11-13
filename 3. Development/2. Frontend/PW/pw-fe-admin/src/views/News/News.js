import React, {Component} from 'react';
import {
    Tooltip,
    Card,
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Input,
    Row,
    Col,
    Modal,
    DatePicker,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './news.module.less';
import EditNewDrawer from "../../components/Drawer/EditNewsDrawer/EditNewsDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";
import ReactHtmlParser from 'react-html-parser';
import moment from "moment";

const key = 'deleteTransaction';
const {Search} = Input;
const {RangePicker} = DatePicker;

class News extends Component {

    state = {
        visible: false,
        content: '',
        title: '',
        newsData: null,
        openEditNewDrawer: false,
        pageSize: 10,
        currentPage: 0,
        keyword: '',
        sortedInfo: {
            order: 'descend',
            columnKey: 'createdDate',
        },
    };

    componentDidMount() {
        this.props.fetchAllNews(this.checkParam());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            deleteSuccess,
            deleteError
        } = this.props;

        if (
            nextProps.deleteSuccess === true
            && nextProps.deleteSuccess !== deleteSuccess
        ) {
            message.success({
                content: 'Success!', key, duration: 1.5, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.deleteError && nextProps.deleteError !== deleteError
        ) {
            message.error({content: CatchError[nextProps.deleteError] || nextProps.deleteError, key, duration: 2});
        }

    }


    showEditNewDrawer = (data) => {
        this.setState({
            openEditNewDrawer: true,
            newsData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            newsData: null,
            openEditNewDrawer: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteNew(id);
        }
    };

    debounceSearch = _.debounce(e => {
        this.setState({
            keyword: e.trim()
        }, () => {
            if (e.length !== 1) {
                this.onSubmit();
            }
        })
    }, 500);

    onChangeKeyWord = (e) => {
        this.debounceSearch(e.target.value);
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    };

    onSearch = (value) => {
        if (value) {
            this.onSubmit();
        }
    };

    checkParam = () => {
        const {
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            startDate,
            endDate
        } = this.state;

        const dataParams = {};

        if (startDate && endDate) {
            dataParams.startDate = startDate;
            dataParams.endDate = endDate;
        }


        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
        }

        dataParams.keyword = keyword;
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };

    handleTableChange = (pagination, filters, sorter) => {
        if (sorter.order === undefined && sorter.column === undefined) {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {columnKey: 'createdDate', order: 'descend'}
                }, () => {
                    this.props.fetchAllNews(this.checkParam());
                }
            );
        } else {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () =>
                    this.props.fetchAllNews(this.checkParam())
            );
        }
    };

    onSubmit = () => {

        this.setState({
            currentPage: 0
        }, () => {
            this.props.fetchAllNews(this.checkParam());
        });

    };

    onChangeDate = (dates) => {

        if (dates) {
            this.setState({
                startDate: `${dates[0].format('YYYY-MM-DDT00:00:00.000')}Z`,
                endDate: `${dates[1].format('YYYY-MM-DDT23:59:59.000')}Z`
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


    // handleToggle = (data) => {
    //     if (data.id) {
    //         message.loading({content: 'Loading...', key});
    //         // this.props.deleteNew(id);
    //     }
    // };

    render() {

        const {
            newsData,
            openEditNewDrawer,
            currentPage,
            pageSize,
            visible
        } = this.state;

        const {
            listNews,
            editNew,
            createNew,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess
        } = this.props;

        const {news, loading, totalElements} = listNews;

        return (

            <>
                <Card
                    title={<span><FileTextOutlined style={{marginRight: '5px'}}/> NEWS</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => this.setState({openEditNewDrawer: true})}
                        >
                            Send news
                        </Button>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={8} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search by title"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                />
                            </Col>
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
                        </Row>
                    </Input.Group>
                    <br/>
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: 'Title',
                                dataIndex: 'title',
                                key: 'title',
                                render: (text, record) => {
                                    return (
                                        <Tooltip overlay='Show full content'>
                                            <a onClick={() => {
                                                this.setState({
                                                    visible: true,
                                                    content: record.content,
                                                    title: record.title
                                                })
                                            }}
                                               style={record.type && record.type === 'URGENT_NOTE' ? {color: 'orange'} : {}}
                                            >
                                                {text}
                                            </a>
                                        </Tooltip>
                                    )
                                }
                            },
                            {
                                title: 'Type',
                                dataIndex: 'type',
                                key: 'type',
                                render: text => text === 'URGENT_NOTE' ? 'Urgent note' : 'News'
                            },
                            {
                                title: 'Content',
                                dataIndex: 'shortDescription',
                                key: 'shortDescription',
                                render: text => {
                                    return ReactHtmlParser(text || '')
                                }
                            },
                            {
                                title: 'Created date',
                                dataIndex: 'createdDate',
                                key: 'createdDate',
                                sorter: true,
                                render: text => new Date(text).toLocaleString('en-GB'),
                            },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => (
                                    <Space size="middle">
                                        <Tooltip title='Edit'>
                                            <EditOutlined className={classnames('blue', cls.icon)}
                                                          onClick={() => {
                                                              this.showEditNewDrawer(record);
                                                          }}/>
                                        </Tooltip>

                                        <Popconfirm
                                            title="Are you sure to delete？"
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.handleDelete(record.id)
                                            }}
                                        >
                                            <DeleteOutlined className={classnames('orange', cls.icon)}/>
                                        </Popconfirm>

                                    </Space>
                                )
                            },
                        ]}
                        dataSource={news}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} items`
                        }}
                        loading={loading}
                        onChange={this.handleTableChange}
                    />
                </Card>

                <EditNewDrawer
                    visible={openEditNewDrawer}
                    onClose={this.onCloseDrawer}
                    editNew={editNew}
                    createNew={createNew}
                    data={newsData}
                    editLoading={editLoading}
                    editSuccess={editSuccess}
                    editError={editError}
                    createError={createError}
                    createLoading={createLoading}
                    createSuccess={createSuccess}
                />

                <Modal
                    title={this.state.title}
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={
                        <Button onClick={this.handleCancel}>
                            Close
                        </Button>
                    }
                >
                    {ReactHtmlParser(this.state.content)}
                </Modal>

            </>
        );
    }
}

export default News;
