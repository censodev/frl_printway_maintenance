import React, {Component} from 'react';
import {Tooltip, Card, Table, Button, Space, Popconfirm, message, Input, Row, Col, Badge} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    UnlockOutlined,
    RobotOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './carries.module.less';
import EditCarrieDrawer from "../../components/Drawer/EditCarrieDrawer/EditCarrieDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";

const {Search} = Input;
const key = 'deleteTransaction';

class Carries extends Component {

    state = {
        // visible: false,
        carrieData: null,
        openEditCarrieDrawer: false,
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
            activeSuccess,
            activeError
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
            message.error({content: CatchError[nextProps.deleteError] || nextProps.deleteError, key});
        }

        if (
            nextProps.activeSuccess === true
            && nextProps.activeSuccess !== activeSuccess
        ) {
            message.success({
                content: 'Success!', key, duration: 1.5, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.activeError && nextProps.activeError !== activeError
        ) {
            message.error({content: CatchError[nextProps.activeError] || nextProps.activeError, key});
        }


    }

    componentDidMount() {
        this.props.fetchAllCarries(this.checkParam());
    }


    showEditSiteDrawer = (data) => {
        this.setState({
            openEditCarrieDrawer: true,
            carrieData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            carrieData: null,
            openEditCarrieDrawer: false,
        });
    };

    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteCarrie(id);
        }
    };

    handleActive = (data) => {
        message.loading({content: 'Loading...', key});
        this.props.activeCarrie({
            id: data.id,
            active: !data.active
        })
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
            currentPage,
            pageSize,
            sortedInfo,
            keyword
        } = this.state;

        const dataParams = {};

        // if (status) {
        //     dataParams.activated = status === 'active';
        // }


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
                    this.props.fetchAllCarries(this.checkParam());
                }
            );
        } else {

            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () => {
                    this.props.fetchAllCarries(this.checkParam());
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
            this.props.fetchAllCarries(this.checkParam());
        });

    };

    render() {

        const {
            carrieData,
            openEditCarrieDrawer,
            pageSize,
            currentPage,
        } = this.state;

        const {
            listCarries,
            editCarrie,
            createCarrie,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess,
        } = this.props;

        const {carries, loading, totalElements} = listCarries;

        return (

            <>
                <Card
                    title={<span><RobotOutlined style={{marginRight: '5px'}}/> Carriers</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => this.setState({openEditCarrieDrawer: true})}
                        >
                            Add new
                        </Button>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={8} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search by name, code"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            {/*<Col md={3} xs={24}>*/}
                            {/*    <Button onClick={this.onSortByDate} style={{width: '100%'}}*/}
                            {/*            icon={sortedInfo.order === 'desc' ? <SortAscendingOutlined/> :*/}
                            {/*                <SortDescendingOutlined/>}>Sort Date</Button>*/}
                            {/*</Col>*/}
                            {/*<Col md={4} xs={24}>*/}
                            {/*    <Select*/}
                            {/*        showSearch*/}
                            {/*        allowClear*/}
                            {/*        style={{width: '100%'}}*/}
                            {/*        placeholder="Filter by status"*/}
                            {/*        onChange={this.onChangeStatus}*/}
                            {/*        value={status}*/}
                            {/*    >*/}
                            {/*        <Option value="active">Active</Option>*/}
                            {/*        <Option value="deactivate">Deactivate</Option>*/}
                            {/*    </Select>*/}
                            {/*</Col>*/}
                        </Row>
                    </Input.Group>
                    <br/>
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'name',
                                key: 'name',
                                sorter: true,
                                render: (text, record) => <Badge
                                    status={record.active ? 'success' : 'warning'}
                                    text={text}
                                />
                            },
                            {
                                title: 'Code',
                                dataIndex: 'code',
                                key: 'code',
                            },
                            {
                                title: 'Url',
                                dataIndex: 'url',
                                key: 'url',
                                render: text => <a href={text} target='_blank'>{text}</a>,
                            },
                            {
                                title: 'Description',
                                dataIndex: 'description',
                                key: 'description',
                            },
                            // {
                            //     title: 'Status',
                            //     dataIndex: 'active',
                            //     key: 'active',
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
                                                              this.showEditSiteDrawer(record);
                                                          }}/>
                                        </Tooltip>

                                        <Popconfirm
                                            title={`Are you sure to ${record.active ? 'Deactivate' : 'Active'} this carrier？`}
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.handleActive(record)
                                            }}
                                        >
                                            {
                                                !record.active ?
                                                    <UnlockOutlined className={classnames('green', cls.icon)}/> :
                                                    <LockOutlined className={classnames('red', cls.icon)}/>
                                            }
                                        </Popconfirm>


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
                                ),
                            },
                        ]}
                        dataSource={carries}
                        loading={loading}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} carries`
                        }}
                        onChange={this.handleTableChange}
                    />
                </Card>

                <EditCarrieDrawer
                    visible={openEditCarrieDrawer}
                    onClose={this.onCloseDrawer}
                    editCarrie={editCarrie}
                    createCarrie={createCarrie}
                    data={carrieData}
                    editLoading={editLoading}
                    editSuccess={editSuccess}
                    editError={editError}
                    createError={createError}
                    createLoading={createLoading}
                    createSuccess={createSuccess}
                />
            </>
        );
    }
}

export default Carries;
