import React, {Component} from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Row,
    Switch,
    Modal,
    InputNumber,
    Collapse,
    Table,
    Tooltip,
    Space,
    Checkbox,
    Tabs,
    Upload,
    message,
} from "antd";
import * as _ from 'lodash';
import getImageUrl from "../../../core/util/getImageUrl";
import {
    DollarCircleOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
    PlusOutlined,
    FileImageOutlined
} from "@ant-design/icons";

// const {Option} = Select;
const {Panel} = Collapse;
const {TabPane} = Tabs;
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class VariantDetail extends Component {

    state = {
        selectedRowKeys: [],
        selectedRows: [],
        visible: false,
        showHeader: true,
        editType: '',
        loading: false
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRowKeys, selectedRows});
        if (selectedRows.length > 0) {
            this.setState({
                showHeader: false
            })
        } else {
            this.setState({
                showHeader: true
            })
        }
    };

    // onChangeFilter = (value, type, currentVariantDetails, productTypeSelected) => {
    //     const {form} = this.props;
    //     const currentProductTypes = form.current.getFieldValue('productTypes');
    //
    //     let obj = currentVariantDetails;
    //
    //     if (type === 'option1') {
    //         obj = _.filter(currentVariantDetails, {option1: value});
    //
    //     } else if (type === 'option2') {
    //         obj = _.filter(currentVariantDetails, {option2: value});
    //
    //     }
    //
    //     productTypeSelected.variantDetails = obj;
    //
    //     // form.current.setFieldsValue({'productTypes': currentProductTypes});
    //
    // };

    normFile = e => {
        // console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

        //  console.log(e);

        return e && e.file && e.file.response && {id: e.file.response.id};
    };

    normFile2 = e => {
        // console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

        //  console.log(e);

        return e && e.file && e.file.response && e.file.response.id;
    };

    onFinish = async (values, type) => {

        const {form} = this.props;
        const {selectedRows} = this.state;
        const currentProductTypes = form.current.getFieldValue('productTypes');
        const key = selectedRows[0].key.split('-');
        const idProductTypeSelected = key[0];

        let obj = _.find(currentProductTypes, {'productType': {id: idProductTypeSelected}});
        let {regularPrice, status, salePrice, image} = values;


        if (obj) {
            for (let i = 0; i < selectedRows.length; i++) {
                let key = selectedRows[i].key.split('-');
                if (obj.variantDetails[key[1]]) {
                    if (type === 'regular') {
                        obj.variantDetails[key[1]].regularPrice = regularPrice;
                    } else if (type === 'status') {
                        obj.variantDetails[key[1]].enable = status;
                    } else if (type === 'sale') {
                        obj.variantDetails[key[1]].salePrice = salePrice;
                    } else if (type === 'image') {
                        obj.variantDetails[key[1]].imageId = image.id;
                    }
                }
            }

            await form.current.setFieldsValue({'productTypes': currentProductTypes});
            await this.handleCancel();
        }
    };

    callback = (key) => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            showHeader: true
        })
    };


    render() {

        const {selectedRowKeys, selectedRows, editType, visible, showHeader} = this.state;
        const {disableUpload} = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const hasSelected = selectedRowKeys.length > 0;

        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
            </div>
        );

        const props = {
            name: 'file',
            accept: '.png, .jpg, .tiff',
            multiple: false,
            showUploadList: false,
            action: `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/upload/image`,
            headers: {
                Authorization: `Bearer ${localStorage.id_token}`
            },
            listType: 'picture-card',
            onChange: (info) => {
                // console.log(info);
                const {status} = info.file;
                if (status === 'uploading') {
                    this.setState({
                        loading: true
                    });
                    return;
                }
                if (status === 'done') {
                    this.setState({
                        loading: false
                    }, () => {
                        // this.props.form.current.setFieldsValue({''});
                        // message.success(`Uploaded successfully!`);
                    });
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
            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.productTypes !== currentValues.productTypes}>
                {({getFieldValue}) => {
                    return (
                        <Form.List name="productTypes">
                            {(fields) => {
                                return <>
                                    <Tabs onChange={this.callback} defaultActiveKey="0" animated={true}>
                                        {
                                            fields.map((field, i) => {
                                                return (
                                                    <TabPane
                                                        tab={getFieldValue('productTypes')[field.name].productType.title}
                                                        key={i}
                                                    >
                                                        <Card title='Variants'>
                                                            <Form.List name={[field.name, 'variantDetails']}>
                                                                {(fields2) => {

                                                                    let option1Type = null;
                                                                    let option2Type = null;

                                                                    const dataSource = fields2.map((field2, index) => {

                                                                        // console.log(getFieldValue('productTypes')[field.name]);

                                                                        // let idImage = null;
                                                                        let currentThumbUrl = getFieldValue('productTypes')[field.name].variantDetails[field2.name].imageId;
                                                                        // if (currentThumbUrl && currentThumbUrl.id) {
                                                                        //     if (currentThumbUrl.thumbUrl) {
                                                                        //         idImage = currentThumbUrl.thumbUrl;
                                                                        //     } else {
                                                                        //         idImage = currentThumbUrl;
                                                                        //     }
                                                                        // }
                                                                        let idImage = currentThumbUrl;

                                                                        // console.log(idImage);

                                                                        let currentVariantDetails = getFieldValue('productTypes')[field.name].variantDetails[field2.name];
                                                                        option1Type = currentVariantDetails.option1Type;
                                                                        option2Type = currentVariantDetails.option2Type;

                                                                        return {
                                                                            key: `${getFieldValue('productTypes')[field.name].productType.id}-${index}`,
                                                                            imageId: (
                                                                                <Form.Item
                                                                                    name={[field2.name, 'imageId']}
                                                                                    fieldKey={[field.fieldKey, 'imageId']}
                                                                                    style={{marginBottom: 0}}
                                                                                    valuePropName="file"
                                                                                    getValueFromEvent={this.normFile2}
                                                                                >
                                                                                    <Upload
                                                                                        className="productTypePrintFile-uploader"
                                                                                        disabled={disableUpload}
                                                                                        {...props}
                                                                                    >
                                                                                        {
                                                                                            idImage ?
                                                                                                <img
                                                                                                    src={getImageUrl(idImage)}
                                                                                                    alt='thumb'
                                                                                                    style={{width: '100%'}}
                                                                                                /> : uploadButton
                                                                                        }
                                                                                    </Upload>
                                                                                </Form.Item>
                                                                            ),
                                                                            option1Type: (
                                                                                <span>
                                                                                        {
                                                                                            currentVariantDetails.option1
                                                                                        }
                                                                                    </span>
                                                                            ),
                                                                            option2Type: (
                                                                                <span>
                                                                                        {
                                                                                            currentVariantDetails.option2
                                                                                        }
                                                                                    </span>
                                                                            ),
                                                                            baseCost: (
                                                                                <span>
                                                                                        {
                                                                                            `${getFieldValue('productTypes')[field.name].variantDetails[field2.name].baseCost}$`
                                                                                        }
                                                                                    </span>
                                                                            ),
                                                                            regularPrice: (
                                                                                <Form.Item
                                                                                    name={[field2.name, 'regularPrice']}
                                                                                    style={{marginBottom: 0}}
                                                                                >
                                                                                    <InputNumber
                                                                                        style={{width: '100%'}}
                                                                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                    />
                                                                                </Form.Item>
                                                                            ),
                                                                            salePrice: (
                                                                                <Form.Item
                                                                                    name={[field2.name, 'salePrice']}
                                                                                    style={{marginBottom: 0}}
                                                                                >
                                                                                    <InputNumber
                                                                                        style={{width: '100%'}}
                                                                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                    />
                                                                                </Form.Item>
                                                                            ),
                                                                            sku: (
                                                                                <span>
                                                                                        {
                                                                                            getFieldValue('productTypes')[field.name].variantDetails[field2.name].sku
                                                                                        }
                                                                                    </span>
                                                                            ),
                                                                            enable: (
                                                                                <Form.Item
                                                                                    name={[field2.name, 'enable']}
                                                                                    valuePropName="checked"
                                                                                    style={{marginBottom: 0}}
                                                                                >
                                                                                    <Switch
                                                                                        disabled={disableUpload}/>
                                                                                </Form.Item>
                                                                            ),
                                                                        }
                                                                    });
                                                                    const columns = [
                                                                        {
                                                                            title: 'Image',
                                                                            dataIndex: 'imageId',
                                                                            key: 'imageId',
                                                                        },
                                                                        {
                                                                            title: option1Type || '',
                                                                            dataIndex: 'option1Type',
                                                                            key: 'option1Type',
                                                                        },
                                                                        {
                                                                            title: option2Type || '',
                                                                            dataIndex: 'option2Type',
                                                                            key: 'option2Type',
                                                                        },
                                                                        {
                                                                            title: 'Base Cost',
                                                                            dataIndex: 'baseCost',
                                                                            key: 'baseCost',
                                                                        },
                                                                        {
                                                                            title: 'Regular Price',
                                                                            dataIndex: 'regularPrice',
                                                                            key: 'regularPrice',
                                                                        },
                                                                        {
                                                                            title: 'Sale Price',
                                                                            dataIndex: 'salePrice',
                                                                            key: 'salePrice',
                                                                        },
                                                                        {
                                                                            title: 'Variant SKU',
                                                                            dataIndex: 'sku',
                                                                            key: 'sku',
                                                                        },
                                                                        {
                                                                            title: 'Status',
                                                                            dataIndex: 'enable',
                                                                            key: 'enable',
                                                                        },
                                                                    ];
                                                                    return (
                                                                        <>
                                                                            {
                                                                                // (option1Type || option2Type) && (
                                                                                //     <Input.Group
                                                                                //         style={{marginBottom: 20}}
                                                                                //     >
                                                                                //         <Row gutter={24}>
                                                                                //             {
                                                                                //                 option1Type && (
                                                                                //                     <Col md={6}>
                                                                                //                         <Select
                                                                                //                             allowClear
                                                                                //                             style={{width: '100%'}}
                                                                                //                             placeholder={`Filter by ${option1Type}`}
                                                                                //                             onChange={(e) => this.onChangeFilter(e, 'option1', getFieldValue('productTypes')[field.name].variantDetails, getFieldValue('productTypes')[field.name])}
                                                                                //                         >
                                                                                //                             {
                                                                                //                                 _.uniqBy(getFieldValue('productTypes')[field.name].variantDetails, 'option1').map(data => {
                                                                                //                                     return (
                                                                                //                                         <Option
                                                                                //                                             key={data.option1}
                                                                                //                                             value={data.option1}
                                                                                //                                         >
                                                                                //                                             {data.option1}
                                                                                //                                         </Option>
                                                                                //                                     )
                                                                                //                                 })
                                                                                //                             }
                                                                                //                         </Select>
                                                                                //                     </Col>
                                                                                //                 )
                                                                                //             }
                                                                                //             {
                                                                                //                 option2Type && (
                                                                                //                     <Col md={6}>
                                                                                //                         <Select
                                                                                //                             allowClear
                                                                                //                             style={{width: '100%'}}
                                                                                //                             placeholder={`Filter by ${option2Type}`}
                                                                                //                             onChange={(e) => this.onChangeFilter(e, 'option2', getFieldValue('productTypes')[field.name].variantDetails)}
                                                                                //
                                                                                //                         >
                                                                                //                             {
                                                                                //                                 _.uniqBy(getFieldValue('productTypes')[field.name].variantDetails, 'option2').map(data => {
                                                                                //                                     return (
                                                                                //                                         <Option
                                                                                //                                             key={data.option2}
                                                                                //                                             value={data.option2}
                                                                                //                                         >
                                                                                //                                             {data.option2}
                                                                                //                                         </Option>
                                                                                //                                     )
                                                                                //                                 })
                                                                                //                             }
                                                                                //                         </Select>
                                                                                //                     </Col>
                                                                                //                 )
                                                                                //             }
                                                                                //         </Row>
                                                                                //     </Input.Group>
                                                                                // )
                                                                            }
                                                                            {
                                                                                hasSelected && (
                                                                                    <Space
                                                                                        style={{marginBottom: 16}}>
                                                                                        <Button
                                                                                            onClick={() => this.setState({
                                                                                                showHeader: true,
                                                                                                selectedRowKeys: []
                                                                                            })}
                                                                                        >
                                                                                            <Checkbox
                                                                                                indeterminate
                                                                                                style={{marginRight: 5}}
                                                                                            />
                                                                                            <span
                                                                                                style={{color: '#1890ff'}}>{selectedRowKeys.length} selected </span>
                                                                                        </Button>
                                                                                        {
                                                                                            !disableUpload && (
                                                                                                <Button
                                                                                                    icon={
                                                                                                        <FileImageOutlined/>}
                                                                                                    onClick={() => this.showModal('image')}
                                                                                                >
                                                                                                    Edit Image
                                                                                                </Button>
                                                                                            )
                                                                                        }
                                                                                        <Button
                                                                                            icon={
                                                                                                <DollarCircleOutlined/>}
                                                                                            onClick={() => this.showModal('regular')}
                                                                                        >
                                                                                            Edit Regular Price
                                                                                        </Button>
                                                                                        <Button
                                                                                            icon={
                                                                                                <DollarCircleOutlined/>}
                                                                                            onClick={() => this.showModal('sale')}
                                                                                        >
                                                                                            Edit Sale Price
                                                                                        </Button>
                                                                                        {
                                                                                            !disableUpload && (
                                                                                                <Button
                                                                                                    icon={
                                                                                                        <InfoCircleOutlined/>}
                                                                                                    onClick={() => this.showModal('status')}
                                                                                                >
                                                                                                    Edit status
                                                                                                </Button>
                                                                                            )
                                                                                        }
                                                                                    </Space>
                                                                                )
                                                                            }
                                                                            <Table
                                                                                dataSource={dataSource}
                                                                                columns={columns}
                                                                                pagination={false}
                                                                                showHeader={showHeader && selectedRows[0] && selectedRows[0].key.split('-')[0] === getFieldValue('productTypes')[field.name].productType.id}
                                                                                rowSelection={{
                                                                                    ...rowSelection,
                                                                                }}
                                                                            />
                                                                        </>
                                                                    )
                                                                }}
                                                            </Form.List>
                                                        </Card>
                                                    </TabPane>
                                                )
                                            })
                                        }
                                    </Tabs>
                                    <Modal
                                        title={
                                            editType === 'regular'
                                                ? 'Edit Regular Price'
                                                : editType === 'sale'
                                                ? 'Edit Sale Price'
                                                : editType === 'image'
                                                    ? 'Edit Image'
                                                    : 'Edit Status'
                                        }
                                        visible={visible}
                                        onOk={() => this.submitBtn.click()}
                                        onCancel={this.handleCancel}
                                    >
                                        {
                                            editType === 'regular' && (
                                                <Row>
                                                    <Col md={16}>
                                                        <Form
                                                            {...layout}
                                                            name={editType}
                                                            initialValues={{
                                                                regularPrice: 0,
                                                            }}
                                                            onFinish={(values) => this.onFinish(values, editType)}
                                                        >
                                                            <Form.Item
                                                                label="Regular Price"
                                                                name="regularPrice"
                                                                // rules={[{required: true, message: 'Please input your username!'}]}
                                                            >
                                                                <InputNumber
                                                                    style={{width: '100%'}}
                                                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item style={{display: 'none'}}>
                                                                <Button ref={input => this.submitBtn = input}
                                                                        htmlType="submit">
                                                                    Save
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            editType === 'status' && (
                                                <Row>
                                                    <Col md={14}>
                                                        <Form
                                                            name={editType}
                                                            initialValues={{
                                                                status: false,
                                                            }}
                                                            onFinish={(values) => this.onFinish(values, editType)}
                                                        >
                                                            <Form.Item
                                                                label="Status"
                                                                name="status"
                                                                valuePropName="checked"
                                                                // rules={[{required: true, message: 'Please input your username!'}]}
                                                            >
                                                                <Switch/>
                                                            </Form.Item>
                                                            <Form.Item style={{display: 'none'}}>
                                                                <Button ref={input => this.submitBtn = input}
                                                                        htmlType="submit">
                                                                    Save
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            editType === 'sale' && (
                                                <Row>
                                                    <Col md={16}>
                                                        <Form
                                                            {...layout}
                                                            name={editType}
                                                            initialValues={{
                                                                salePrice: 0
                                                            }}
                                                            onFinish={(values) => this.onFinish(values, editType)}
                                                        >
                                                            <Form.Item
                                                                label="Sale Price"
                                                                name="salePrice"
                                                                // rules={[{required: true, message: 'Please input your username!'}]}
                                                            >
                                                                <InputNumber
                                                                    style={{width: '100%'}}
                                                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item style={{display: 'none'}}>
                                                                <Button ref={input => this.submitBtn = input}
                                                                        htmlType="submit">
                                                                    Save
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            editType === 'image' && (
                                                <Row>
                                                    <Col md={16}>
                                                        <Form
                                                            {...layout}
                                                            name={editType}
                                                            initialValues={{
                                                                image: {id: ''}
                                                            }}
                                                            onFinish={(values) => this.onFinish(values, editType)}
                                                        >
                                                            <Form.Item
                                                                noStyle
                                                                shouldUpdate={(prevValues, currentValues) => prevValues.image !== currentValues.image}
                                                            >
                                                                {({getFieldValue}) => {
                                                                    let idImage = null;
                                                                    let currentImage = getFieldValue('image');
                                                                    if (currentImage && currentImage.id) {
                                                                        idImage = currentImage.id
                                                                    }
                                                                    return (
                                                                        <Form.Item
                                                                            name='image'
                                                                            style={{marginBottom: 0}}
                                                                            valuePropName="file"
                                                                            getValueFromEvent={this.normFile}
                                                                        >
                                                                            <Upload
                                                                                disabled={disableUpload}
                                                                                {...props}
                                                                            >
                                                                                {
                                                                                    idImage ?
                                                                                        <img
                                                                                            src={getImageUrl(idImage)}
                                                                                            alt='thumb'
                                                                                            style={{width: '100%'}}
                                                                                        /> : uploadButton
                                                                                }
                                                                            </Upload>
                                                                        </Form.Item>
                                                                    )
                                                                }}
                                                            </Form.Item>
                                                            <Form.Item style={{display: 'none'}}>
                                                                <Button ref={input => this.submitBtn = input}
                                                                        htmlType="submit">
                                                                    Save
                                                                </Button>
                                                            </Form.Item>

                                                        </Form>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                    </Modal>
                                </>
                            }}
                        </Form.List>
                    )
                }}
            </Form.Item>
        )
    }
}

VariantDetail.propTypes = {};

export default VariantDetail;
