import React, {Component} from 'react';
import {
    Row,
    Col,
    Tooltip,
    Card,
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Tag,
    Badge,
    Input,
    Select,
    DatePicker
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    UserOutlined,
    LockOutlined,
    UnlockOutlined,
    FilterOutlined,
    UploadOutlined, InfoCircleOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import * as _ from 'lodash';
import classnames from 'classnames';
import cls from './users.module.less';
import EditUserDrawer from "../../components/Drawer/EditUserDrawer/EditUserDrawer";
import FilterUserDrawer from "../../components/Drawer/FilterUserDrawer/FilterUserDrawer";
import CatchError from '../../core/util/CatchError';
import getTagColorByRole from "../../core/util/getTagColorByRole";
import configs from '../../config/project.config';
import capitalizeRole from "../../core/util/capitalizeRole";
import moment from "moment";

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;
const key = 'deleteTransaction';

const tagStyle = {
    marginBottom: '15px',
    fontSize: '13px',
    padding: '2px 8px',
    borderStyle: 'dashed',
};

class Users extends Component {

    state = {
        pageSize: 10,
        currentPage: 0,
        userData: null,
        openEditUserDrawer: false,
        openFilterUserDrawer: false,
        status: undefined,
        roles: [],
        levels: [],
        nextLevel: undefined,
        startDate: undefined,
        endDate: undefined,
        fromSaleAmount: '',
        toSaleAmount: '',
        sortedInfo: {
            order: 'descend',
            columnKey: 'createdDate',
        },
        keyword: '',

    };


    componentDidMount() {

        this.props.fetchAllSellerLevelsNoPaging();

        this.props.fetchAllUsers(this.checkParam());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            lockSuccess,
            lockError,
            exportError,

        } = this.props;

        if (
            nextProps.lockSuccess === true
            && nextProps.lockSuccess !== lockSuccess
        ) {
            message.success({
                content: 'Success!', key, duration: 1.5, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.lockError && nextProps.lockError !== lockError
        ) {
            message.error({content: CatchError[nextProps.lockError] || nextProps.lockError, key, duration: 2});
        }

        if (
            nextProps.exportError && nextProps.exportError !== exportError
        ) {
            message.error({content: CatchError[nextProps.exportError] || nextProps.exportError, key, duration: 2});
        }

    }


    showEditUserDrawer = (data) => {
        this.setState({
            openEditUserDrawer: true,
            userData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            userData: null,
            openEditUserDrawer: false,
            openFilterUserDrawer: false
        });
    };


    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    };


    handleLock = (data) => {
        message.loading({content: 'Loading...', key});
        this.props.lockUser({
            activated: !data.activated,
            email: data.email
        });
    };

    onChangeStatus = (value) => {
        this.setState({
            status: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeRole = (value) => {
        this.setState({
            roles: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeLevel = (value) => {
        this.setState({
            levels: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeNextLevel = (value) => {
        this.setState({
            nextLevel: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeSaleRange = (key, value) => {

        if (key) {
            this.setState({
                [key]: value,
            })
        } else {
            this.setState({
                fromSaleAmount: '',
                toSaleAmount: ''
            });
            this.onSubmit();
        }

    };

    onChangeDate = (dates) => {
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

    onClear = () => {
        this.setState({
            status: undefined,
            roles: [],
            levels: [],
            nextLevel: undefined,
            fromSaleAmount: '',
            toSaleAmount: ''
        }, () => {
            this.onSubmit();
        })
    };

    onRemoveTag = (key) => {
        switch (key) {
            case 'status':
                return this.onChangeStatus(undefined);
            case 'roles':
                return this.onChangeRole([]);
            case 'levels':
                return this.onChangeLevel([]);
            case 'nextLevel':
                return this.onChangeNextLevel(undefined);
            case 'saleRange':
                return this.onChangeSaleRange(null, null);
            case 'dates':
                return this.onChangeDate(null, null);
            default:
                break;
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

    checkParam = () => {
        const {
            status,
            roles,
            levels,
            nextLevel,
            fromSaleAmount,
            toSaleAmount,
            currentPage,
            startDate,
            endDate,
            pageSize,
            sortedInfo,
            keyword
        } = this.state;

        const dataParams = {};

        if (status) {
            dataParams.activated = status === 'active';
        }

        if (roles && roles.length > 0) {
            dataParams.roles = roles.join();
        }

        if (levels && levels.length) {
            dataParams.sellerLevelIds = levels.join();
        }

        if (nextLevel) {
            dataParams.nextLevelFilter = nextLevel;
        }

        if (startDate && endDate) {
            dataParams.startDate = `${startDate.format('YYYY-MM-DDT00:00:00.000')}Z`;
            dataParams.endDate = `${endDate.format('YYYY-MM-DDT23:59:59.000')}Z`;
        }

        if (fromSaleAmount) {
            dataParams.fromSaleAmount = fromSaleAmount;
        }

        if (toSaleAmount) {
            dataParams.toSaleAmount = toSaleAmount;
        }

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
        }

        dataParams.keyword = keyword;
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };

    onExport = () => {
        this.props.exportUsers(this.checkParam());
    };


    handleTableChange = (pagination, filters, sorter) => {

        // console.log(pagination, filters, sorter);
        if (sorter.order === undefined && sorter.column === undefined) {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {columnKey: 'createdDate', order: 'descend'}
                }, () => {
                    this.props.fetchAllUsers(this.checkParam());
                }
            );
        } else {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () => {
                    this.props.fetchAllUsers(this.checkParam());
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
            this.props.fetchAllUsers(this.checkParam());
        });

    };


    render() {

        const {
            userData,
            openEditUserDrawer,
            openFilterUserDrawer,
            status,
            roles,
            levels,
            nextLevel,
            pageSize,
            currentPage,
            fromSaleAmount,
            toSaleAmount,
            startDate,
            endDate,
        } = this.state;

        const {
            listUsers,
            listLevelsNoPaging,
            editUser,
            createUser,
            fetchAllSellerLevelsNoPaging,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess,
            exportLoading
        }
            = this.props;

        const {users, loading, totalElements} = listUsers;

        const mapLevel = [];
        for (let i = 0; i < levels.length; i++) {
            for (let j = 0; j < listLevelsNoPaging.levels.length; j++) {
                if (levels[i] === listLevelsNoPaging.levels[j].id) {
                    mapLevel.push(`${listLevelsNoPaging.levels[j].name}`)
                }
            }
        }

        return (

            <>
                <Card
                    title={<span><UserOutlined style={{marginRight: '5px'}}/> USERS MANAGEMENT</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Space>
                            <Button
                                type="link"
                                icon={<UploadOutlined/>}
                                size={isMobile ? 'small' : 'middle'}
                                onClick={this.onExport}
                                loading={exportLoading}
                            >
                                Export
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                size={isMobile ? 'small' : 'middle'}
                                onClick={() => this.setState({openEditUserDrawer: true})}
                            >
                                Create new user
                            </Button>
                        </Space>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={4} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search by name, mail, phone"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                    suffix={
                                        <Tooltip title="Search by name, mail, phone">
                                            <InfoCircleOutlined style={{color: 'rgba(0,0,0,.45)'}}/>
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
                                    style={{width: '100%'}}
                                    value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
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
                                    <Option value="active">Active</Option>
                                    <Option value="deactivate">Inactivate</Option>
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
                                    placeholder="Filter by roles"
                                    mode="multiple"
                                    onChange={this.onChangeRole}
                                    value={roles}
                                >
                                    {
                                        configs.roles.map(value =>
                                            <Option
                                                key={value}
                                                value={value}
                                            >
                                                {capitalizeRole(value)}
                                            </Option>)
                                    }
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    placeholder="Filter by level"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: '100%'}}
                                    loading={listLevelsNoPaging.loading}
                                    mode="multiple"
                                    onChange={this.onChangeLevel}
                                    value={levels}
                                >
                                    {
                                        listLevelsNoPaging.levels && listLevelsNoPaging.levels.map(value => (
                                            <Option key={value.id || ''}
                                                    value={value.id || ''}
                                            >
                                                {value.name || ''}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col md={4} xs={12}>
                                <Button
                                    style={{width: '100%'}}
                                    icon={<FilterOutlined/>}
                                    onClick={() => this.setState({openFilterUserDrawer: true})}
                                >
                                    More filters
                                </Button>
                            </Col>
                        </Row>
                    </Input.Group>
                    <br/>
                    <div style={{marginBottom: '10px'}}>
                        {
                            status && (
                                <Tag closable onClose={() => this.onRemoveTag('status')} style={tagStyle}>
                                    {`${status.charAt(0).toUpperCase() + status.slice(1)} Users`}
                                </Tag>
                            )
                        }
                        {
                            startDate && endDate && (
                                <Tag closable onClose={() => this.onRemoveTag('dates')} style={tagStyle}>
                                    {`From ${new Date(startDate).toLocaleDateString('en-GB')} to ${new Date(endDate).toLocaleDateString('en-GB')}`}
                                </Tag>
                            )
                        }
                        {
                            roles.length > 0 && (
                                <Tag closable onClose={() => this.onRemoveTag('roles')} style={tagStyle}>
                                    {
                                        `Role is 
                                        ${
                                            roles.map(value => capitalizeRole(value))
                                            }`
                                    }
                                </Tag>
                            )
                        }
                        {
                            levels.length > 0 && (
                                <Tag closable onClose={() => this.onRemoveTag('levels')} style={tagStyle}>
                                    {`Level is ${mapLevel}`}
                                </Tag>
                            )
                        }
                        {
                            toSaleAmount !== 0 && toSaleAmount !== '' && (
                                <Tag closable onClose={() => this.onRemoveTag('saleRange')} style={tagStyle}>
                                    {`Sale range from ${fromSaleAmount} to ${toSaleAmount}`}
                                </Tag>
                            )
                        }
                        {
                            nextLevel && (
                                <Tag closable onClose={() => this.onRemoveTag('nextLevel')} style={tagStyle}>
                                    {`Filter by users prepare to the next level is ${
                                        _.find(listLevelsNoPaging.levels, {id: nextLevel})
                                            ? _.find(listLevelsNoPaging.levels, {id: nextLevel}).name
                                            : ''
                                        }`}
                                </Tag>
                            )
                        }
                    </div>
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'activated',
                                key: 'activated',
                                sorter: true,
                                render: (text, record) => <Badge
                                    status={text ? 'success' : 'warning'}
                                    text={`${record.firstName} ${record.lastName}`}
                                />
                            },
                            {
                                title: 'Email',
                                dataIndex: 'email',
                                key: 'email',
                                ellipsis: !isMobile,
                            },
                            {
                                title: 'Phone',
                                dataIndex: 'phone',
                                key: 'phone',
                                // sorter: (a, b) => a.phone - b.phone,
                            },
                            {
                                title: 'Address',
                                dataIndex: 'address',
                                key: 'address',
                                ellipsis: !isMobile,
                            },
                            {
                                title: 'Created Date',
                                dataIndex: 'createdDate',
                                key: 'createdDate',
                                sorter: true,
                                render: (text) => new Date(text).toLocaleString('en-GB') || '',
                            },
                            {
                                title: 'Total Order',
                                dataIndex: 'totalOrder',
                                key: 'totalOrder',
                                render: (text) => parseFloat(text).toLocaleString('en-GB'),
                                sorter: true,
                            },
                            {
                                title: 'Sale amount',
                                dataIndex: 'saleAmount',
                                key: 'saleAmount',
                                render: (text) => parseFloat(text).toLocaleString('en-GB'),
                                sorter: true,
                            },
                            {
                                title: 'Level',
                                dataIndex: 'sellerLevel',
                                key: 'sellerLevel',
                                render: (record) => (record ? record.name : ''),
                            },
                            {
                                title: 'Roles',
                                dataIndex: 'roles',
                                key: 'roles',
                                render: (text => (
                                    text.map(value => (
                                        <Tag
                                            key={value}
                                            color={getTagColorByRole(value)}
                                        >
                                            {capitalizeRole(value)}
                                        </Tag>
                                    ))
                                ))
                            },
                            // {
                            //     title: 'Status',
                            //     dataIndex: 'activated',
                            //     key: 'activated',
                            //     render: text => {
                            //         return <Badge
                            //             status={text ? 'success' : 'warning'}
                            //             text={text ? 'Active' : 'Deactivate'}
                            //         />
                            //     },
                            // },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => (
                                    <Space size="middle">
                                        <Tooltip title='Edit'>
                                            <EditOutlined className={classnames('blue', cls.icon)}
                                                          onClick={() => {
                                                              this.showEditUserDrawer(record);
                                                          }}/>
                                        </Tooltip>

                                        <Popconfirm
                                            title={`Are you sure to ${!record.activated ? 'Unlock' : 'Lock'} this user？`}
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.handleLock(record)
                                            }}
                                        >
                                            {
                                                !record.activated ?
                                                    <UnlockOutlined className={classnames('green', cls.icon)}/> :
                                                    <LockOutlined className={classnames('red', cls.icon)}/>
                                            }
                                        </Popconfirm>

                                    </Space>
                                )
                            },
                        ]}
                        dataSource={users}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} users`
                        }}
                        loading={loading}
                        showSizeChanger
                        onChange={this.handleTableChange}
                    />
                </Card>

                <EditUserDrawer
                    visible={openEditUserDrawer}
                    listLevelsNoPaging={listLevelsNoPaging}
                    onClose={this.onCloseDrawer}
                    editUser={editUser}
                    createUser={createUser}
                    fetchAllSellerLevelsNoPaging={fetchAllSellerLevelsNoPaging}
                    data={userData}
                    editLoading={editLoading}
                    editSuccess={editSuccess}
                    editError={editError}
                    createError={createError}
                    createLoading={createLoading}
                    createSuccess={createSuccess}
                />

                <FilterUserDrawer
                    visible={openFilterUserDrawer}
                    onClose={this.onCloseDrawer}
                    onChangeStatus={this.onChangeStatus}
                    onChangeRole={this.onChangeRole}
                    onChangeLevel={this.onChangeLevel}
                    onChangeNextLevel={this.onChangeNextLevel}
                    onChangeSaleRange={this.onChangeSaleRange}
                    onClear={this.onClear}
                    onSubmit={this.onSubmit}
                    onCloseDrawer={this.onCloseDrawer}
                    listLevelsNoPaging={listLevelsNoPaging}
                    status={status}
                    roles={roles}
                    levels={levels}
                    fromSaleAmount={fromSaleAmount}
                    toSaleAmount={toSaleAmount}
                    nextLevel={nextLevel}
                    startDate={startDate}
                    endDate={endDate}
                    onChangeDate={this.onChangeDate}
                />
            </>
        );
    }
}

export default Users;
