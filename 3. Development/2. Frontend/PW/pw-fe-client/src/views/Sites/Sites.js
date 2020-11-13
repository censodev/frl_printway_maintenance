import React, {Component} from 'react';
import {
    Card,
    Table,
    message,
    Input,
    Row,
    Col,
    Badge,
    Select,
    Button,
    Dropdown,
    Menu, Modal
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    HistoryOutlined,
    UnlockOutlined,
    LockOutlined,
    SyncOutlined,
    SettingOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './sites.module.less';
import EditSiteDrawer from "../../components/Drawer/EditSiteDrawer/EditSiteDrawer";
import MapProductDrawer from "../../components/Drawer/MapProductDrawer/MapProductDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";

const {Search} = Input;
const {Option} = Select;
const key = 'deleteTransaction';

class Sites extends Component {

    state = {
        // sitesData: null,
        // openEditSiteDrawer: false,
        openMapProductDrawer: false,
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
            editSuccess,
            activateSuccess,
            activateError,
        } = this.props;

        if (
            nextProps.editSuccess === true
            && nextProps.editSuccess !== editSuccess
        ) {
            message.success({
                content: 'Success!', key, duration: 1.5, onClose: () => {
                    window.location.reload()
                }
            });
        }

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
        this.props.fetchAllSites(this.checkParam());
        if (this.props.listProductType.productType.length === 0) {
            this.props.fetchAllProductType();
        }

    }

    showEditSiteDrawer = (data) => {
        this.setState({
            openEditSiteDrawer: true,
            sitesData: data
        });
    };

    showMapProductDrawer = (data) => {
        this.setState({
            openMapProductDrawer: true,
            sitesData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            sitesData: null,
            openEditSiteDrawer: false,
            openMapProductDrawer: false,
        });
    };

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


    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteSite(id);
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
            keyword
        } = this.state;

        const dataParams = {};

        if (status) {
            dataParams.status = status;
        }

        if (seller) {
            dataParams.seller = seller;
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

        this.setState({
                currentPage: pagination.current - 1,
                sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
            }, () => {
                this.props.fetchAllSites(this.checkParam());
            }
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
            this.props.fetchAllSites(this.checkParam());
        });

    };

    confirmDelete = (id) => {

        Modal.confirm({
            title: 'After Removing, if you want to connect this site again, you need to map all products which were connected with PGC Fulfillment app before this Removing. If you\'re not sure about your decision, it\'s recommended to Deactivate instead. Still delete this site?',
            icon: <ExclamationCircleOutlined/>,
            onOk: () => this.handleDelete(id)
        });

    };

    confirmActivate = (record) => {

        Modal.confirm({
            title: `Are you sure to ${(record.sync && !record.active && !record.deleted) ? 'Activate' : (record.sync && record.active && !record.deleted) ? 'Deactivate' : '-'} this site？`,
            icon: <ExclamationCircleOutlined/>,
            onOk: () => this.handleActivate(record.id)
        });

    };

    render() {

        const {
            sitesData,
            openEditSiteDrawer,
            openMapProductDrawer,
            status,
        } = this.state;

        const {
            listSites,
            editSite,
            createSite,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess,
            mapProductLoading,
            listProductType,
            fetchAllShopifyCollections,
            listShopifyCollections,
            listProductsByCollection,
            fetchAllProductByCollection,
            mapProductSuccess,
            mapProductError,
            mapProduct,
            handleLoadMoreBtn
        } = this.props;

        const {sites, loading} = listSites;

        return (

            <>
                <Card
                    title={<span><HistoryOutlined style={{marginRight: '5px'}}/> SITES</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => this.setState({openEditSiteDrawer: true})}
                        >
                            Add new site
                        </Button>
                    }
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
                            // {
                            //     title: 'Actions',
                            //     key: 'action',
                            //     render: (text, record) => (
                            //         !record.deleted ? <Space size="middle">
                            //             <Tooltip title='Edit'>
                            //                 <EditOutlined className={classnames('blue', cls.icon)}
                            //                               onClick={() => {
                            //                                   this.showEditSiteDrawer(record);
                            //                               }}/>
                            //             </Tooltip>
                            //
                            //             {
                            //
                            //                 record.sync && <Popconfirm
                            //                     title={`Are you sure to ${(record.sync && !record.active && !record.deleted) ? 'Activate' : (record.sync && record.active && !record.deleted) ? 'Deactivate' : '-'} this site？`}
                            //                     okText="Yes" cancelText="No"
                            //                     onConfirm={() => {
                            //                         this.handleActivate(record.id)
                            //                     }}
                            //                 >
                            //                     {
                            //                         (!record.active && !record.deleted) ?
                            //                             <UnlockOutlined className={classnames('green', cls.icon)}/> :
                            //                             (record.active && !record.deleted) ?
                            //                                 <LockOutlined className={classnames('red', cls.icon)}/> : ''
                            //                     }
                            //                 </Popconfirm>
                            //             }
                            //
                            //             <Popconfirm
                            //                 title="Are you sure to remove this site？"
                            //                 okText="Yes" cancelText="No"
                            //                 onConfirm={() => {
                            //                     this.handleDelete(record.id)
                            //                 }}
                            //             >
                            //                 <DeleteOutlined className={classnames('orange', cls.icon)}/>
                            //             </Popconfirm>
                            //
                            //             <Tooltip title='Mapping Product'>
                            //                 <SyncOutlined className={classnames('blue', cls.icon)}
                            //                               onClick={() => {
                            //                                   this.showMapProductDrawer(record);
                            //                                   fetchAllShopifyCollections(record.id);
                            //                               }}/>
                            //             </Tooltip>
                            //
                            //         </Space> : ''
                            //     )
                            // },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => {
                                    return !record.deleted ? <Dropdown overlay={
                                        <Menu inlineCollapsed={false}>
                                            <Menu.Item onClick={() => {
                                                this.showEditSiteDrawer(record);
                                            }}>
                                                <EditOutlined
                                                    className={classnames('blue', cls.icon)}
                                                /> Edit
                                            </Menu.Item>
                                            {
                                                record.sync &&
                                                <Menu.Item onClick={() => this.confirmActivate(record)}>
                                                    {
                                                        (!record.active && !record.deleted) ?
                                                            <>
                                                                <UnlockOutlined
                                                                    className={classnames('green', cls.icon)}
                                                                />
                                                                Activate
                                                            </> :
                                                            (record.active && !record.deleted) ?
                                                                <>
                                                                    <LockOutlined
                                                                        className={classnames('red', cls.icon)}
                                                                    />
                                                                    Deactivate
                                                                </> : ''
                                                    }
                                                </Menu.Item>
                                            }
                                            <Menu.Item onClick={() => this.confirmDelete(record.id)}>
                                                <DeleteOutlined
                                                    className={classnames('orange', cls.icon)}
                                                />
                                                Delete
                                            </Menu.Item>
                                            {
                                                record.sync && !record.virtual && <Menu.Item onClick={() => {
                                                    this.showMapProductDrawer(record);
                                                    fetchAllShopifyCollections(record.id);
                                                }}>
                                                    <SyncOutlined
                                                        className={classnames('blue', cls.icon)}
                                                    />
                                                    Mapping
                                                </Menu.Item>
                                            }
                                        </Menu>
                                    }>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <Button type='link' icon={<SettingOutlined/>}/>
                                        </a>
                                    </Dropdown> : ''
                                },
                            }
                        ]}
                        dataSource={sites}
                        // pagination={{
                        //     current: currentPage + 1,
                        //     pageSize: pageSize,
                        //     total: totalElements,
                        //     showSizeChanger: true,
                        //     onShowSizeChange: this.onShowSizeChange,
                        //     showLessItems: true,
                        //     showQuickJumper: true,
                        //     showTotal: (total) => `Total ${total} sites`
                        // }}
                        loading={loading}
                        onChange={this.handleTableChange}
                    />
                </Card>

                <EditSiteDrawer
                    visible={openEditSiteDrawer}
                    onClose={this.onCloseDrawer}
                    editSite={editSite}
                    createSite={createSite}
                    data={sitesData}
                    editLoading={editLoading}
                    editSuccess={editSuccess}
                    editError={editError}
                    createError={createError}
                    createLoading={createLoading}
                    createSuccess={createSuccess}
                />

                <MapProductDrawer
                    visible={openMapProductDrawer}
                    onClose={this.onCloseDrawer}
                    listProductType={listProductType}
                    listShopifyCollections={listShopifyCollections}
                    fetchAllShopifyCollections={fetchAllShopifyCollections}
                    fetchAllProductByCollection={fetchAllProductByCollection}
                    listProductsByCollection={listProductsByCollection}
                    siteData={sitesData}
                    mapProductSuccess={mapProductSuccess}
                    mapProductError={mapProductError}
                    mapProductLoading={mapProductLoading}
                    mapProduct={mapProduct}
                    handleLoadMoreBtn={handleLoadMoreBtn}
                />


            </>
        );
    }
}

export default Sites;
