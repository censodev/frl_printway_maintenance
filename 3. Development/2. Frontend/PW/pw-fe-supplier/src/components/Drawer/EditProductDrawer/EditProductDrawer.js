import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {
    Drawer,
    Button,
    Form,
    Row,
    Col,
    Input,
    Alert,
    message,
    Select,
    Space,
    Card,
    Upload,
    Checkbox,
    Divider,
} from 'antd';
import {
    InboxOutlined,
    BlockOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import * as _ from 'lodash';
import CatchError from "../../../core/util/CatchError";
import CKEditor from "ckeditor4-react";
import ProductTypesDetail from './ProductTypesDetail';
import SelectProductTypes from './SelectProductTypes';

const {Option} = Select;


class EditProductDrawer extends Component {

    formRef = React.createRef();

    state = {
        listActiveProductTypes: [],
        name: '',
        isAcceptTerm: false,
        btnType: ''
    };

    UNSAFE_componentWillReceiveProps(nextProps) {

        if (!this.formRef.current) {
            this.formRef = React.createRef();
        }

        const {
            editSuccess,
            onClose,
            createSuccess,
            currentShoptifyCollection,
        } = this.props;

        if (
            nextProps.editSuccess === true
            && nextProps.editSuccess !== editSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                window.location.reload()
            });
        }

        if (
            nextProps.currentShoptifyCollection && nextProps.currentShoptifyCollection.success === true
            && nextProps.currentShoptifyCollection && nextProps.currentShoptifyCollection.success !== currentShoptifyCollection.success
        ) {
            this.setState({
                name: ''
            })
        }

        if (
            nextProps.createSuccess === true
            && nextProps.createSuccess !== createSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                // window.location.reload()
            });
        }

    }


    // setValueToDescription = (value, e) => {
    //     const {listCategoriesNoPaging} = this.props;
    //     let objectCatePicked = _.find(listCategoriesNoPaging.categories, {id: value}) || {};
    //     console.log(objectCatePicked.description);
    //     this.formRef.current.setFieldsValue({'description': objectCatePicked.description})
    // };

    onNameChange = event => {
        this.setState({
            name: event.target.value,
        });
    };

    onChangeAcceptTerm = (value) => {
        this.setState({
            isAcceptTerm: value.target.checked
        })
    };

    addItem = (id) => {
        const {name} = this.state;
        if (name) {
            if (!id) {
                message.error('Please choose site');
            } else {
                this.props.createShoptifyCollection(id, {name: name});
            }
        }
    };

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

    handleChangeSite = (value) => {
        if (value) {
            this.formRef.current.setFieldsValue({'categories': []});
            this.props.fetchAllShopifyCollections(value);
        }
    };

    onFinish = (values) => {

        const {btnType} = this.state;

        if (!values.site) {
            message.error('Please choose site')
        } else {
            const {data, editProduct, createProduct, syncProduct} = this.props;

            let imagesData = [];
            if (!data || (data && !data.id)) {
                imagesData = values.images.map(image => {
                    if (image.id && !image.response) {
                        return {
                            image: {
                                id: image.id
                            }
                        }
                    }
                    return {
                        image: {
                            id: image.response.id
                        }
                    }
                });
            }

            if (btnType === 'create' || btnType === 'createDraft') {
                if (this.state.isAcceptTerm) {
                    btnType === 'create' ? createProduct({
                        ...values,
                        site: {id: values.site},
                        images: imagesData
                    }) : createProduct({...values, site: {id: values.site}, images: imagesData, draft: true});

                } else {
                    message.warn('Please agree with our terms of service');
                }
            } else if (btnType === 'save' || btnType === 'saveDraft') {
                editProduct({...values, id: data.id, site: {id: values.site}})
            } else if (btnType === 'publish') {
                syncProduct(data.id);
            }
        }
    };

    onReset = () => {
        this.setState({}, () => {
            this.formRef.current.resetFields();
        });
    };

    normFile = e => {

        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
    };

    getDescription = () => {

        const {data} = this.props;
        const {listActiveProductTypes} = this.state;

        let result = '';

        if (data && data.id) {
            result = _.get(data, 'description', '');
        } else {

            if (listActiveProductTypes && listActiveProductTypes[0]) {

                result = listActiveProductTypes[0].description || '';


                if (listActiveProductTypes[0].category) {
                    result += listActiveProductTypes[0].category.description || '';
                }

            }
        }


        return result;


    };

    handleData = () => {
        const {data} = this.props;
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
                            "enable": false
                        }
                    })
                }
            });

            return {
                productTypes: obj
            }
        } else {
            return data;
        }
    };


    render() {

        const {listActiveProductTypes} = this.state;

        const {
            isShowProductType,
            visible,
            onClose,
            editLoading,
            createLoading,
            editError,
            createError,
            listShopifyCollections,
            listProductType,
            currentShoptifyCollection,
            onChangeShowProductType,
            listSitesNoPaging,
            searchProductType,
            syncLoading,
        } = this.props;

        const categoryOptions = listShopifyCollections.shopifyCollections.map(value => (
            <Option key={value.id} value={value.id}>{value.name}</Option>
        ));

        const props = {
            name: 'file',
            accept: '.png, .jpg, .tiff',
            multiple: false,
            action: `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/upload/image`,
            headers: {
                Authorization: `Bearer ${localStorage.id_token}`
            },
            listType: 'picture',
            onChange: (info) => {
                // console.log(info);
                const {status} = info.file;
                // if (status !== 'uploading') {
                //      console.log(info.file, info.fileList);
                // }
                if (status === 'done') {
                    // message.success(`Uploaded successfully!`);
                } else if (status === 'error') {
                    if (info.file.error && info.file.error.status === 401) {
                        localStorage.clear();
                        return window.location.href = '/login';
                    } else {
                        message.error(`Upload failed!`);
                    }
                }
            },
        };

        const data = this.handleData();
        return (
            <Drawer
                title={isShowProductType ? 'Choose Product Type' : `${data && data.id ? 'Edit' : 'Add New'} Product`}
                destroyOnClose
                width={isMobile ? '90%' : '86%'}
                onClose={() => {
                    this.setState({listActiveProductTypes: []}, () => {
                        onClose();
                        onChangeShowProductType()
                    });
                }}
                visible={visible}
                footer={
                    !isShowProductType && (
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Space>
                                {
                                    data && data.id && data.synced && (
                                        <Button
                                            type="primary"
                                            loading={editLoading}
                                            onClick={() => {
                                                this.setState({btnType: 'save'}, () => {
                                                    this.saveBtn.click();
                                                });
                                            }}
                                        >
                                            Save
                                        </Button>
                                    )
                                }

                                {
                                    data && data.id && !data.synced && (
                                        <>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    this.setState({btnType: 'publish'}, () => {
                                                        this.publishBtn.click();
                                                    });
                                                }}
                                                loading={syncLoading}
                                            >
                                                Publish
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    this.setState({btnType: 'saveDraft'}, () => {
                                                        this.saveDraftBtn.click();
                                                    });
                                                }}
                                                loading={editLoading}
                                            >
                                                Save Draft
                                            </Button>
                                        </>
                                    )
                                }

                                {
                                    (!data || (data && !data.id)) && (
                                        <>
                                            <Button
                                                type="primary"
                                                loading={createLoading}
                                                onClick={() => {
                                                    this.setState({btnType: 'create'}, () => {
                                                        this.createBtn.click();
                                                    });
                                                }}
                                            >
                                                Create New
                                            </Button>

                                            <Button
                                                type="primary"
                                                loading={editLoading}
                                                onClick={() => {
                                                    this.setState({btnType: 'createDraft'}, () => {
                                                        this.createDraftBtn.click();
                                                    });
                                                }}
                                            >
                                                Save Draft
                                            </Button>
                                        </>
                                    )
                                }
                                {data && data.id && (
                                    <Button
                                        // icon={<UndoOutlined/>}
                                        htmlType="button"
                                        onClick={this.onReset}
                                    >
                                        Reset
                                    </Button>
                                )}
                                <Button onClick={() => {
                                    this.setState({listActiveProductTypes: []}, () => {
                                        onClose();
                                        onChangeShowProductType()
                                    });
                                }} style={{marginRight: 8}}>
                                    Cancel
                                </Button>
                            </Space>
                        </div>
                    )
                }
            >
                {
                    (isShowProductType && (!data || !data.id)) ? (
                        <SelectProductTypes
                            onChangeShowProductType={onChangeShowProductType}
                            listActiveProductTypes={listActiveProductTypes}
                            onSelectCard={this.onSelectCard}
                            listProductType={listProductType}
                            searchProductType={searchProductType}
                        />
                    ) : (
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            onFinish={this.onFinish}
                            initialValues={{
                                'title': _.get(data, 'title', ''),
                                'description': this.getDescription(),
                                'categories': _.get(data, 'categories', []),
                                'tags': _.get(data, 'tags', []),
                                'images': _.get(data, 'images', []) === null ? [] : _.get(data, 'images', []),
                                'productTypes': _.get(data, 'productTypes', []),
                                'site': data && data.id ? _.get(data, 'site').id : localStorage.siteId,
                            }}
                        >
                            <Row gutter={24}>
                                <Col md={18} xs={24} style={{textAlign: 'left'}}>
                                    <Card
                                        title={
                                            <span>
                                    {
                                        (data && !data.id) ? (
                                            <>
                                                <BlockOutlined style={{marginRight: '5px'}}/>
                                                PRODUCTS MANAGER >
                                                <a onClick={() => {
                                                    this.props.onChangeShowProductType()
                                                }}>
                                                    &nbsp;SELECT PRODUCT TYPE&nbsp;
                                                </a>
                                                > INPUT PRODUCT DETAILS
                                            </>
                                        ) : (
                                            <>
                                                <BlockOutlined style={{marginRight: '5px'}}/>
                                                PRODUCTS MANAGER > EDIT INPUT PRODUCT DETAILS
                                            </>
                                        )
                                    }
                                    </span>
                                        }
                                        headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                                        // extra={
                                        //     <Button
                                        //         icon={<LeftCircleOutlined/>}
                                        //         size={isMobile ? 'small' : 'middle'}
                                        //         onClick={() => {
                                        //             this.setState({isShowProductType: true})
                                        //         }}
                                        //     >
                                        //         Choose Product Type
                                        //     </Button>
                                        // }
                                    >
                                        <Form.Item
                                            name="title"
                                            label="Title"
                                            rules={[{required: true, message: 'Please enter title'}]}

                                        >
                                            <Input placeholder="Enter title"/>
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, currentValues) => prevValues.variants !== currentValues.variants}
                                        >
                                            {({getFieldValue}) => {
                                                return <Form.Item
                                                    name="description"
                                                    label="Description"
                                                    rules={[{
                                                        required: true,
                                                        message: 'Please enter description'
                                                    }]}
                                                >
                                                    <CKEditor
                                                        name="description"
                                                        data={getFieldValue('description')}
                                                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                                        onChange={(evt) => this.formRef.current.setFieldsValue({'description': evt.editor.getData()})}
                                                        config={{
                                                            height: 350
                                                        }}
                                                    />
                                                </Form.Item>
                                            }}
                                        </Form.Item>
                                    </Card>
                                    <br/>
                                    <Card
                                        title='Images'
                                    >
                                        <Form.Item
                                            shouldUpdate={(prevValues, currentValues) => prevValues.images !== currentValues.images}
                                            noStyle
                                        >
                                            {({getFieldValue}) => {
                                                return <Form.Item
                                                    name="images"
                                                    valuePropName="file"
                                                    getValueFromEvent={this.normFile}
                                                    noStyle
                                                    rules={[{required: true, message: 'Please upload images'}]}
                                                >
                                                    <Upload.Dragger
                                                        {...props}
                                                        defaultFileList={
                                                            getFieldValue('images').map((image, index) => {
                                                                return {
                                                                    uid: index,
                                                                    response: {
                                                                        id: image.image ? image.image.id : image.id
                                                                    },
                                                                    url: image.image ? image.image.thumbUrl : image.thumbUrl,
                                                                    name: image.image ? image.image.fileName : image.fileName
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <p className="ant-upload-drag-icon">
                                                            <InboxOutlined/>
                                                        </p>
                                                        <p className="ant-upload-text">Click or drag file to
                                                            this area
                                                            to
                                                            upload</p>
                                                        <p className="ant-upload-hint">Support for a .PNG, .JPG, .TIFF
                                                            image.</p>
                                                    </Upload.Dragger>
                                                </Form.Item>
                                            }}
                                        </Form.Item>

                                    </Card>
                                    <br/>
                                    <ProductTypesDetail
                                        form={this.formRef}
                                        listActiveProductTypes={listActiveProductTypes}
                                        disableUpload={data && data.id}
                                    />
                                    <br/>
                                    {
                                        (!data || (data && !data.id)) && (
                                            <div style={{display: "flex"}}>
                                                <div style={{marginRight: 10}}>
                                                    <Checkbox onChange={this.onChangeAcceptTerm}/>
                                                </div>
                                                <div>
                                                    I certify that I own or license rights to all images I am
                                                    uploading
                                                    for
                                                    this
                                                    product.
                                                    I hereby forever release WC Fulfillment from any and all
                                                    trademark
                                                    or
                                                    copyright
                                                    infringement claims,
                                                    and I agree that I have read the Terms of Service
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        editError && (
                                            <Form.Item>
                                                <Alert message={CatchError[editError] || editError}
                                                       type="error" showIcon
                                                />
                                            </Form.Item>
                                        )
                                    }
                                    {
                                        createError && (
                                            <Form.Item>
                                                <Alert message={CatchError[createError] || createError}
                                                       type="error" showIcon
                                                />
                                            </Form.Item>
                                        )
                                    }

                                    <Form.Item style={{display: 'none'}}>
                                        <Row>
                                            <Col md={data ? 12 : 24} xs={data ? 12 : 24}>

                                                {
                                                    data && data.id && data.synced && (
                                                        <Button
                                                            ref={input => this.saveBtn = input}
                                                            // icon={<SaveOutlined/>}
                                                            type="primary"
                                                            loading={editLoading}
                                                            htmlType="submit"
                                                        >
                                                            Save
                                                        </Button>
                                                    )
                                                }

                                                {
                                                    data && data.id && !data.synced && (
                                                        <>
                                                            <Button
                                                                ref={input => this.publishBtn = input}
                                                                type="primary"
                                                                htmlType="submit"
                                                            >
                                                                Publish
                                                            </Button>
                                                            <Button
                                                                ref={input => this.saveDraftBtn = input}
                                                                type="primary"
                                                                htmlType="submit"
                                                            >
                                                                Save Draft
                                                            </Button>
                                                        </>
                                                    )
                                                }

                                                {
                                                    (!data || (data && !data.id)) && (
                                                        <>
                                                            <Button
                                                                ref={input => this.createBtn = input}
                                                                // icon={<SaveOutlined />}
                                                                type="primary"
                                                                htmlType="submit"
                                                            >
                                                                Create New
                                                            </Button>

                                                            <Button
                                                                ref={input => this.createDraftBtn = input}
                                                                type="primary"
                                                                htmlType="submit"
                                                            >
                                                                Save Draft
                                                            </Button>
                                                        </>
                                                    )
                                                }

                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col md={6} xs={24}>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => prevValues.site !== currentValues.site}>
                                        {({getFieldValue}) => {
                                            let currentSite = getFieldValue('site');
                                            return (
                                                <>
                                                    <Card
                                                        title='Site'
                                                        // size='small'
                                                    >
                                                        <Form.Item
                                                            name="site"
                                                            // rules={[{
                                                            //     message: 'Please select site',
                                                            // }]}

                                                        >
                                                            <Select
                                                                // value={this.state.siteId}
                                                                placeholder='Select site'
                                                                onChange={this.handleChangeSite}
                                                                disabled={data && data.id}
                                                            >
                                                                {
                                                                    listSitesNoPaging.sites.map(site => (
                                                                        <Option key={site.id}
                                                                                value={site.id}>{site.title}</Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    </Card>
                                                    {
                                                        currentSite
                                                        && _.find(listSitesNoPaging.sites, {id: currentSite})
                                                        && _.find(listSitesNoPaging.sites, {id: currentSite}).virtual === false
                                                        && (
                                                            <>
                                                                <br/>
                                                                <Card
                                                                    title='Categories'
                                                                    // size='small'
                                                                >
                                                                    <Form.Item
                                                                        name="categories"
                                                                        rules={[{
                                                                            // message: 'Please select category',
                                                                            type: 'array'
                                                                        }]}

                                                                    >
                                                                        <Select
                                                                            style={{width: '100%'}}
                                                                            placeholder="Select categories"
                                                                            mode='tags'
                                                                            loading={listShopifyCollections.loading}
                                                                            disabled={listShopifyCollections.loading || (data && data.id)}
                                                                            dropdownRender={menu => (
                                                                                <div>
                                                                                    {menu}
                                                                                    <Divider
                                                                                        style={{margin: '4px 0'}}/>
                                                                                    <div style={{
                                                                                        display: 'flex',
                                                                                        flexWrap: 'nowrap',
                                                                                        padding: 8
                                                                                    }}>
                                                                                        <Input
                                                                                            style={{flex: 'auto'}}
                                                                                            value={this.state.name}
                                                                                            onChange={this.onNameChange}
                                                                                        />
                                                                                        <Button
                                                                                            onClick={() => this.addItem(currentSite)}
                                                                                            loading={currentShoptifyCollection.loading}
                                                                                            icon={
                                                                                                <PlusOutlined/>}
                                                                                            type='link'
                                                                                        >
                                                                                            Add new
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        >
                                                                            {categoryOptions}
                                                                        </Select>
                                                                    </Form.Item>
                                                                </Card>
                                                                <br/>
                                                                <Card
                                                                    title='Tags'
                                                                    // size='small'
                                                                >
                                                                    <Row>
                                                                        <Form.Item
                                                                            name="tags"
                                                                            rules={[{
                                                                                // message: 'Please select tag',
                                                                                type: 'array'
                                                                            }]}
                                                                            style={{width: '100%'}}

                                                                        >
                                                                            <Select
                                                                                // onChange={this.onChange}
                                                                                mode="tags"
                                                                                style={{width: '100%'}}
                                                                                placeholder={'Enter tags'}
                                                                                disabled={data && data.id}
                                                                                // placeholder="Tags Mode"
                                                                            />
                                                                        </Form.Item>
                                                                    </Row>
                                                                </Card>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )
                }

            </Drawer>
        )
    }
}

export default EditProductDrawer;
