import React, {Component} from 'react';
import {
    Card,
    Table,
    message,
    Input,
    Row,
    Col,
    Dropdown,
    Select,
    Button,
    Tooltip,
    Menu,
    Badge,
    Modal,
    Checkbox,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    BlockOutlined,
    SettingOutlined,
    SaveOutlined,
    DiffOutlined,
    ExclamationCircleOutlined,
    SendOutlined
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import cls from './products.module.less';
import EditProductDrawer from "../../components/Drawer/EditProductDrawer/EditProductDrawer";
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";
import getImageUrl from "../../core/util/getImageUrl";
import img from "../../assets/placeholder-thumb.png";
import EditPrintFilesDrawer from "../../components/Drawer/EditPrintFilesDrawer/EditPrintFilesDrawer";
import checkSiteStatus from "../../core/util/checkSiteStatus";

const {Search} = Input;
const {Option} = Select;
const key = 'deleteTransaction';
const keyPublish = 'keyPublish';


class Products extends Component {

    state = {
        visible: false,
        isShowProductType: false,
        productData: {},
        openEditProductDrawer: false,
        printFilesData: null,
        openEditPrintFilesDrawer: false,
        siteId: undefined,
        productTypeId: undefined,
        fullDesign: undefined,
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
            // deleteSuccess,
            // deleteError,
            duplicateSuccess,
            duplicateError,
            syncSuccess,
            syncError,
            activateSuccess,
            activateError,
            currentShoptifyCollection
        } = this.props;

        // if (
        //     nextProps.deleteSuccess === true
        //     && nextProps.deleteSuccess !== deleteSuccess
        // ) {
        //     message.success({
        //         content: 'Success!', key, duration: 1.5, onClose: () => {
        //             window.location.reload()
        //         }
        //     });
        // }
        //
        if (
            nextProps.currentShoptifyCollection && nextProps.currentShoptifyCollection.error !== currentShoptifyCollection.error
        ) {
            message.error({
                content: CatchError[nextProps.currentShoptifyCollection.error] || nextProps.currentShoptifyCollection.error,
                key
            });
        }


        if (
            nextProps.duplicateSuccess === true
            && nextProps.duplicateSuccess !== duplicateSuccess
        ) {
            message.success({
                content: 'Success!', key, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.duplicateError && nextProps.duplicateError !== duplicateError
        ) {
            message.error({
                content: CatchError[nextProps.duplicateError] || nextProps.duplicateError,
                key,
            });
        }


        if (
            nextProps.syncSuccess === true
            && nextProps.syncSuccess !== syncSuccess
        ) {
            message.success({
                content: 'Success!', keyPublish, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.syncError && nextProps.syncError !== syncError
        ) {
            message.error({
                content: CatchError[nextProps.syncError] || nextProps.syncError,
                keyPublish,
            });
        }


        if (
            nextProps.activateSuccess === true
            && nextProps.activateSuccess !== activateSuccess
        ) {
            message.success({
                content: 'Success!', key, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.activateError && nextProps.activateError !== activateError
        ) {
            message.error({
                content: CatchError[nextProps.activateError] || nextProps.activateError,
                key,
            });
        }

    }


    componentDidMount() {
        const {
            fetchAllSitesNoPaging,
            fetchAllProductTypeNoPaging,
            listProductType,
            listSitesNoPaging,
        } = this.props;

        this.props.fetchAllProducts(this.checkParam());


        if (listProductType.productType.length === 0) {
            this.props.fetchAllProductType();
        }


        if (listSitesNoPaging.sites.length === 0) {
            fetchAllSitesNoPaging();
        }

        fetchAllProductTypeNoPaging();

    }

    showEditProductDrawer = (data) => {
        this.setState({
            openEditProductDrawer: true,
            productData: data
        });
    };

    showEditPrintFilesDrawer = data => {
        this.setState({
            openEditPrintFilesDrawer: true,
            printFilesData: data
        })
    };

    onCloseDrawer = () => {
        this.setState({
            productData: null,
            openEditProductDrawer: false,
            openEditPrintFilesDrawer: false
        });
    };

    onChangeSite = (value) => {
        this.setState({
            siteId: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeProductType = (value) => {
        this.setState({
            productTypeId: value
        }, () => {
            this.onSubmit();
        })
    };

    onChangeLackOfDesign = (e) => {
        this.setState({
            fullDesign: e.target.checked ? !e.target.checked : null
        }, () => {
            this.onSubmit();
        })
    };

    // handleDelete = (id) => {
    //     if (id) {
    //         message.loading({content: 'Loading...', key});
    //         this.props.deleteProductType(id);
    //     }
    // };

    onChangeShowProductType = () => {
        this.setState((prev) => ({
            isShowProductType: !prev.isShowProductType
        }));
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
            siteId,
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            productTypeId,
            fullDesign,
        } = this.state;

        const dataParams = {};

        if (siteId) {
            dataParams.siteId = siteId;
        }

        if (productTypeId) {
            dataParams.productTypeId = productTypeId;
        }

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
        }

        if (fullDesign !== undefined) {
            dataParams.fullDesign = fullDesign;
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
                    this.props.fetchAllProducts(this.checkParam());
                }
            );
        } else {

            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () => {
                    this.props.fetchAllProducts(this.checkParam());
                }
            );
        }
    };

    handleDuplicate = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.duplicateProduct(id);
        }
    };

    handleSync = (id) => {
        if (id) {
            message.loading({content: 'Loading...', keyPublish});
            this.props.syncProduct(id);
        }
    };

    handleActivate = (data) => {
        if (data) {
            message.loading({content: 'Loading...', key});
            this.props.activateProduct({
                id: data.id,
                status: !data.activated
            });
        }
    };

    confirm = (type, data) => {

        Modal.confirm({
            title: type === 'Archive' ? 'Are you sure want to archive this product?' : type === 'UnArchive' ? 'Are you sure want to UnArchive this product?' : '',
            icon: <ExclamationCircleOutlined/>,
            content: type === 'Archive' ? 'When you archive the product, It’s still appears on your store, but it’s cannot create new orders to fulfill on Printway platform!' : '',
            okText: type === 'Archive' ? 'Archive' : type === 'UnArchive' ? 'UnArchive' : '',
            cancelText: 'Cancel',
            onOk: () => this.handleActivate(data)
        });

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
            this.props.fetchAllProducts(this.checkParam());
        });

    };

    showModal = (type) => {
        this.setState({
            editType: type,
            visible: true,
        });
    };


    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {

        const {
            productData,
            printFilesData,
            openEditProductDrawer,
            openEditPrintFilesDrawer,
            pageSize,
            currentPage,
            isShowProductType,
        } = this.state;

        const {
            listProductType,
            listShopifyCollections,
            listProducts,
            listSitesNoPaging,
            listProductTypeNoPaging,
            currentShoptifyCollection,
            editProduct,
            createProduct,
            createShoptifyCollection,
            fetchAllShopifyCollections,
            editPrintFiles,
            editLoading,
            editSuccess,
            editError,
            createLoading,
            createError,
            createSuccess,
            editPrintFilesLoading,
            editPrintFilesSuccess,
            editPrintFilesError,
            searchProductType,
            syncProduct,
            syncLoading,
            syncSuccess
        } = this.props;

        const {products, loading, totalElements} = listProducts;


        return (

            <>
                <Card
                    title={<span><BlockOutlined style={{marginRight: '5px'}}/> PRODUCTS MANAGER</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => {
                                this.setState({isShowProductType: true}, () => {
                                    this.showEditProductDrawer(null);

                                    let site = _.find(listSitesNoPaging.sites, {id: localStorage.siteId});
                                    if (site && !site.virtual && site.sync && site.active && !site.deleted) {
                                        fetchAllShopifyCollections(localStorage.siteId || '');
                                    }
                                });
                            }}
                        >
                            Add new
                        </Button>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={7} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search by title..."
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            <Col md={5} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: '100%'}}
                                    placeholder="Filter by site"
                                    onChange={this.onChangeSite}
                                    // value={siteId}
                                >
                                    {
                                        listSitesNoPaging.sites.map(value => (
                                            <Option key={value.id}
                                                    value={value.id}>{`${value.title} ${checkSiteStatus(value)}`}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col md={5} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: '100%'}}
                                    placeholder="Filter by product type"
                                    onChange={this.onChangeProductType}
                                    // value={productType}
                                >
                                    {
                                        listProductTypeNoPaging.productType.map(value => (
                                            <Option key={value.id} value={value.id}>{value.title}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Button>
                                    <Checkbox onChange={this.onChangeLackOfDesign}>Lack of designs</Checkbox>
                                </Button>
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
                                sorter: true,
                                render: (title, record) => {
                                    return (
                                        <div className={cls.titleBox}>
                                            <div style={{marginRight: 20}}>
                                                <Tooltip
                                                    placement="topLeft"
                                                    title={
                                                        () => <img
                                                            alt=''
                                                            style={{width: '100%'}}
                                                            src={getImageUrl(record.images[0] && record.images[0].image && record.images[0].image.id)}
                                                        />
                                                    }
                                                >
                                                    <img
                                                        style={{width: '45px'}} alt='thumb'
                                                        src={getImageUrl(record.images[0] && record.images[0].image && record.images[0].image.id)}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <p style={{marginBottom: 0, marginLeft: 8}}>
                                                    {
                                                        record.synced && record.url ? (
                                                            <a
                                                                href={record.url || ''}
                                                                target='_blank'
                                                                type='link'
                                                            >
                                                                {title || ''}
                                                            </a>
                                                        ) : (
                                                            title || ''
                                                        )
                                                    }
                                                </p>
                                                {
                                                    !record.activated ?
                                                        <span style={{
                                                            marginLeft: 7,
                                                            fontSize: '11px',
                                                            fontStyle: 'italic',
                                                            color: '#ff1a19'
                                                        }}>
                                                            (Archived)
                                                         </span>
                                                        : ''
                                                }
                                                {
                                                    !record.synced ?
                                                        <span style={{
                                                            marginLeft: 7,
                                                            fontSize: '11px',
                                                            fontStyle: 'italic',
                                                            color: '#ff1a19'
                                                        }}>
                                                            (draft)
                                                         </span>
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    )
                                },
                            },
                            {
                                title: 'Product Type',
                                dataIndex: 'productTypes',
                                key: 'productTypes',
                                render: value => {
                                    return (
                                        <ul style={{paddingLeft: 15, marginBottom: 0}}>
                                            {value.map((data, index) => {
                                                return (
                                                    <li key={index}>
                                                        {
                                                            data.productType && data.productType.title ? data.productType.title : ''
                                                        }
                                                        {
                                                            data.productType && data.productType.sku ?
                                                                <p style={{
                                                                    fontStyle: 'italic',
                                                                    fontSize: '.68rem',
                                                                    marginBottom: 0
                                                                }}
                                                                >
                                                                    {`SKU: ${data.productType.sku}`}
                                                                </p> : ''
                                                        }
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )
                                }
                            },
                            {
                                // title: 'Seller',
                                // dataIndex: 'email',
                                // key: 'email',
                            },
                            {
                                title: 'Site',
                                dataIndex: 'site',
                                key: 'site',
                                render: text => text && !text.virtual ?
                                    <a target='_blank' href={text.url}>{text.title}</a> : text.title || ''
                            },
                            {
                                title: 'Created date',
                                dataIndex: 'createdDate',
                                key: 'createdDate',
                                sorter: true,
                                render: text => new Date(text).toLocaleString('en-GB'),
                            },
                            {
                                title: 'Designs',
                                dataIndex: 'design',
                                key: 'design',
                                render: (text, record) => {
                                    let {productTypes} = record;
                                    let count = 0;
                                    Array.isArray(productTypes) && productTypes.map(data => {
                                        if (data.printFileImages && Array.isArray(data.printFileImages)) {
                                            data.printFileImages.map(value => {
                                                if (!value.image || value.custom) {
                                                    return count += 1;
                                                }
                                                return count;
                                            })
                                        }
                                        return count;
                                    });

                                    return (
                                        <Badge count={count}>
                                            <Button onClick={() => this.showEditPrintFilesDrawer(record)}>View</Button>
                                        </Badge>
                                    );
                                },
                            },
                            // {
                            //     title: "Status",
                            //     dataIndex: "synced",
                            //     key: "synced",
                            //     render: text => (
                            //         <Badge
                            //             status={text ? 'success' : 'warning'}
                            //             text={text ? 'Running' : 'Draft'}
                            //         />
                            //     )
                            // },
                            {
                                title: 'Actions',
                                key: 'action',
                                render: (text, record) => {
                                    return (
                                        <Dropdown overlay={
                                            <Menu>
                                                <Menu.Item onClick={() => {
                                                    this.setState({isShowProductType: false}, () => {
                                                        this.showEditProductDrawer(record);
                                                        if (record.site && !record.site.virtual && record.site.sync && record.site.active && !record.site.deleted) {
                                                            fetchAllShopifyCollections(record.site ? record.site.id : '');
                                                        }
                                                    });
                                                }}>
                                                    <EditOutlined
                                                        className={classnames('blue', cls.icon)}
                                                    /> Edit
                                                </Menu.Item>
                                                <Menu.Item onClick={() => this.handleDuplicate(record.id)}>
                                                    <DiffOutlined
                                                        className={classnames('blue', cls.icon)}
                                                    /> Duplicate
                                                </Menu.Item>
                                                <Menu.Item
                                                    onClick={() => this.confirm(!record.activated ? 'UnArchive' : 'Archive', record)}>
                                                    <SaveOutlined
                                                        className={classnames('blue', cls.icon)}
                                                    />
                                                    {
                                                        !record.activated ? 'UnArchive' : 'Archive'
                                                    }
                                                </Menu.Item>
                                                {
                                                    !record.synced && (record.site && !record.site.virtual) && (
                                                        <Menu.Item onClick={() => this.handleSync(record.id)}>
                                                            <SendOutlined
                                                                className={classnames('blue', cls.icon)}
                                                            /> Publish
                                                        </Menu.Item>
                                                    )
                                                }
                                            </Menu>
                                        }>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                <Button type='link' icon={<SettingOutlined/>}/>
                                            </a>
                                        </Dropdown>
                                    )
                                }
                            },
                        ]}
                        dataSource={products}
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

                <EditProductDrawer
                    isShowProductType={isShowProductType}
                    onChangeShowProductType={this.onChangeShowProductType}
                    visible={openEditProductDrawer}
                    onClose={this.onCloseDrawer}
                    editProduct={editProduct}
                    createProduct={createProduct}
                    createShoptifyCollection={createShoptifyCollection}
                    syncProduct={syncProduct}
                    listShopifyCollections={listShopifyCollections}
                    listProductType={listProductType}
                    listSitesNoPaging={listSitesNoPaging}
                    currentShoptifyCollection={currentShoptifyCollection}
                    data={productData}
                    fetchAllShopifyCollections={fetchAllShopifyCollections}
                    editLoading={editLoading}
                    editSuccess={editSuccess}
                    editError={editError}
                    createError={createError}
                    createLoading={createLoading}
                    createSuccess={createSuccess}
                    searchProductType={searchProductType}
                    syncLoading={syncLoading}
                />

                <EditPrintFilesDrawer
                    visible={openEditPrintFilesDrawer}
                    onClose={this.onCloseDrawer}
                    data={printFilesData}
                    editPrintFiles={editPrintFiles}
                    editPrintFilesLoading={editPrintFilesLoading}
                    editPrintFilesSuccess={editPrintFilesSuccess}
                    editPrintFilesError={editPrintFilesError}
                />
            </>
        );
    }
}

export default Products;
