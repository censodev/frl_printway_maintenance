import React, {Component} from 'react';
import {Tooltip, Card, Table, Button, Space, Popconfirm, message, Input, Row, Col} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    ApartmentOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './levels.module.less';
import EditSellerLevelsDrawer from "../../components/Drawer/EditSellerLevelsDrawer/EditSellerLevelsDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";

const {Search} = Input;
const key = 'deleteTransaction';

class SellerLevels extends Component {

    state = {
        levelsData: null,
        openEditSellerLevelsDrawer: false,
        pageSize: 10,
        currentPage: 0,
        keyword: '',
        sortedInfo: {
            order: 'asc',
            columnKey: 'createdDate',
        },
    };

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


    componentDidMount() {
        this.props.fetchAllSellerLevels(this.checkParam());
    }

    showEditSellerLevelsDrawer = (data) => {
        this.setState({
            openEditSellerLevelsDrawer: true,
            levelsData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            levelsData: null,
            openEditSellerLevelsDrawer: false,
        });
    };


    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteSellerLevel(id);
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
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order}`
        }

        dataParams.keyword = keyword;
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };


    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
                currentPage: pagination.current - 1
            }, () =>
                this.props.fetchAllSellerLevels(this.checkParam())
        );
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
            this.props.fetchAllSellerLevels(this.checkParam());
        });

    };

    render() {

        const {
            levelsData,
            openEditSellerLevelsDrawer,
            pageSize,
            currentPage,
        } = this.state;

        const {
            listLevels,
            editSellerLevel,
            createSellerLevel,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess
        } = this.props;

        const {levels, loading, totalElements} = listLevels;

        return (

            <>
                <Card
                    title={<span><ApartmentOutlined style={{marginRight: '5px'}}/> SELLER LEVELS</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => this.setState({openEditSellerLevelsDrawer: true})}
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
                                    placeholder="Search by name"
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
                            },
                            {
                                title: 'Users',
                                dataIndex: 'totalSeller',
                                key: 'totalSeller',
                                render: (text) => parseFloat(text).toLocaleString('en-GB')
                            },
                            // {
                            //     title: 'Total Order',
                            //     dataIndex: 'totalOrder',
                            //     key: 'totalOrder',
                            //     render: (text) => text.toLocaleString()
                            // },
                            {
                                title: 'Level up condition',
                                dataIndex: 'totalOrder',
                                key: 'totalOrder',
                                render: text => {
                                    return `>=${parseFloat(text).toLocaleString('en-GB')} sales`
                                },
                            },
                            {
                                title: 'Level up notification condition (%)',
                                dataIndex: 'percentToAlert',
                                key: 'percentToAlert',
                            },
                            {
                                title: 'Discount (USD)',
                                dataIndex: 'discountInUsd',
                                key: 'discountInUsd',
                                render: (text) => parseFloat(text).toLocaleString('en-GB')
                            },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => (
                                    <Space size="middle">
                                        <Tooltip title='Edit'>
                                            <EditOutlined className={classnames('blue', cls.icon)}
                                                          onClick={() => {
                                                              this.showEditSellerLevelsDrawer(record);
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
                        dataSource={levels}
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

                <EditSellerLevelsDrawer
                    visible={openEditSellerLevelsDrawer}
                    onClose={this.onCloseDrawer}
                    editSellerLevel={editSellerLevel}
                    createSellerLevel={createSellerLevel}
                    data={levelsData}
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

export default SellerLevels;
