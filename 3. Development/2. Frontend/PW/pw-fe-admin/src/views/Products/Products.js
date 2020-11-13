import React, {Component} from 'react';
import {
    Card,
    Table,
    message,
    Input,
    Row,
    Col,
    Select,
    Button,
    Tooltip,
    Badge,
    DatePicker,
    Checkbox,
} from 'antd';
import {
    BlockOutlined,
} from "@ant-design/icons";
import {isMobile} from 'react-device-detect';
import cls from './products.module.less';
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";
import getImageUrl from "../../core/util/getImageUrl";
import img from "../../assets/placeholder-thumb.png";
import EditPrintFilesDrawer from "../../components/Drawer/EditPrintFilesDrawer/EditPrintFilesDrawer";
import moment from 'moment';
import checkSiteStatus from "../../core/util/checkSiteStatus";

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;
const key = 'deleteTransaction';


class Products extends Component {

    state = {
        isShowProductType: false,
        productData: {},
        openEditProductDrawer: false,
        printFilesData: null,
        openEditPrintFilesDrawer: false,
        seller: undefined,
        siteId: undefined,
        productTypeId: undefined,
        fullDesign: undefined,
        startDate: undefined,
        endDate: undefined,
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
        const {
            fetchAllProductTypeNoPaging,
            fetchAllSeller,
            fetchAllProducts,
            fetchAllSitesNoPaging
        } = this.props;

        fetchAllProducts(this.checkParam());
        fetchAllProductTypeNoPaging();
        fetchAllSeller();
        fetchAllSitesNoPaging();


    }


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

    onChangeSeller = (value) => {
        this.setState({
            seller: value
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

    // handleDelete = (id) => {
    //     if (id) {
    //         message.loading({content: 'Loading...', key});
    //         this.props.deleteProductType(id);
    //     }
    // };


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

    onChangeSite = (value) => {
        this.setState({
            siteId: value
        }, () => {
            this.onSubmit();
        })
    };

    checkParam = () => {
        const {
            seller,
            fullDesign,
            startDate,
            endDate,
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            productTypeId,
            siteId
        } = this.state;

        const dataParams = {};

        if (siteId) {
            dataParams.siteId = siteId;
        }

        if (seller) {
            dataParams.seller = seller;
        }

        if (productTypeId) {
            dataParams.productTypeId = productTypeId;
        }

        if (fullDesign !== undefined) {
            dataParams.fullDesign = fullDesign;
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

    render() {

        const {
            printFilesData,
            openEditPrintFilesDrawer,
            pageSize,
            currentPage,
        } = this.state;

        const {
            listProducts,
            listSeller,
            listProductTypeNoPaging,
            editPrintFiles,
            editPrintFilesLoading,
            editPrintFilesSuccess,
            editPrintFilesError,
            listSitesNoPaging
        } = this.props;

        const {products, loading, totalElements} = listProducts;


        return (

            <>
                <Card
                    title={<span><BlockOutlined style={{marginRight: '5px'}}/> PRODUCTS MANAGER</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={4} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search title"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
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
                                />
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
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{width: '100%'}}
                                    placeholder="Filter by seller"
                                    onChange={this.onChangeSeller}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        listSeller.sellers.map(value => (
                                            <Option key={value.id}
                                                    value={value.email}>{`${value.firstName || ''} ${value.lastName || ''}`}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{width: '100%'}}
                                    placeholder="Filter product type"
                                    onChange={this.onChangeProductType}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
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
                                title: 'Seller',
                                dataIndex: 'fullName',
                                key: 'fullName',
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
                            //             text={text ? 'Running' : 'Pending'}
                            //         />
                            //     )
                            // },
                            // {
                            //     title: 'Actions',
                            //     key: 'action',
                            //     render: (text, record) => {
                            //         return (
                            //             <Dropdown overlay={
                            //                 <Menu>
                            //                     <Menu.Item onClick={() => {
                            //                         this.setState({isShowProductType: false}, () => {
                            //                             this.showEditProductDrawer(record);
                            //                         })
                            //                     }}>
                            //                         <EditOutlined
                            //                             className={classnames('orange', cls.icon)}
                            //                         /> Edit
                            //                     </Menu.Item>
                            //                     <Menu.Item>
                            //                         <DiffFilled
                            //                             className={classnames('blue', cls.icon)}
                            //                         /> Duplicate
                            //                     </Menu.Item>
                            //                 </Menu>
                            //             }>
                            //                 <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            //                     <Button type='link' icon={<SettingOutlined/>}/>
                            //                 </a>
                            //             </Dropdown>
                            //         )
                            //     }
                            // },
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
