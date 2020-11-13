import React, { Component } from 'react';
import {
    Drawer,
    Collapse,
    Button,
    Row,
    Form,
    Col,
    Upload,
    message, Space, Alert
} from 'antd';
import { isMobile } from 'react-device-detect';
import * as _ from "lodash";
import {
    LoadingOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import getImageUrl from "../../../core/util/getImageUrl";
import cls from './style.module.less';
import CatchError from "../../../core/util/CatchError";

const { Panel } = Collapse;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};


class EditPrintFilesDrawer extends Component {

    state = {
        loading: false
    };

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editPrintFilesSuccess,
            onClose,
        } = this.props;

        if (
            nextProps.editPrintFilesSuccess === true
            && nextProps.editPrintFilesSuccess !== editPrintFilesSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                window.location.reload()
            });
        }

    }

    normFile = e => {

        if (Array.isArray(e)) {
            return e;
        }

        return e && e.file && e.file.response && { id: e.file.response.id };
    };

    onFinish = (values) => {
        const { data, editPrintFiles } = this.props;
        if (data.id) {
            const dataToPost = {};
            let productTypeUpdates = values.productTypes.map(data => {
                return {
                    productTypeId: data.productType.id,
                    designUpdates: data.printFileImages.filter(file => {
                        if (file.image) return true;
                        return false;
                    }).map(value => {
                        return {
                            imageId: value.image.id,
                            sku: value.sku
                        }
                    })
                }
            });

            // console.log({...dataToPost, productTypeUpdates: productTypeUpdates, productId: data.id})
            editPrintFiles({ ...dataToPost, productTypeUpdates: productTypeUpdates, productId: data.id })
        }
    };

    render() {

        const { onClose, visible, data, editPrintFilesLoading, editPrintFilesError } = this.props;

        // console.log(data);

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

        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        // console.log(data);

        return (
            <Drawer
                title="View print designs"
                destroyOnClose
                width={isMobile ? 360 : 426}
                visible={visible}
                onClose={onClose}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Space>
                            <Button
                                onClick={() => this.submitBtn.click()}
                                icon={<SaveOutlined />} type="primary"
                                loading={editPrintFilesLoading}
                                htmlType="submit"
                            >
                                Save
                            </Button>
                            <Button onClick={() => {
                                onClose()
                            }} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form
                    {...layout}
                    name='upload'
                    initialValues={{
                        productTypes: _.get(data, 'productTypes', [])
                    }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.productTypes !== currentValues.productTypes}
                    >
                        {({ getFieldValue }) => {
                            return (
                                <Form.List name='productTypes'>
                                    {(fields) => {
                                        return (
                                            <Collapse
                                                defaultActiveKey={[0, 1, 2, 3, 4, 5]}
                                                expandIconPosition='right'
                                                bordered={false}
                                                style={{ backgroundColor: 'white' }}
                                            >
                                                {fields.map((field) => {
                                                    return (
                                                        <Panel
                                                            header={
                                                                (
                                                                    <span
                                                                        style={{ fontWeight: 600 }}
                                                                    >
                                                                        {getFieldValue('productTypes')[field.name].productType.title}
                                                                    </span>
                                                                )
                                                            }
                                                            key={field.name}
                                                        >
                                                            <Form.List name={[field.name, 'printFileImages']}>
                                                                {(fields2) => {
                                                                    return fields2.map((field2, i) => {
                                                                        let idImage = null;
                                                                        let currentPrintFile = getFieldValue('productTypes')[field.name].printFileImages[field2.name];
                                                                        let currentImage = currentPrintFile.image;
                                                                        if (currentImage && currentImage.id) {
                                                                            idImage = currentImage.id
                                                                        }
                                                                        return (
                                                                            <Row key={i}>
                                                                                <Col md={9}>
                                                                                    <Form.Item
                                                                                        name={[field2.name, 'image']}
                                                                                        fieldKey={[field2.fieldKey, 'image']}
                                                                                        style={{
                                                                                            marginBottom: i !== fields2.length - 1 ? 10 : 0,
                                                                                            width: '100%'
                                                                                        }}
                                                                                        valuePropName="file"
                                                                                        getValueFromEvent={this.normFile}
                                                                                    >
                                                                                        <Upload
                                                                                            className="productPrintFile-uploader"
                                                                                            {...props}
                                                                                        >
                                                                                            {
                                                                                                idImage ?
                                                                                                    <img
                                                                                                        src={getImageUrl(idImage)}
                                                                                                        alt='thumb'
                                                                                                        style={{ width: '100%' }}
                                                                                                    /> : uploadButton
                                                                                            }
                                                                                        </Upload>
                                                                                    </Form.Item>
                                                                                </Col>
                                                                                <Col md={15}
                                                                                    className={cls.des}>
                                                                                    {
                                                                                        currentPrintFile.name ?
                                                                                            <p style={{
                                                                                                fontSize: 17,
                                                                                                fontWeight: 500,
                                                                                                marginBottom: 5
                                                                                            }}>{currentPrintFile.name}</p> : ''
                                                                                    }
                                                                                    {
                                                                                        currentPrintFile.width && currentPrintFile.height ?
                                                                                            <p>{`${currentPrintFile.width}x${currentPrintFile.height}`}</p> : ''
                                                                                    }
                                                                                    {
                                                                                        currentPrintFile.note ?
                                                                                            <p>{currentPrintFile.note}</p> : ''
                                                                                    }
                                                                                    {
                                                                                        currentPrintFile.sku ?
                                                                                            <p>{`SKU: ${currentPrintFile.sku}`}</p> : ''
                                                                                    }
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    })
                                                                }}
                                                            </Form.List>
                                                        </Panel>
                                                    )
                                                })}

                                            </Collapse>
                                        )
                                    }}
                                </Form.List>
                            )
                        }}
                    </Form.Item>
                    {
                        editPrintFilesError && (
                            <Form.Item>
                                <Alert message={CatchError[editPrintFilesError] || editPrintFilesError}
                                    type="error" showIcon
                                />
                            </Form.Item>
                        )
                    }
                    <br />
                    <Form.Item style={{ display: 'none' }}>
                        <Button ref={input => this.submitBtn = input}
                            htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        )
    }
}

export default EditPrintFilesDrawer;
