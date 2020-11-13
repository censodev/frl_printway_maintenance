import React, {Component} from 'react';
import {Tooltip, Card, Table, Button, Space, Popconfirm, message, Input, Row, Col, Badge} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    HistoryOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './suppliers.module.less';
// import EditSitesDrawer from "../../components/Drawer/EditSitesDrawer/EditSitesDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";

const {Search} = Input;
const key = 'deleteTransaction';

class Suppliers extends Component {

    state = {
        // sitesData: null,
        // openEditSitesDrawer: false,
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
        this.props.fetchAllSuppliers(this.checkParam());
    }

    // showEditSitesDrawer = (data) => {
    //     this.setState({
    //         openEditSitesDrawer: true,
    //         levelsData: data
    //     });
    // };
    //
    // onCloseDrawer = () => {
    //     this.setState({
    //         levelsData: null,
    //         openEditSitesDrawer: false,
    //     });
    // };


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
                this.props.fetchAllSuppliers(this.checkParam())
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
            this.props.fetchAllSuppliers(this.checkParam());
        });

    };

    render() {

        const {
            // levelsData,
            // openEditSitesDrawer,
            pageSize,
            currentPage,
        } = this.state;

        const {
            listSuppliers,
            // editSellerLevel,
            // createSellerLevel,
            // editLoading,
            // editSuccess,
            // editError,
            // createLoading,
            // createError,
            // createSuccess
        } = this.props;

        const {suppliers, loading, totalElements} = listSuppliers;

        return (

            <>
                <Card
                    title={<span><HistoryOutlined style={{marginRight: '5px'}}/> SUPPLIERS</span>}
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
                                    placeholder="Search..."
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
                            // {
                            //     title: 'Url',
                            //     dataIndex: 'url',
                            //     key: 'url',
                            // },
                            // {
                            //     title: 'Platform',
                            //     dataIndex: 'siteType',
                            //     key: 'siteType',
                            // },
                            // {
                            //     title: 'User',
                            //     dataIndex: 'user',
                            //     key: 'user',
                            // },
                            // {
                            //     title: 'Connected date',
                            //     dataIndex: 'createdDate',
                            //     key: 'createdDate',
                            //     render: text => new Date(text).toLocaleString(),
                            // },
                            {
                                title: 'Status',
                                dataIndex: 'activated',
                                key: 'activated',
                                render: text => {
                                    return <Badge
                                        status={text ? 'success' : 'warning'}
                                        text={text ? 'Active' : 'Deactivate'}
                                    />
                                },
                            },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => (
                                    <Space size="middle">
                                        {/*<Tooltip title='Edit'>*/}
                                        {/*    <EditOutlined className={classnames('blue', cls.icon)}*/}
                                        {/*                  onClick={() => {*/}
                                        {/*                      this.showEditSitesDrawer(record);*/}
                                        {/*                  }}/>*/}
                                        {/*</Tooltip>*/}

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
                        dataSource={suppliers}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} suppliers`
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

export default Suppliers;
