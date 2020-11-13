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
    InputNumber,
    Radio
} from 'antd';
import {
    SaveOutlined,
    UndoOutlined,
    InboxOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import * as _ from 'lodash';
import CatchError from "../../../core/util/CatchError";
import CKEditor from "ckeditor4-react";
import Variants from './Variants';
import VariantDetails from './VariantDetails';
import PrintFiles from './PrintFiles';
import allPossibleCases from "../../../core/util/allPossibleCases";

const {Option} = Select;


class EditProductTypeDrawer extends Component {

    formRef = React.createRef();

    state = {};

    UNSAFE_componentWillReceiveProps(nextProps) {

        if (!this.formRef.current) {
            this.formRef = React.createRef();
        }

        const {
            editSuccess,
            onClose,
            createSuccess,
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
            nextProps.createSuccess === true
            && nextProps.createSuccess !== createSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                window.location.reload()
            });
        }

    }


    // setValueToDescription = (value, e) => {
    //     const {listCategoriesNoPaging} = this.props;
    //     let objectCatePicked = _.find(listCategoriesNoPaging.categories, {id: value}) || {};
    //     // console.log(objectCatePicked.description);
    //     this.formRef.current.setFieldsValue({'description': objectCatePicked.description})
    // };

    onFinish = (values) => {


        let dataToPost = {};

        dataToPost.category = {
            id: values.category
        };

        let suppliersData = values.suppliers.map(value => {
            return {id: value};
        });

        dataToPost.suppliers = suppliersData;

        let carriersData = values.carriers.map(id => {
            return {
                carrier: {
                    id: id
                },
                cost: this.getCostValue(id)
            };
        });

        dataToPost.carriers = carriersData;


        let imagesData = values.images.map(image => {
            if (image.id && !image.response) {
                return {
                    id: image.id,
                }
            }
            return {
                id: image.response.id,
            }
        });

        dataToPost.images = imagesData;

        dataToPost.variants = values.variants || [];

        dataToPost.variantDetails = values.variantDetails;

        dataToPost.defaultCarrier = {
            id: values.defaultCarrier
        };

        dataToPost.include = values.include === 'include';

        // console.log({...values, ...dataToPost});

        const {data, editProductType, createProductType} = this.props;

        if (values.images && values.images.length === 0) {
            message.error('Mockup Images is required!')
        } else {

            if (data && data.id) {
                editProductType({...values, ...dataToPost, id: data.id})
            } else {
                createProductType({...values, ...dataToPost});
            }
        }
    };

    onFinishFailed = errorInfo => {
        if (errorInfo && errorInfo.errorFields && Array.isArray(errorInfo.errorFields) && errorInfo.errorFields.length > 0) {
            message.error('Please complete all required fields!')
        }
    };

    getCostValue = (id) => {

        const currentCost = this.formRef.current.getFieldValue('cost');

        let obj = _.find(currentCost, {id: id});
        if (obj) {
            return obj.amount
        } else {
            return 0
        }

    };

    onReset = () => {
        this.setState({}, () => {
            this.formRef.current.resetFields();
        });
    };

    onChangeCost = (value, id) => {

        const currentCost = this.formRef.current.getFieldValue('cost');
        let obj = _.find(currentCost, {id: id});

        if (obj) {
            obj.amount = value;
        }

        this.formRef.current.setFieldsValue({'cost': currentCost});
    };

    handleData = () => {
        const {data} = this.props;

        let result = _.get(data, 'carriers', []).map(value => ({
            id: value.carrier.id || '',
            amount: value.cost || 0
        }));

        if (data) {
            data.cost = result;
        }

        // console.log(data);

        return data;

    };

    normFile = e => {

        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
    };

    onChange = () => {
        const form = this.formRef;
        let currentVariants = form.current.getFieldValue('variants');
        let variantDetail = [];
        let array = [];


        if (currentVariants && currentVariants.length > 0) {

            let listSupplierCosts = form.current.getFieldValue('suppliers').map(value => {
                return {
                    supplier: {
                        id: value,
                    },
                    cost: 0,
                };
            });

            let sku = form.current.getFieldValue('sku');


            if (currentVariants[0] && currentVariants[0].name && currentVariants[0].options.length > 0) {
                array = allPossibleCases([currentVariants[0].options]);

                if (currentVariants[1] && currentVariants[1].name && currentVariants[1].options.length > 0) {
                    array = allPossibleCases([currentVariants[0].options, currentVariants[1].options]);
                }

            }


            for (let j = 0; j < array.length; j++) {
                variantDetail.push(
                    {
                        "option1": array[j].split('|||')[0] || null,
                        "option2": array[j].split('|||')[1] || null,
                        "sku": sku ? `${sku}-${array[j].replace('|||', '-')}` : array[j].replace('|||', '-'),
                        "supplierCosts": [...listSupplierCosts],
                        "baseCost": 0,
                        "retailCost": 0,
                        "saleCost": 0,
                        "enable": true
                    }
                )
            }


            form.current.setFieldsValue({'variantDetails': variantDetail});


        }


    };


    render() {

        const {
            visible,
            onClose,
            editLoading,
            createLoading,
            editError,
            createError,
            listCategoriesNoPaging,
            listCarriesNoPaging,
            listSuppliersNoPaging,
            listCountries
        } = this.props;

        const data = this.handleData();

        const categoryOptions = listCategoriesNoPaging.categories.map(value => (
            <Option key={value.id} value={value.id}>{value.name}</Option>
        ));

        const supplierOptions = listSuppliersNoPaging.suppliers.map(value => (
            <Option
                key={value.id}
                value={value.id}
            >
                {`${value.lastName || ''} ${value.firstName || ''}`}
            </Option>
        ));

        const carrierOptions = listCarriesNoPaging.carries.map(value => (
            <Option key={value.id} value={value.id}>{value.name}</Option>
        ));

        const countryOptions = listCountries.countries.map(value => (
            <Option key={value} value={value}>{value}</Option>
        ));

        const props = {
            name: 'file',
            accept: '.png, .jpg, .tiff',
            multiple: true,
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

        return (
            <Drawer
                title={`${data && data.id ? 'Edit' : 'Add New'} Product Types`}
                destroyOnClose
                width={isMobile ? '90%' : '85%'}
                onClose={onClose}
                visible={visible}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Space>
                            <Button
                                onClick={() => this.submitBtn.click()}
                                icon={<SaveOutlined/>}
                                type="primary"
                                htmlType="submit"
                                loading={editLoading || createLoading}
                            >
                                {data && data.id ? 'Save' : 'Add'}
                            </Button>
                            {data && data.id && (
                                <Button
                                    icon={<UndoOutlined/>}
                                    htmlType="button"
                                    onClick={this.onReset}
                                >
                                    Reset
                                </Button>
                            )}
                            <Button onClick={onClose} style={{marginRight: 8}}>
                                Cancel
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    initialValues={{
                        'title': _.get(data, 'title', ''),
                        'sku': _.get(data, 'sku', ''),
                        'description': _.get(data, 'description', ''),
                        'priority': _.get(data, 'priority', 0),
                        'suppliers': _.get(data, 'suppliers', []).map(value => value.id),
                        'category': _.get(data, 'category', '').id,
                        'carriers': _.get(data, 'carriers', []).map(value => value.carrier.id),
                        'defaultCarrier': _.get(data, 'defaultCarrier', {}).id,
                        'images': _.get(data, 'images', []) === null ? [] : _.get(data, 'images', []),
                        'countries': _.get(data, 'countries', []),
                        'include': data && data.id ? (_.get(data, 'include') === true ? 'include' : 'exclude') : 'exclude',
                        'cost': _.get(data, 'cost', []),
                        'variants': _.get(data, 'variants', [
                            {
                                "name": "",
                                "options": []
                            },
                        ]),
                        'variantDetails': _.get(data, 'variantDetails', []),
                        'printFileFormats': _.get(data, 'printFileFormats', [{
                            thumb: null,
                            name: '',
                            width: 1,
                            height: 1,
                            note: '',
                        }]),
                    }}
                >
                    <Row gutter={24}>
                        <Col md={18} xs={24} style={{textAlign: 'left'}}>
                            <Card
                                title='Detail'
                                // size='small'
                            >
                                <Form.Item
                                    name="title"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Title</span>}
                                    rules={[{required: true, message: 'Please enter title'}]}

                                >
                                    <Input placeholder="Enter title"/>
                                </Form.Item>
                                <Form.Item
                                    name="sku"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>SKU</span>}
                                    rules={[{required: true, message: 'Please enter sku'}]}
                                >
                                    <Input onChange={this.onChange} placeholder="Enter title" disabled={data && data.id}/>
                                </Form.Item>
                                <Form.Item
                                    name="priority"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Priority</span>}
                                    // rules={[{required: true, message: 'Please enter sku'}]}

                                >
                                    <InputNumber placeholder="Enter number" style={{width: '100%'}}/>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
                                >
                                    {({getFieldValue}) => {
                                        return <Form.Item
                                            name="description"
                                            label={<span style={{fontFamily: 'Poppins-Medium'}}>Description</span>}
                                            // rules={[{required: true, message: 'Please enter description'}]}
                                        >
                                            <CKEditor
                                                name="description"
                                                data={getFieldValue('description')}
                                                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                                onChange={(evt) => this.formRef.current.setFieldsValue({'description': evt.editor.getData()})}
                                                config={{
                                                    height: 350,
                                                    extraPlugins: 'justify',
                                                }}
                                            />
                                        </Form.Item>
                                    }}
                                </Form.Item>
                            </Card>
                            <br/>
                            <Card
                                title='Mockup Images'
                                // size='small'
                                // extra={
                                //     <Button onClick={() => this.addImgBtn.click()}>
                                //         <UploadOutlined/> Click to Upload
                                //     </Button>
                                // }
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
                                        >
                                            <Upload.Dragger
                                                {...props}
                                                defaultFileList={
                                                    getFieldValue('images').map((image, index) => {
                                                        return {
                                                            uid: index,
                                                            response: {
                                                                id: image.id
                                                            },
                                                            url: image.thumbUrl,
                                                            name: image.fileName || ''
                                                        }
                                                    })
                                                }
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined/>
                                                </p>
                                                <p className="ant-upload-text">Click or drag file to this area to
                                                    upload</p>
                                                <p className="ant-upload-hint">Support for a .PNG, .JPG, .TIFF image.</p>
                                            </Upload.Dragger>
                                        </Form.Item>
                                    }}
                                </Form.Item>

                            </Card>
                            <br/>
                            <Variants form={this.formRef}  disableField={data && data.id}/>
                            <br/>
                            <VariantDetails
                                listSuppliersNoPaging={listSuppliersNoPaging}
                                form={this.formRef}
                                disableField={data && data.id}
                            />
                            <br/>
                            <PrintFiles form={this.formRef}/>
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
                                        <Button
                                            ref={input => this.submitBtn = input}
                                            htmlType="submit"
                                        >
                                            {data ? 'Save' : 'Add'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col md={6} xs={24}>
                            <Card
                                title='Suppliers'
                                // size='small'
                            >
                                <Form.Item
                                    name="suppliers"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Suppliers</span>}
                                    rules={[{required: true, message: 'Please select supplier', type: 'array'}]}

                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Please select supplier"
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={this.onChange}
                                    >
                                        {supplierOptions}
                                    </Select>
                                </Form.Item>
                            </Card>
                            <br/>
                            <Card
                                title='Carrier'
                                // size='small'
                            >
                                <Row>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => prevValues.carriers !== currentValues.carriers}
                                    >
                                        {({getFieldValue}) => {
                                            return (
                                                <Form.Item
                                                    name="carriers"
                                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Carriers</span>}
                                                    rules={[{
                                                        required: true,
                                                        message: 'Please select carrier',
                                                        type: 'array'
                                                    }]}
                                                    style={{width: '100%'}}

                                                >
                                                    <Select
                                                        mode="multiple"
                                                        placeholder="Please select carrier"
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        onDeselect={(id) => {
                                                            const currentCost = getFieldValue('cost');
                                                            const currentDefaultCarrier = getFieldValue('defaultCarrier');
                                                            if (currentDefaultCarrier === id) {
                                                                this.formRef.current.setFieldsValue({'defaultCarrier': null})
                                                            }
                                                            _.remove(currentCost, {id: id});
                                                            this.formRef.current.setFieldsValue({'cost': currentCost})
                                                        }}
                                                        onChange={() => {
                                                            const currentCost = getFieldValue('cost');
                                                            const currentCarriers = getFieldValue('carriers');
                                                            currentCarriers.map(value => {
                                                                if (!_.find(currentCost, {id: value})) {
                                                                    return currentCost.push({
                                                                        id: value,
                                                                        amount: 0
                                                                    })
                                                                }
                                                                return null;
                                                            });

                                                            this.formRef.current.setFieldsValue({'cost': currentCost})

                                                            if (!data || (data && !data.id)) {
                                                                const currentCarriers = getFieldValue('carriers');

                                                                if (currentCarriers.length === 1) {
                                                                    this.formRef.current.setFieldsValue({'defaultCarrier': currentCarriers[0]});
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {carrierOptions}
                                                    </Select>
                                                </Form.Item>
                                            )
                                        }}
                                    </Form.Item>
                                </Row>

                                <Row gutter={24}>
                                    <Col md={12}>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, currentValues) => prevValues.carriers !== currentValues.carriers}
                                        >
                                            {({getFieldValue}) => {
                                                return (
                                                    <Form.Item
                                                        name="defaultCarrier"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Please choose default carrier'
                                                        }]}
                                                    >
                                                        <Radio.Group>
                                                            {
                                                                getFieldValue('carriers').map(value => {

                                                                    return (
                                                                        <Row key={value} style={{height: 42}}>
                                                                            <Radio value={value} style={{fontSize:'.75rem'}}>
                                                                                {_.find(listCarriesNoPaging.carries, {id: value}).name || ''}
                                                                            </Radio>
                                                                        </Row>
                                                                    )
                                                                })
                                                            }
                                                        </Radio.Group>
                                                    </Form.Item>
                                                )
                                            }}
                                        </Form.Item>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, currentValues) => prevValues.carriers !== currentValues.carriers}
                                        >
                                            {({getFieldValue}) => {

                                                // console.log('aa', getFieldValue('cost'));

                                                return getFieldValue('cost').map(value => {
                                                    return (
                                                        <Row key={value.id}
                                                             style={{marginBottom: '10px', textAlign: 'right'}}>
                                                            <InputNumber
                                                                style={{width: '100%'}}
                                                                defaultValue={value.amount}
                                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                onChange={(e) => this.onChangeCost(e, value.id)}
                                                            />
                                                        </Row>
                                                    )
                                                })

                                            }}

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <br/>
                            <Card
                                title='Category'
                                // size='small'
                            >
                                <Form.Item
                                    name="category"
                                    label={<span style={{fontFamily: 'Poppins-Medium'}}>Category</span>}
                                    rules={[{required: true, message: 'Please select Category',}]}

                                >
                                    <Select
                                        placeholder="Please select category"
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {categoryOptions}
                                    </Select>
                                </Form.Item>
                            </Card>
                            <br/>
                            <Card
                                title='Shipping Country'
                                // size='small'
                            >

                                <Input.Group compact>
                                    <Form.Item
                                        name="include"
                                        style={{width: '40%'}}
                                    >
                                        <Select>
                                            <Option value="include"><PlusCircleOutlined/> Include</Option>
                                            <Option value="exclude"><MinusCircleOutlined/> Exclude</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="countries"
                                        rules={[{type: 'array'}]}
                                        style={{width: '60%'}}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Select countries"
                                            showSearch
                                            allowClear
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {countryOptions}
                                        </Select>
                                    </Form.Item>
                                </Input.Group>

                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        )
    }
}

export default EditProductTypeDrawer;
