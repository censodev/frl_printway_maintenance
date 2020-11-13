import React, {Component} from 'react';
import {Tooltip, Card, Table, Button, Space, Popconfirm, message, Row, Col, Input} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    PicCenterOutlined,
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './categories.module.less';
import EditCategoryDrawer from "../../components/Drawer/EditCategoryDrawer/EditCategoryDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";


const key = 'deleteTransaction';
const {Search} = Input;

// const {Option} = Select;

class Categories extends Component {

    state = {
        categoryData: null,
        openEditCategoryDrawer: false,
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
        this.props.fetchAllCategories(this.checkParam());
    }


    showEditCategoryDrawer = (data) => {
        this.setState({
            openEditCategoryDrawer: true,
            categoryData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            categoryData: null,
            openEditCategoryDrawer: false,
        });
    };


    onDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteCategory(id);
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
                    this.props.fetchAllCategories(this.checkParam());
                }
            );
        } else {

            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () => {
                    this.props.fetchAllCategories(this.checkParam());
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
            this.props.fetchAllCategories(this.checkParam());
        });

    };


    render() {

        const {
            categoryData,
            openEditCategoryDrawer,
            pageSize,
            currentPage,
            // sortedInfo,
            // status
        } = this.state;

        const {
            listCategories,
            editCategory,
            createCategory,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess
        } = this.props;

        const {categories, loading, totalElements} = listCategories;

        return (

            <>
                <Card
                    title={<span><PicCenterOutlined style={{marginRight: '5px'}}/> CATEGORIES</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => this.setState({openEditCategoryDrawer: true})}
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
                                    placeholder="Search by category"
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
                                title: 'Category',
                                dataIndex: 'name',
                                key: 'name',
                                sorter: true,
                            },
                            {
                                title: 'Product Type',
                                dataIndex: 'totalProductType',
                                key: 'totalProductType',
                                sorter: true,
                                render: (text => text.toLocaleString()),
                            },
                            {
                                title: 'Priority',
                                dataIndex: 'priority',
                                sorter: true,
                                key: 'priority',
                            },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => (
                                    <Space size="middle">
                                        <Tooltip title='Edit'>
                                            <EditOutlined className={classnames('blue', cls.icon)}
                                                          onClick={() => {
                                                              this.showEditCategoryDrawer(record);
                                                          }}/>
                                        </Tooltip>

                                        <Popconfirm
                                            title="Are you sure to delete？"
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.onDelete(record.id)
                                            }}
                                        >
                                            <DeleteOutlined className={classnames('orange', cls.icon)}/>
                                        </Popconfirm>

                                    </Space>
                                )
                            },
                        ]}
                        dataSource={categories}
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

                <EditCategoryDrawer
                    visible={openEditCategoryDrawer}
                    onClose={this.onCloseDrawer}
                    editCategory={editCategory}
                    createCategory={createCategory}
                    data={categoryData}
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

export default Categories;
