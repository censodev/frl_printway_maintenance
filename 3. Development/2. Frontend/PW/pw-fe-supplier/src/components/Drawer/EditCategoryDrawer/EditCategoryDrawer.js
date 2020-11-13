import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import CKEditor from 'ckeditor4-react';
import {Drawer, Button, Form, Row, Col, Input, Alert, message} from 'antd';
import {SaveOutlined, UndoOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import CatchError from "../../../core/util/CatchError";


class EditCategoryDrawer extends Component {

    formRef = React.createRef();


    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editSuccess,
            createSuccess,
            onClose,
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

    onFinish = (values) => {
        const {data, editCategory, createCategory} = this.props;

        console.log(values);

        if (data) {
            // edit
            editCategory({
                id: data.id,
                name: values.name,
                description: values.description,
            });
        } else {
            // create
            createCategory({
                name: values.name,
                description: values.description,
            });
        }
    };

    onReset = () => {
        this.formRef.current.resetFields();
    };

    render() {

        const {
            visible,
            onClose,
            editLoading,
            data,
            editError,
            createError,
            createLoading
        } = this.props;

        console.log(data);

        return (
            <Drawer
                title={`${data ? 'Edit' : 'Add New'} Category`}
                destroyOnClose
                width={isMobile ? 360 : 626}
                onClose={onClose}
                visible={visible}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onClose} style={{marginRight: 8}}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <Row gutter={24}>
                    <Col md={24} xs={24} style={{textAlign: 'left'}}>
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            hideRequiredMark
                            onFinish={this.onFinish}
                            initialValues={{
                                'name': _.get(data, 'name', ''),
                                'description': _.get(data, 'description', ''),
                                'id': _.get(data, 'id', ''),
                            }}
                        >
                            <Form.Item
                                name="name"
                                label="Title"
                                rules={[{required: true, message: 'Please enter title'}]}

                            >
                                <Input placeholder="Enter title"/>
                            </Form.Item>
                            {/*<Form.Item*/}
                            {/*    name="description"*/}
                            {/*    label="Description"*/}
                            {/*    // rules={[{required: true, message: 'Please enter amount'}]}*/}
                            {/*>*/}
                            {/*    <CKEditor*/}
                            {/*        name="description"*/}
                            {/*        data={(props) => {*/}
                            {/*            return console.log(props)*/}
                            {/*        }}*/}
                            {/*        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}*/}
                            {/*        onChange={(evt) => this.formRef.current.setFieldsValue({'description': evt.editor.getData()})}*/}
                            {/*    />*/}
                            {/*</Form.Item>*/}

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.name !== currentValues.name}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="description"
                                        label="Description"
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="description"
                                            data={getFieldValue('description')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'description': evt.editor.getData()})}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>

                            {
                                editError && (
                                    <Row>
                                        <Col span={24}>
                                            <Alert message={CatchError[editError] || editError}
                                                   type="error" showIcon
                                                   style={{marginTop: '20px'}}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }
                            {
                                createError && (
                                    <Row>
                                        <Col span={24}>
                                            <Alert message={CatchError[createError] || createError}
                                                   type="error" showIcon style={{marginTop: '20px'}}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }
                            <Form.Item style={{marginTop: '40px'}}>
                                <Row>
                                    <Col md={12} xs={12}>
                                        <Button icon={<SaveOutlined/>} type="primary" htmlType="submit"
                                                style={{width: '90%'}}
                                                loading={editLoading || createLoading}>
                                            {data ? 'Save' : 'Add'}
                                        </Button>
                                    </Col>
                                    <Col md={12} xs={12} style={{textAlign: 'right'}}>
                                        <Button icon={<UndoOutlined/>} style={{width: '90%'}} htmlType="button"
                                                onClick={this.onReset}>
                                            Reset
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Drawer>
        );
    }
}

export default EditCategoryDrawer;
