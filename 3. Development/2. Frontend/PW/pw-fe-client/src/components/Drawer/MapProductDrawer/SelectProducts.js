import React, {Component} from 'react';
import {Alert, Badge, Button, Card, Col, Input, Row, Select, Table} from "antd";
import {
    RightCircleOutlined,
} from "@ant-design/icons";
import {isMobile} from "react-device-detect";
import * as _ from 'lodash';

const {Option} = Select;
const {Search} = Input;

class SelectProductTypes extends Component {

    state = {
        page: 1,
        keyword: ''
    };

    componentDidMount() {
        // const {listShopifyCollections, fetchAllProductByCollection, siteData} = this.props;
        // if (listShopifyCollections.shopifyCollections.length > 0) {
        //     fetchAllProductByCollection({
        //         siteType: siteData.siteType,
        //         siteId: siteData.id,
        //         collectionId: '',
        //     })
        // }
    }


    onChange = async (value) => {

        const {fetchAllProductByCollection, siteData, onChangeCollection, onRowSelected} = this.props;

        if (value) {

            await onChangeCollection(value);

            await onRowSelected([], []);

            if (siteData.siteType === 'SHOPIFY') {

                await fetchAllProductByCollection({
                    siteType: siteData.siteType,
                    siteId: siteData.id,
                    collectionId: value,
                    keyword: '',
                })

            } else if (siteData.siteType === 'WOO') {

                await this.setState({page: 1}, () => {

                    fetchAllProductByCollection({
                        siteType: siteData.siteType,
                        siteId: siteData.id,
                        category: value,
                        page: 1,
                        keyword: '',
                    })
                });
            }
        }

    };

    onLoadMore = () => {

        const {fetchAllProductByCollection, siteData, listProductsByCollection, collectionId} = this.props;

        if (siteData.siteType === 'SHOPIFY') {

            const {pageInfo} = listProductsByCollection;

            // let maxId = products.sort((a,b)=>b.id-a.id)[0].id;

            fetchAllProductByCollection({
                siteType: siteData.siteType,
                siteId: siteData.id,
                collectionId: collectionId,
                pageInfo: pageInfo,
                keyword: this.state.keyword,
            })
        } else if (siteData.siteType === 'WOO') {

            this.setState(prev => ({page: prev.page + 1}), () => {
                fetchAllProductByCollection({
                    siteType: siteData.siteType,
                    siteId: siteData.id,
                    category: collectionId,
                    page: this.state.page,
                    keyword: this.state.keyword,
                })
            });
        }

    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.props.onRowSelected(selectedRowKeys, selectedRows);
    };

    checkStatus = (status) => {
        let result = '-';

        if (status === 'PROCESSING') {
            result = <Badge
                status={'warning'}
                text={'Processing'}
            />
        } else if (status === 'SUCCESS') {
            result = <Badge
                status={'success'}
                text={'Success'}
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

    onSearch = (value) => {
        if (value) {
            this.onSubmit();
        }
    };

    onSubmit = () => {
        const {fetchAllProductByCollection, siteData, collectionId} = this.props;

        if (collectionId) {

            if (siteData.siteType === 'SHOPIFY') {

                fetchAllProductByCollection({
                    siteType: siteData.siteType,
                    siteId: siteData.id,
                    collectionId: collectionId,
                    keyword: this.state.keyword,
                })

            } else if (siteData.siteType === 'WOO') {

                this.setState({page: 1}, () => {

                    fetchAllProductByCollection({
                        siteType: siteData.siteType,
                        siteId: siteData.id,
                        category: collectionId,
                        page: 1,
                        keyword: this.state.keyword,
                    })
                });
            }
        }
    };

    render() {

        const {listShopifyCollections, listProductsByCollection, siteData, selectedRowKeys, collectionId} = this.props;

        let categoryOptions = [];
        if (listShopifyCollections.shopifyCollections.length > 0) {
            if (!_.find(listShopifyCollections.shopifyCollections, {name: 'All'})) {
                listShopifyCollections.shopifyCollections.unshift({
                    id: 'allallall',
                    name: 'All'
                });

                categoryOptions = listShopifyCollections.shopifyCollections.map(value => (
                    <Option key={value.id} value={value.id}>{value.name}</Option>
                ));

            } else {
                categoryOptions = listShopifyCollections.shopifyCollections
                    .sort(function (x, y) {
                        return x.name === 'All' ? -1 : y.name === 'All' ? 1 : 0;
                    })
                    .map(value => (
                        <Option key={value.id} value={value.id}>{value.name}</Option>
                    ));
            }
        }

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => {
                if (siteData.siteType === 'WOO') {
                    return {
                        disabled: (record.status === 'PROCESSING' || record.status === 'SUCCESS'),
                        name: record.name,
                    }
                } else {
                    return {
                        disabled: (record.status === 'PROCESSING' || record.status === 'SUCCESS'),
                        title: record.title,
                    }
                }
            }
        };

        return (
            <>
                <Row style={{marginBottom: '24px', alignItems: 'center'}}>
                    <Col md={selectedRowKeys.length > 0 ? 20 : 24}>
                        <Alert
                            message={'This action will remove all current variants from your site'}
                            // description={ReactHtmlParser(urgentNote.note[urgentNote.note.length - 1].content || '')}
                            type="warning"
                            showIcon
                        />
                    </Col>
                    {
                        selectedRowKeys.length > 0 && (
                            <Col md={4} style={{textAlign: 'right'}}>
                                <Button
                                    type="primary"
                                    icon={<RightCircleOutlined/>}
                                    size={isMobile ? 'small' : 'middle'}
                                    onClick={() => {
                                        this.props.handleStep(false, true);
                                    }}
                                    style={{width: '80%'}}
                                >
                                    Next
                                </Button>

                            </Col>
                        )
                    }
                </Row>
                <Card
                    title={<span style={{fontFamily: 'Poppins-Medium'}}>Categories</span>}
                >
                    <Row gutter={24}>
                        <Col md={collectionId ? 16 : 24} xs={24}>
                            <Select
                                showSearch
                                // allowClear
                                style={{width: '100%'}}
                                placeholder="Choose category"
                                onChange={this.onChange}
                                loading={listShopifyCollections.loading}
                                disabled={listShopifyCollections.loading}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                value={collectionId}
                            >
                                {
                                    categoryOptions
                                }
                            </Select>
                        </Col>
                        {
                            collectionId && <Col md={8} xs={24} style={{textAlign: 'right'}}>
                                <Search
                                    allowClear
                                    placeholder="Search product by title"
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    // style={{width: '100%'}}
                                />
                            </Col>
                        }
                    </Row>
                </Card>

                {
                    selectedRowKeys.length > 0 && (
                        <Row style={{marginTop: '24px'}}>
                            <Col md={12}>
                                 <span style={{fontFamily: 'Poppins-Medium'}}>
                                    {`${selectedRowKeys.length} items selected`}
                                </span>
                            </Col>
                        </Row>
                    )
                }
                <Row style={{marginTop: '24px'}} gutter={24}>
                    <Col md={24} xs={24}>
                        <Table
                            rowKey={record => record.id}
                            dataSource={
                                collectionId ? listProductsByCollection.products.sort(function (x, y) {
                                    return x.status === 'SUCCESS' ? 1 : y.status === 'SUCCESS' ? -1 : 0;
                                }) : []
                            }
                            loading={listProductsByCollection.loading}
                            rowSelection={{
                                ...rowSelection,
                            }}
                            pagination={false}
                            scroll={{
                                scrollToFirstRowOnChange: false,
                            }}
                            columns={[
                                {
                                    title: 'Id',
                                    dataIndex: 'id',
                                    key: 'Id',
                                },
                                {
                                    title: 'Title',
                                    dataIndex: siteData && siteData.siteType === 'WOO' ? 'name' : 'title',
                                    key: 'title',
                                    render: (title, record) => {
                                        return (
                                            <div>
                                                <img
                                                    style={{width: '45px', marginRight: '10px'}} alt='thumb'
                                                    src={record.images[0] && record.images[0] && record.images[0].src}
                                                />
                                                <span>{title}</span>
                                            </div>
                                        )
                                    },
                                },
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    key: 'status',
                                    render: (text) => {
                                        return this.checkStatus(text)
                                    },
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row style={{marginTop: '20px', textAlign: 'center'}} gutter={24}>
                    <Col md={24} xs={24}>
                        {
                            listProductsByCollection.showLoadMoreBtn ? (<Button
                                    onClick={this.onLoadMore}
                                    loading={listProductsByCollection.loading}
                                    type='primary'
                                >
                                    Load more
                                </Button>
                            ) : (
                                '-- End of Data --'
                            )
                        }
                    </Col>
                </Row>
            </>
        )
            ;
    }
}


export default SelectProductTypes;
