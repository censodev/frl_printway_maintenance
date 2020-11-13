import React, {Component} from 'react';
import {Button, Form, Row, Tabs, Card} from "antd";
import {SaveOutlined, FileTextOutlined} from "@ant-design/icons";
import * as _ from 'lodash';
import CKEditor from "ckeditor4-react";

const {TabPane} = Tabs;

class ContentSetting extends Component {

    formRef = React.createRef();

    handleData = () => {
        const {listContentSetting} = this.props;
        let data = {};
        listContentSetting
        && listContentSetting.settings.map(value => {
            return data[value.key] = value.value;
        });

        return data;
    };

    onFinish = (values) => {


        const {editContentSetting} = this.props;

        let dataToPost = Object.keys(values).map(key => ({
            key: key,
            value: values[key]
        }));

        editContentSetting(dataToPost);


    };

    render() {

        const data = this.handleData();
        const {editContentLoading} = this.props;


        return (
            !_.isEmpty(data) && (
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    onFinish={this.onFinish}
                    initialValues={{
                        PENDING_DESIGN_6_HOURS: _.get(data, 'PENDING_DESIGN_6_HOURS', ''),
                        PENDING_DESIGN_24_HOURS: _.get(data, 'PENDING_DESIGN_24_HOURS', ''),
                        PENDING_DESIGN_48_HOURS: _.get(data, 'PENDING_DESIGN_48_HOURS', ''),
                        PENDING_DESIGN_72_HOURS: _.get(data, 'PENDING_DESIGN_72_HOURS', ''),
                        ACTION_REQUIRED_6_HOURS: _.get(data, 'ACTION_REQUIRED_6_HOURS', ''),
                        ACTION_REQUIRED_24_HOURS: _.get(data, 'ACTION_REQUIRED_24_HOURS', ''),
                        ACTION_REQUIRED_48_HOURS: _.get(data, 'ACTION_REQUIRED_48_HOURS', ''),
                        ACTION_REQUIRED_72_HOURS: _.get(data, 'ACTION_REQUIRED_72_HOURS', ''),
                        NEED_PAY_6_HOURS: _.get(data, 'NEED_PAY_6_HOURS', ''),
                        NEED_PAY_24_HOURS: _.get(data, 'NEED_PAY_24_HOURS', ''),
                        NEED_PAY_48_HOURS: _.get(data, 'NEED_PAY_48_HOURS', ''),
                        NEED_PAY_72_HOURS: _.get(data, 'NEED_PAY_72_HOURS', ''),
                    }}
                >

                    <Tabs defaultActiveKey="pendingDesign" tabPosition='left'>
                        <TabPane key={`pendingDesign`} tab='Pending Design'>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.PENDING_DESIGN_24_HOURS !== currentValues.PENDING_DESIGN_24_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="PENDING_DESIGN_6_HOURS"
                                        label="After 6 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="PENDING_DESIGN_6_HOURS"
                                            data={getFieldValue('PENDING_DESIGN_6_HOURS')}
                                            // onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'PENDING_DESIGN_6_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.PENDING_DESIGN_6_HOURS !== currentValues.PENDING_DESIGN_6_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="PENDING_DESIGN_24_HOURS"
                                        label="After 24 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="PENDING_DESIGN_24_HOURS"
                                            data={getFieldValue('PENDING_DESIGN_24_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'PENDING_DESIGN_24_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.PENDING_DESIGN_72_HOURS !== currentValues.PENDING_DESIGN_72_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="PENDING_DESIGN_48_HOURS"
                                        label="After 48 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="PENDING_DESIGN_48_HOURS"
                                            data={getFieldValue('PENDING_DESIGN_48_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'PENDING_DESIGN_48_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.PENDING_DESIGN_48_HOURS !== currentValues.PENDING_DESIGN_48_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="PENDING_DESIGN_72_HOURS"
                                        label="After 72 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="PENDING_DESIGN_72_HOURS"
                                            data={getFieldValue('PENDING_DESIGN_72_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'PENDING_DESIGN_72_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>

                        </TabPane>
                        <TabPane key={`actionRequired`} tab='Action Required'>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.ACTION_REQUIRED_24_HOURS !== currentValues.ACTION_REQUIRED_24_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="ACTION_REQUIRED_6_HOURS"
                                        label="After 6 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="ACTION_REQUIRED_6_HOURS"
                                            data={getFieldValue('ACTION_REQUIRED_6_HOURS')}
                                            // onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'ACTION_REQUIRED_6_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.ACTION_REQUIRED_6_HOURS !== currentValues.ACTION_REQUIRED_6_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="ACTION_REQUIRED_24_HOURS"
                                        label="After 24 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="ACTION_REQUIRED_24_HOURS"
                                            data={getFieldValue('ACTION_REQUIRED_24_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'ACTION_REQUIRED_24_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.ACTION_REQUIRED_72_HOURS !== currentValues.ACTION_REQUIRED_72_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="ACTION_REQUIRED_48_HOURS"
                                        label="After 48 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="ACTION_REQUIRED_48_HOURS"
                                            data={getFieldValue('ACTION_REQUIRED_48_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'ACTION_REQUIRED_48_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.ACTION_REQUIRED_48_HOURS !== currentValues.ACTION_REQUIRED_48_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="ACTION_REQUIRED_72_HOURS"
                                        label="After 72 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="ACTION_REQUIRED_72_HOURS"
                                            data={getFieldValue('ACTION_REQUIRED_72_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'ACTION_REQUIRED_72_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>

                        </TabPane>
                        <TabPane key={`NeedPay`} tab='Need Pay'>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.NEED_PAY_24_HOURS !== currentValues.NEED_PAY_24_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="NEED_PAY_6_HOURS"
                                        label="After 6 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="NEED_PAY_6_HOURS"
                                            data={getFieldValue('NEED_PAY_6_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'NEED_PAY_6_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.NEED_PAY_6_HOURS !== currentValues.NEED_PAY_6_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="NEED_PAY_24_HOURS"
                                        label="After 24 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="NEED_PAY_24_HOURS"
                                            data={getFieldValue('NEED_PAY_24_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'NEED_PAY_24_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.NEED_PAY_72_HOURS !== currentValues.NEED_PAY_72_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="NEED_PAY_48_HOURS"
                                        label="After 48 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="NEED_PAY_48_HOURS"
                                            data={getFieldValue('NEED_PAY_48_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'NEED_PAY_48_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>
                            <br/>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.NEED_PAY_48_HOURS !== currentValues.NEED_PAY_48_HOURS}
                            >
                                {({getFieldValue}) => {
                                    return <Form.Item
                                        name="NEED_PAY_72_HOURS"
                                        label="After 72 hours"
                                        style={{fontWeight:'bold'}}
                                        // rules={[{required: true, message: 'Please enter amount'}]}
                                    >
                                        <CKEditor
                                            name="NEED_PAY_72_HOURS"
                                            data={getFieldValue('NEED_PAY_72_HOURS')}
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            onChange={(evt) => this.formRef.current.setFieldsValue({'NEED_PAY_72_HOURS': evt.editor.getData()})}
                                            config={{
                                                extraPlugins: 'justify',
                                            }}
                                        />
                                    </Form.Item>
                                }}
                            </Form.Item>

                        </TabPane>
                    </Tabs>
                    <br/>
                    <Row style={{marginLeft: 180}}>
                        <Form.Item style={{width: '100%'}}>
                            <Button
                                icon={<SaveOutlined/>}
                                type="primary"
                                htmlType="submit"
                                block
                                loading={editContentLoading}
                            >
                                Save
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            )
        )

    }

}

ContentSetting.propTypes = {};

export default ContentSetting;
