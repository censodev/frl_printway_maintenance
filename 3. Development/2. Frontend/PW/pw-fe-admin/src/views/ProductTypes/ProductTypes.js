import React, {Component} from 'react';
import {Card, Table, Space, Popconfirm, message, Input, Row, Col, Select, Button, Tooltip, Badge} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    BlockOutlined, UnlockOutlined, LockOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './productTypes.module.less';
import EditProductTypeDrawer from "../../components/Drawer/EditProductTypeDrawer/EditProductTypeDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";
import getImageUrl from "../../core/util/getImageUrl";
import img from "../../assets/placeholder-thumb.png";

const {Search} = Input;
const {Option} = Select;
const key = 'deleteTransaction';


class ProductTypes extends Component {

    state = {
        productTypeData: {},
        openEditProductTypeDrawer: false,
        status: undefined,
        supplier: undefined,
        pageSize: 20,
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
        const {
            fetchAllCategoriesNoPaging,
            fetchAllCarriesNoPaging,
            fetchAllSuppliersNoPaging,
            listSuppliersNoPaging,
            listCarriesNoPaging,
            listCategoriesNoPaging,
            fetchAllCountries
        } = this.props;

        this.props.fetchAllProductTypes(this.checkParam());

        if (listCategoriesNoPaging.categories.length === 0) {
            fetchAllCategoriesNoPaging();
        }

        if (listCarriesNoPaging.carries.length === 0) {
            fetchAllCarriesNoPaging();
        }

        if (listSuppliersNoPaging.suppliers.length === 0) {
            fetchAllSuppliersNoPaging();
        }

        fetchAllCountries();

    }

    showEditProductTypeDrawer = (data) => {
        this.setState({
            openEditProductTypeDrawer: true,
            productTypeData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            productTypeData: null,
            openEditProductTypeDrawer: false,
        });
    };

    onChangeCategory = (value) => {
        this.setState({
            category: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeSupplier = (value) => {
        this.setState({
            supplier: value
        }, () => {
            this.onSubmit();
        })
    };

    handleActivate = (id, status) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.activateProductType({
                id,
                status
            });
        }
    };


    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteProductType(id);
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
            category,
            supplier,
            currentPage,
            pageSize,
            sortedInfo,
            keyword
        } = this.state;

        const dataParams = {};

        if (category) {
            dataParams.categoryId = category;
        }

        if (supplier) {
            dataParams.supplierId = supplier;
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
                    this.props.fetchAllProductTypes(this.checkParam());
                }
            );
        } else {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () => {
                    this.props.fetchAllProductTypes(this.checkParam());
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
            this.props.fetchAllProductTypes(this.checkParam());
        });

    };

    render() {

        const {
            productTypeData,
            openEditProductTypeDrawer,
            pageSize,
            currentPage,
        } = this.state;

        const {
            listProductTypes,
            listCountries,
            listCategoriesNoPaging,
            listCarriesNoPaging,
            listSuppliersNoPaging,
            editProductType,
            createProductType,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess,
        } = this.props;

        const {productTypes, loading, totalElements} = listProductTypes;

        return (

            <>
                <Card
                    title={<span><BlockOutlined style={{marginRight: '5px'}}/> PRODUCT TYPES</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => this.setState({openEditProductTypeDrawer: true})}
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
                                    placeholder="Search by title, SKU"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            <Col md={5} xs={24}>
                                <Select
                                    style={{width: '100%'}}
                                    placeholder="Filter by category"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={this.onChangeCategory}
                                    // value={category}
                                >
                                    {
                                        listCategoriesNoPaging.categories.map(value => (
                                            <Option key={value.id} value={value.id}>{value.name}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col md={5} xs={24}>
                                <Select
                                    style={{width: '100%'}}
                                    placeholder="Filter by supplier"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={this.onChangeSupplier}
                                >
                                    {
                                        listSuppliersNoPaging.suppliers.map(value => (
                                            <Option key={value.id}
                                                    value={value.id}>{`${value.firstName || ''} ${value.lastName || ''}`}</Option>
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
                                title: '',
                                dataIndex: 'images',
                                key: 'images',
                                render: images => {
                                    return (
                                        <Tooltip
                                            placement="topLeft"
                                            title={
                                                () => <img
                                                    alt=''
                                                    style={{width: '100%'}}
                                                    src={Array.isArray(images) && images[0] ? getImageUrl(images[0].thumbUrl) : getImageUrl(null)}
                                                />
                                            }
                                        >
                                            <img
                                                style={{width: '45px'}} alt='thumb'
                                                src={Array.isArray(images) && images[0] ? getImageUrl(images[0].thumbUrl) : getImageUrl(null)}
                                            />
                                        </Tooltip>
                                    )
                                },
                            },
                            {
                                title: 'Title',
                                dataIndex: 'title',
                                key: 'title',
                                sorter: true,
                            },
                            {
                                title: 'SKU',
                                dataIndex: 'sku',
                                key: 'sku',
                                sorter: true,
                            },
                            {
                                title: 'Suppliers',
                                dataIndex: 'suppliers',
                                key: 'suppliers',
                                sorter: true,
                                render: text => Array.isArray(text) && text[0] !== null ? text.map((value, index) => `${value.firstName} ${value.lastName}${index < text.length - 1 ? ', ' : ''}`) : ''
                            },
                            {
                                title: 'Category',
                                dataIndex: 'category',
                                key: 'category',
                                sorter: true,
                                render: text => text.name || ''
                            },
                            {
                                title: 'Priority',
                                dataIndex: 'priority',
                                key: 'priority',
                                sorter: true,
                            },
                            {
                                title: 'Created date',
                                dataIndex: 'createdDate',
                                key: 'createdDate',
                                sorter: true,
                                render: text => new Date(text).toLocaleString('en-GB'),
                            },
                            // {
                            //     title: 'Connected date',
                            //     dataIndex: 'createdDate',
                            //     key: 'createdDate',
                            //     sorter: true,
                            //     render: text => new Date(text).toLocaleString(),
                            // },
                            {
                                title: 'Status',
                                dataIndex: 'active',
                                key: 'active',
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
                                        <Tooltip title='Edit'>
                                            <EditOutlined className={classnames('blue', cls.icon)}
                                                          onClick={() => {
                                                              this.showEditProductTypeDrawer(record);
                                                          }}/>
                                        </Tooltip>

                                        <Popconfirm
                                            title={`Are you sure to ${!record.active ? 'Activate' : 'Deactivate'} this productType？`}
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => {
                                                this.handleActivate(record.id, !record.active)
                                            }}
                                        >
                                            {
                                                (!record.active) ?
                                                    <UnlockOutlined className={classnames('green', cls.icon)}/> :
                                                    <LockOutlined className={classnames('red', cls.icon)}/>
                                            }
                                        </Popconfirm>

                                        {
                                            <Popconfirm
                                                title="Are you sure to delete？"
                                                okText="Yes" cancelText="No"
                                                onConfirm={() => {
                                                    this.handleDelete(record.id)
                                                }}
                                            >
                                                <DeleteOutlined className={classnames('orange', cls.icon)}/>
                                            </Popconfirm>
                                        }
                                    </Space>
                                )
                            },
                        ]}
                        dataSource={productTypes}
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

                <EditProductTypeDrawer
                    visible={openEditProductTypeDrawer}
                    onClose={this.onCloseDrawer}
                    editProductType={editProductType}
                    createProductType={createProductType}
                    listCategoriesNoPaging={listCategoriesNoPaging}
                    listCountries={listCountries}
                    listCarriesNoPaging={listCarriesNoPaging}
                    listSuppliersNoPaging={listSuppliersNoPaging}
                    data={productTypeData}
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

export default ProductTypes;
