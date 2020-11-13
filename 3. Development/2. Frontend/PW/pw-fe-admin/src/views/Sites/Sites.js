import React, {Component} from 'react';
import {Card, Table, Space, Popconfirm, message, Input, Row, Col, Badge, Select, DatePicker} from 'antd';
import {
    // PlusOutlined,
    DeleteOutlined,
    // EditOutlined,
    GlobalOutlined,
    UnlockOutlined,
    LockOutlined
} from "@ant-design/icons";
// import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './sites.module.less';
// import EditSitesDrawer from "../../components/Drawer/EditSitesDrawer/EditSitesDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";
import moment from "moment";
import {isMobile} from "react-device-detect";

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;
const key = 'deleteTransaction';

class Sites extends Component {

    state = {
        // sitesData: null,
        // openEditSitesDrawer: false,
        startDate: undefined,
        endDate: undefined,
        status: undefined,
        seller: undefined,
        pageSize: 10,
        currentPage: 0,
        keyword: '',
        sortedInfo: {
            order: 'descend',
            columnKey: 'createdDate',
        },
    };

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            deleteSuccess,
            deleteError,
            activateSuccess,
            activateError
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

        if (
            nextProps.activateSuccess === true
            && nextProps.activateSuccess !== activateSuccess
        ) {
            message.success({
                content: 'Success!', key, duration: 1.5, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.activateError && nextProps.activateError !== activateError
        ) {
            message.error({content: CatchError[nextProps.activateError] || nextProps.activateError, key, duration: 2});
        }

    }


    componentDidMount() {
        const {listSeller, fetchAllSites, fetchAllSeller} = this.props;
        fetchAllSites(this.checkParam());
        if (listSeller.sellers.length === 0) {
            fetchAllSeller();
        }
    }

    onChangeStatus = (value) => {
        this.setState({
            status: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeSeller = (value) => {
        this.setState({
            seller: value
        }, () => {
            this.onSubmit();
        })
    };


    onChangeDate = (dates, dateStrings) => {
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

    handleActivate = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.activateSite(id);
        }
    };

    checkStatus = (data) => {
        let result = null;

        if (!data.sync && !data.active && !data.deleted) {
            result = <Badge
                status={'warning'}
                text={'Pending'}
            />
        } else if (data.sync && data.active && !data.deleted) {
            result = <Badge
                status={'success'}
                text={'Active'}
            />
        } else if (data.sync && !data.active && !data.deleted) {
            result = <Badge
                status={'warning'}
                text={'Inactive'}
            />
        } else if (data.sync && !data.active && data.deleted) {
            result = <Badge
                status={'error'}
                text={'Removed'}
            />
        }

        return result;
    };


    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteSite(id);
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
    }, 300);

    onChangeKeyWord = (e) => {
        this.debounceSearch(e.target.value);
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    };

    checkParam = () => {
        const {
            status,
            seller,
            currentPage,
            pageSize,
            sortedInfo,
            startDate,
            endDate,
            keyword
        } = this.state;

        const dataParams = {};

        if (status) {
            dataParams.status = status;
        }

        if (seller) {
            dataParams.seller = _.find(this.props.listSeller.sellers, {id: seller}) && _.find(this.props.listSeller.sellers, {id: seller}).email;
        }

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
                    this.props.fetchAllSites(this.checkParam());
                }
            );
        } else {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () => {
                    this.props.fetchAllSites(this.checkParam());
                }
            );
        }
    };

    onSearch = (value) => {
        if (value) {
            this.onSubmit();
        }
    };

    onSubmit = () => {

        this.setState({
            currentPage: 0
        }, () => {
            this.props.fetchAllSites(this.checkParam());
        });

    };

    render() {

        const {
            // levelsData,
            // openEditSitesDrawer,
            pageSize,
            currentPage,
            status,
            seller
        } = this.state;

        const {
            listSites,
            listSeller,
            // editSellerLevel,
            // createSellerLevel,
            // editLoading,
            // editSuccess,
            // editError,
            // createLoading,
            // createError,
            // createSuccess
        } = this.props;

        const {sites, loading, totalElements} = listSites;

        return (

            <>
                <Card
                    title={<span><GlobalOutlined style={{marginRight: '5px'}}/> SITES</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    // extra={
                    //     <Button
                    //         type="primary"
                    //         icon={<PlusOutlined/>}
                    //         size={isMobile ? 'small' : 'middle'}
                    //         onClick={() => this.setState({openEditSitesDrawer: true})}
                    //     >
                    //         Add new
                    //     </Button>
                    // }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={8} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search by name, platform"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            <Col md={5} xs={24}>
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
                            <Col md={4} xs={24}>
                                <Select
                                    allowClear
                                    style={{width: '100%'}}
                                    placeholder="Filter by status"
                                    onChange={this.onChangeStatus}
                                    value={status}
                                >
                                    <Option value="ACTIVE">Active</Option>
                                    <Option value="IN_ACTIVE">Inactivate</Option>
                                    <Option value="REMOVE">Removed</Option>
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: '100%'}}
                                    placeholder="Filter by seller"
                                    onChange={this.onChangeSeller}
                                    value={seller}
                                >
                                    {
                                        listSeller.sellers.map(value => (
                                            <Option key={value.id}
                                                    value={value.id}>{`${value.lastName || ''} ${value.firstName || ''}`}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </Input.Group>
                    <br/>
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'title',
                                key: 'title',
                            },
                            {
                                title: 'Url',
                                dataIndex: 'url',
                                key: 'url',
                                render: (text, record) => !record.virtual ?
                                    <a href={text} target='_blank'>{text}</a> : ''
                            },
                            {
                                title: 'Platform',
                                dataIndex: 'siteType',
                                key: 'siteType',
                            },
                            {
                                title: 'Seller',
                                dataIndex: 'fullName',
                                key: 'fullName',
                            },
                            {
                                title: 'Connected date',
                                dataIndex: 'connectDate',
                                key: 'connectDate',
                                sorter: true,
                                render: text => text ? new Date(text).toLocaleString('en-GB') : '-',
                            },
                            {
                                title: (status === 'REMOVE' || status === undefined) ? 'Deleted date' : '',
                                dataIndex: 'deletedDate',
                                key: 'deletedDate',
                                sorter: (status === 'REMOVE' || status === undefined),
                                render: (status === 'REMOVE' || status === undefined) ? text => text ? new Date(text).toLocaleString('en-GB') : '-' : '',
                            },
                            {
                                title: 'Status',
                                dataIndex: 'active',
                                key: 'active',
                                render: (text, record) => {
                                    return this.checkStatus(record)
                                },
                            },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => (
                                    !record.deleted ? <Space size="middle">

                                        <Popconfirm
                                            title={`Are you sure to ${(record.sync && !record.active && !record.deleted) ? 'Activate' : (record.sync && record.active && !record.deleted) ? 'Deactivate' : '-'} this site？`}
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.handleActivate(record.id)
                                            }}
                                        >
                                            {
                                                (record.sync && !record.active && !record.deleted) ?
                                                    <UnlockOutlined className={classnames('green', cls.icon)}/> :
                                                    (record.sync && record.active && !record.deleted) ?
                                                        <LockOutlined className={classnames('red', cls.icon)}/> : ''
                                            }
                                        </Popconfirm>

                                        <Popconfirm
                                            title="Are you sure to delete this Site？"
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.handleDelete(record.id)
                                            }}
                                        >
                                            <DeleteOutlined className={classnames('orange', cls.icon)}/>
                                        </Popconfirm>

                                    </Space> : ''
                                )
                            },
                        ]}
                        dataSource={sites}
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

                {/*<EditSitesDrawer*/}
                {/*    visible={openEditSitesDrawer}*/}
                {/*    onClose={this.onCloseDrawer}*/}
                {/*    editSellerLevel={editSellerLevel}*/}
                {/*    createSellerLevel={createSellerLevel}*/}
                {/*    data={levelsData}*/}
                {/*    editLoading={editLoading}*/}
                {/*    editSuccess={editSuccess}*/}
                {/*    editError={editError}*/}
                {/*    createError={createError}*/}
                {/*    createLoading={createLoading}*/}
                {/*    createSuccess={createSuccess}*/}
                {/*/>*/}

            </>
        );
    }
}

export default Sites;
