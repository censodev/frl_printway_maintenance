import React, {Component} from 'react';
import {Button, Card, Col, Collapse, Divider, Form, Input, InputNumber, message, Row, Modal, Upload} from "antd";
import {MinusCircleOutlined, PlusOutlined, LoadingOutlined} from "@ant-design/icons";
import cls from "./style.module.less";
import getImageUrl from "../../../core/util/getImageUrl";

const {Panel} = Collapse;

class PrintFiles extends Component {

    state = {
        loading: false,
    };

    normFile = e => {
        // console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

       //  console.log(e);

        return e && e.file && e.file.response && {id: e.file.response.id};
    };

    render() {

        const props = {
            name: 'file',
            accept: '.png',
            multiple: false,
            showUploadList: false,
            action: `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/upload/image`,
            headers: {
                Authorization: `Bearer ${localStorage.id_token}`
            },
            listType: 'picture-card',
            // className: 'upload-list-inline',
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
                        message.success(`Uploaded successfully!`);
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
                {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <Card
                title='Print File'
                extra={
                    <Button onClick={() => this.addFileBtn && this.addFileBtn.click()} type='link'>
                        <PlusOutlined/> Add Mockup
                    </Button>
                }
            >
                <Row className={cls.headerVariants}>
                    <Col md={3} style={{paddingLeft: '8px'}}>Mockup</Col>
                    <Col md={6} style={{paddingLeft: '8px'}}>Name</Col>
                    <Col md={7} style={{paddingLeft: '12px'}}>Size</Col>
                    <Col md={6} style={{paddingLeft: '12px'}}>Note</Col>
                    <Col md={2}/>
                </Row>
                {
                    <Collapse defaultActiveKey={['1']} expandIconPosition='right' bordered={false}
                              style={{backgroundColor: 'white'}}>
                        <Panel
                            key="1"
                            style={{borderBottom: 'none'}}
                        >
                            <Form.List name="printFileFormats">
                                {(fields, {add, remove}) => {
                                    return (
                                        <div>
                                            {fields.map(field => {
                                                // console.log(getFieldValue('printFileFormats')[field.name]);
                                                return (
                                                    <div key={field.key}>
                                                        <Row gutter={24}>
                                                            <Col md={3}>
                                                                <Form.Item
                                                                    noStyle
                                                                    shouldUpdate={(prevValues, currentValues) => prevValues.printFileFormats !== currentValues.printFileFormats}
                                                                >
                                                                    {
                                                                        ({getFieldValue}) => {
                                                                            let idImage = null;
                                                                            let currentThumbUrl = getFieldValue('printFileFormats')[field.name].thumb;
                                                                            if (currentThumbUrl && currentThumbUrl.id) {
                                                                                if (currentThumbUrl.thumbUrl) {
                                                                                    idImage = currentThumbUrl.thumbUrl;
                                                                                } else {
                                                                                    idImage = currentThumbUrl.id;
                                                                                }
                                                                            }

                                                                            return (
                                                                                <Form.Item
                                                                                    name={[field.name, 'thumb']}
                                                                                    fieldKey={[field.fieldKey, 'thumb']}
                                                                                    // rules={[{
                                                                                    //     required: true,
                                                                                    //     message: 'Missing thumb'
                                                                                    // }]}
                                                                                    style={{marginBottom: 0}}
                                                                                    valuePropName="file"
                                                                                    getValueFromEvent={this.normFile}
                                                                                >
                                                                                    <Upload
                                                                                        className="productTypePrintFile-uploader"
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
                                                                        }
                                                                    }
                                                                </Form.Item>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Item
                                                                    name={[field.name, 'name']}
                                                                    fieldKey={[field.fieldKey, 'name']}
                                                                    rules={[{required: true, message: 'Missing name'}]}
                                                                    // style={{marginBottom: 0, marginTop: '15px'}}
                                                                >
                                                                    <Input/>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col md={7}>
                                                                <Row>
                                                                    <Col md={11}>
                                                                        <Form.Item
                                                                            name={[field.name, 'width']}
                                                                            fieldKey={[field.fieldKey, 'width']}
                                                                            rules={[{
                                                                                required: true,
                                                                                message: 'Missing width',
                                                                            }]}
                                                                            // style={{marginBottom: 0, marginTop: '15px'}}
                                                                        >
                                                                            <InputNumber
                                                                                style={{width: '100%'}}
                                                                                placeholder='width'
                                                                                min={1}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col md={2} style={{
                                                                        textAlign: 'center',
                                                                        marginTop: '4px'
                                                                    }}>
                                                                        /
                                                                    </Col>
                                                                    <Col md={11}>
                                                                        <Form.Item
                                                                            name={[field.name, 'height']}
                                                                            fieldKey={[field.fieldKey, 'height']}
                                                                            rules={[{
                                                                                required: true,
                                                                                message: 'Missing height',
                                                                            }]}
                                                                            // style={{marginBottom: 0, marginTop: '15px'}}
                                                                        >
                                                                            <InputNumber
                                                                                style={{width: '100%'}}
                                                                                placeholder='height'
                                                                                min={1}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Item
                                                                    name={[field.name, 'note']}
                                                                    fieldKey={[field.fieldKey, 'note']}
                                                                    // style={{marginBottom: 0, marginTop: '15px'}}
                                                                    // rules={[{required: true, message: 'Missing name'}]}
                                                                >
                                                                    <Input/>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col md={2}>
                                                                {
                                                                    fields.length > 1 && (
                                                                        <MinusCircleOutlined
                                                                            onClick={() => {
                                                                                remove(field.name);
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                        <Divider/>
                                                    </div>
                                                )
                                            })}
                                            {
                                                fields.length < 10 && (
                                                    <Form.Item>
                                                        <Button
                                                            ref={input => this.addFileBtn = input}
                                                            type="dashed"
                                                            onClick={() => {
                                                                add({
                                                                    thumb: {id: ''},
                                                                    name: '',
                                                                    width: 1,
                                                                    height: 1,
                                                                    note: '',
                                                                },);
                                                            }}
                                                            block
                                                        >
                                                            <PlusOutlined/> Add mockup
                                                        </Button>
                                                    </Form.Item>
                                                )
                                            }
                                        </div>
                                    );
                                }}
                            </Form.List>
                        </Panel>
                    </Collapse>
                }
            </Card>
        );
    }
}

PrintFiles.propTypes = {};

export default PrintFiles;
