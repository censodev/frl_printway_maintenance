import React, {Component} from 'react';
import {Button, Form} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import * as _ from 'lodash';
import CKEditor from "ckeditor4-react";

class ContentSetting extends Component {

    form = React.createRef();

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
                    ref={this.form}
                    layout="vertical"
                    onFinish={this.onFinish}
                    initialValues={{
                        SELLER_NEXT_LEVEL: _.get(data, 'SELLER_NEXT_LEVEL', ''),
                        PENDING_DESIGN_6_HOURS: _.get(data, 'PENDING_DESIGN_6_HOURS', ''),
                    }}
                >
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.PENDING_DESIGN_6_HOURS !== currentValues.PENDING_DESIGN_6_HOURS}
                    >
                        {({getFieldValue}) => {
                            return <Form.Item
                                name="SELLER_NEXT_LEVEL"
                                label="Content"
                                style={{fontWeight: 'bold'}}
                                // rules={[{required: true, message: 'Please enter amount'}]}
                            >
                                <CKEditor
                                    name="SELLER_NEXT_LEVEL"
                                    data={getFieldValue('SELLER_NEXT_LEVEL')}
                                    onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                    onChange={(evt) => this.form.current.setFieldsValue({'SELLER_NEXT_LEVEL': evt.editor.getData()})}
                                    config={{
                                        extraPlugins: 'justify',
                                    }}
                                />
                            </Form.Item>
                        }}
                    </Form.Item>
                    <br/>
                    <Form.Item>
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

                </Form>
            )
        )
    }

}

ContentSetting.propTypes = {};

export default ContentSetting;
