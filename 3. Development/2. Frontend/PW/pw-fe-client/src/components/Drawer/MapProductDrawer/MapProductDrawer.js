import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {
    Drawer,
    Button,
    Form,
    Row,
    Col,
    message,
    Space,
} from 'antd';
import {
    BlockOutlined,
    LeftCircleOutlined,
} from '@ant-design/icons';
import * as _ from 'lodash';
import VariantDetail from './VariantDetail';
import cls from './style.module.less';
import SelectProducts from './SelectProducts';
import SelectProductTypes from './SelectProductTypes';
import CatchError from "../../../core/util/CatchError";


class MapProductDrawer extends Component {

    formRef = React.createRef();

    state = {
        collectionId: '',
        selectedRows: [],
        selectedRowKeys: [],
        listActiveProductTypes: [],
        step1: true,
        step2: false,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            mapProductError,
            mapProductSuccess,
        } = this.props;

        if (
            nextProps.mapProductSuccess === true
            && nextProps.mapProductSuccess !== mapProductSuccess
        ) {
            message.success({
                content: 'Success!', duration: 1.5, onClose: () => {
                    this.onReset();
                }
            });
        }

        if (
            nextProps.mapProductError && nextProps.mapProductError !== mapProductError
        ) {
            message.error({
                content: CatchError[nextProps.mapProductError] || nextProps.mapProductError,
                duration: 2
            });
        }

    }

    onSelectCard = (data) => {
        const {listActiveProductTypes} = this.state;

        const idx = _.findIndex(listActiveProductTypes, {id: data.id});

        if (idx !== -1) {
            listActiveProductTypes.splice(idx, 1);
        } else {
            listActiveProductTypes.push(data);
        }

        this.setState({
            listActiveProductTypes
        });

    };

    onRowSelected = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };


    onFinish = (values) => {

        const {siteData, mapProduct} = this.props;
        const {selectedRows} = this.state;


        if (siteData && values) {

            // console.log({
            //     site: {
            //         id: siteData.id
            //     },
            //     productTypes: values.productTypes,
            //     wooProducts: siteData.siteType === 'WOO' ? selectedRows : [],
            //     shopifyProducts: siteData.siteType === 'SHOPIFY' ? selectedRows : []
            // })

            mapProduct({
                site: {
                    id: siteData.id
                },
                productTypes: values.productTypes,
                wooProducts: siteData.siteType === 'WOO' ? selectedRows : [],
                shopifyProducts: siteData.siteType === 'SHOPIFY' ? selectedRows : []
            })
        }


    };

    onFinishFailed = errorInfo => {
        if (errorInfo && errorInfo.errorFields && Array.isArray(errorInfo.errorFields) && errorInfo.errorFields.length > 0) {
            message.error('Please complete all required fields!')
        }
    };


    handleData = () => {
        const {listActiveProductTypes} = this.state;
        if (listActiveProductTypes.length > 0) {

            let obj = listActiveProductTypes.map(value => {
                return {
                    "productType": {
                        "id": value.id,
                        "title": value.title
                    },
                    "variantDetails": value.variantDetails.map(variant => {
                        return {
                            "enable": variant.enable,
                            "option1Type": value.variants && value.variants[0] ? value.variants[0].name : '',
                            "option2Type": value.variants && value.variants[1] ? value.variants[1].name : '',
                            "option1": variant.option1 || null,
                            "option2": variant.option2 || null,
                            "baseSku": variant.sku,
                            "baseCost": variant.baseCost || 0,
                            "regularPrice": variant.retailCost || 1,
                            "salePrice": variant.saleCost || 1,
                            "imageId": null
                        }
                    }),
                    "printFileImages": value.printFileFormats.map(printFile => {
                        return {
                            "image": printFile.thumb && printFile.thumb.id ? {id: printFile.thumb && printFile.thumb.id} : null,
                            "name": printFile.name || '',
                            "width": printFile.width || 1,
                            "height": printFile.height || 1,
                            "note": printFile.note || '',
                            "sku": printFile.sku || '',
                            "uniqueKey": printFile.uniqueKey || '',
                            "enable": false
                        }
                    })
                }
            });

            return {
                productTypes: obj
            }
        }

        return {};
    };

    handleStep = (step1, step2) => {
        this.setState({
            step1: step1,
            step2: step2
        })
    };

    onChangeCollection = (value) => {
        this.setState({
            collectionId: value
        })
    };

    onReset = () => {
        this.setState({
            listActiveProductTypes: [],
            collectionId: '',
            selectedRows: [],
            selectedRowKeys: [],
            step1: true,
            step2: false
        }, () => {
            this.props.onClose();
            this.props.handleLoadMoreBtn(false)
        });
    };


    render() {

        const {listActiveProductTypes, step1, step2, selectedRows, selectedRowKeys, collectionId} = this.state;

        const {
            siteData,
            visible,
            mapProductLoading,
            listProductType,
            listShopifyCollections,
            fetchAllShopifyCollections,
            listProductsByCollection,
            fetchAllProductByCollection,
        } = this.props;

        const data = this.handleData();
        return (
            <Drawer
                title={
                    step2 ? (
                        <>
                            <Row gutter={24}>
                                <BlockOutlined style={{marginRight: '5px', color: 'rgba(0, 0, 0, 0.45)'}}/>
                                <span style={{color: '#7f7f7f', marginRight: 5}}>MAPPING PRODUCTS</span> > STEP 2:
                                Select
                                Product type
                            </Row>
                            {
                                listProductType.productType.length > 0 && (
                                    <div className={cls.menu}>
                                        {
                                            listProductType.productType.sort((a, b) => {
                                                return a.priority - b.priority
                                            }).map(data => (
                                                <a key={data.id} style={{marginRight: 15, fontSize: '.875rem'}}
                                                   href={`#${data.id}`}>{data.name}</a>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </>
                    ) : step1 ?
                        (
                            <div>
                                <span style={{color: '#7f7f7f'}}>MAPPING PRODUCTS </span> > STEP 1: Select a category
                            </div>) : (
                            <div>
                                <span style={{color: '#7f7f7f'}}>MAPPING PRODUCTS </span> > STEP 3: Edit variant
                            </div>
                        )
                }
                destroyOnClose
                width={isMobile ? '90%' : '86%'}
                onClose={this.onReset}
                visible={visible}
                footer={
                    !step1 && !step2 && (
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Space>
                                <Button
                                    type="primary"
                                    loading={mapProductLoading}
                                    onClick={() => {
                                        this.submit.click();
                                    }}
                                >
                                    Mapping product
                                </Button>
                                <Button onClick={this.onReset} style={{marginRight: 8}}>
                                    Cancel
                                </Button>
                            </Space>
                        </div>
                    )
                }
            >
                {
                    step1 ? (
                        <SelectProducts
                            handleStep={this.handleStep}
                            listShopifyCollections={listShopifyCollections}
                            fetchAllShopifyCollections={fetchAllShopifyCollections}
                            fetchAllProductByCollection={fetchAllProductByCollection}
                            siteData={siteData}
                            listProductsByCollection={listProductsByCollection}
                            onRowSelected={this.onRowSelected}
                            selectedRows={selectedRows}
                            selectedRowKeys={selectedRowKeys}
                            onChangeCollection={this.onChangeCollection}
                            collectionId={collectionId}
                        />
                    ) : step2 ? (
                        <SelectProductTypes
                            handleStep={this.handleStep}
                            listActiveProductTypes={listActiveProductTypes}
                            onSelectCard={this.onSelectCard}
                            listProductType={listProductType}
                        />
                    ) : (
                        <>
                            <Row>
                                <Col md={24} style={{textAlign: 'right'}}>
                                    <Button
                                        type="link"
                                        icon={<LeftCircleOutlined/>}
                                        size={isMobile ? 'small' : 'middle'}
                                        onClick={() => this.handleStep(false, true)}
                                    >
                                        back
                                    </Button>
                                </Col>
                            </Row>
                            <Form
                                ref={this.formRef}
                                layout="vertical"
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                                initialValues={{
                                    'productTypes': _.get(data, 'productTypes', []),
                                }}
                            >
                                <Row gutter={24}>
                                    <Col md={24} xs={24} style={{textAlign: 'left'}}>
                                        <VariantDetail
                                            form={this.formRef}
                                            listActiveProductTypes={listActiveProductTypes}
                                        />
                                        <Form.Item style={{display: 'none'}}>
                                            <Row>
                                                <Col md={data ? 12 : 24} xs={data ? 12 : 24}>
                                                    <Button
                                                        ref={input => this.submit = input}
                                                        // icon={<SaveOutlined/>}
                                                        type="primary"
                                                        loading={mapProductLoading}
                                                        htmlType="submit"
                                                    >
                                                        Mapping product
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                    )
                }

            </Drawer>
        )
    }
}

export default MapProductDrawer;
