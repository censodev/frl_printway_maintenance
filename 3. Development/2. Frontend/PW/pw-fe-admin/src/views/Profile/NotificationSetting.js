import React, {Component} from 'react';
import {Button, Checkbox, Col, Divider, Form, Row} from "antd";
import {SaveOutlined, MailOutlined} from "@ant-design/icons";
import * as _ from 'lodash';
// import mobile_ring from '../../assets/mobile_ring.png';
import cls from "./profile.module.less";

class NotificationSetting extends Component {

    formRef = React.createRef();

    handleData = () => {
        const {listNotificationSetting} = this.props;
        let data = {};
        listNotificationSetting
        && listNotificationSetting.settings.configs
        && listNotificationSetting.settings.configs.map(value => {
            return data[value.key] = JSON.parse(value.value.toLowerCase());
        });

        return data;
    };

    onFinish = (values) => {

        const {editNotificationSetting} = this.props;

        let dataToPost = Object.keys(values).map(key => ({
            key: key,
            value: values[key]
        }));

        editNotificationSetting(dataToPost);


    };

    render() {

        const data = this.handleData();
        const {editNotificationLoading} = this.props;

        if (!_.isEmpty(data)) {
            return (
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    onFinish={this.onFinish}
                    initialValues={{
                        NEWS_UPDATE_EMAIL: _.get(data, 'NEWS_UPDATE_EMAIL', false),
                        // NEWS_UPDATE_PUSH: _.get(data, 'NEWS_UPDATE_PUSH', false),
                        // ORDER_UPDATE_PROCESSING_EMAIL: _.get(data, 'ORDER_UPDATE_PROCESSING_EMAIL', false),
                        // ORDER_UPDATE_PROCESSING_PUSH: _.get(data, 'ORDER_UPDATE_PROCESSING_PUSH', false),
                        // ORDER_UPDATE_ON_HOLD_EMAIL: _.get(data, 'ORDER_UPDATE_ON_HOLD_EMAIL', false),
                        // ORDER_UPDATE_ON_HOLD_PUSH: _.get(data, 'ORDER_UPDATE_ON_HOLD_PUSH', false),
                        // ORDER_UPDATE_CANCEL_EMAIL: _.get(data, 'ORDER_UPDATE_CANCEL_EMAIL', false),
                        // ORDER_UPDATE_CANCEL_PUSH: _.get(data, 'ORDER_UPDATE_CANCEL_PUSH', false),
                        // ORDER_UPDATE_REFUND_EMAIL: _.get(data, 'ORDER_UPDATE_REFUND_EMAIL', false),
                        //  ORDER_UPDATE_REFUND_PUSH: _.get(data, 'ORDER_UPDATE_REFUND_PUSH', false),
                        BALANCE_UPDATE_EMAIL: _.get(data, 'BALANCE_UPDATE_EMAIL', false),
                        //BALANCE_UPDATE_PUSH: _.get(data, 'BALANCE_UPDATE_PUSH', false),
                    }}
                >

                    <Row gutter={24} style={{marginBottom: 20}}>
                        <Col md={16} xs={16}>

                        </Col>
                        <Col md={4} xs={4}>
                            <span><MailOutlined style={{marginRight: 5}}/>EMAIL</span>
                        </Col>
                        {/*<Col md={4} xs={4}>*/}
                        {/*    <span><img style={{width: 18, marginRight: 5}} src={mobile_ring}/>PUSH</span>*/}
                        {/*</Col>*/}
                    </Row>

                    <Row gutter={24}>
                        <Col md={16} xs={16}>
                            <p className={cls.title} style={{marginBottom: 5}}>News Updates</p>
                            <span>News, your level, promos, events, new features and the last product updates for you</span>
                        </Col>
                        <Col md={4} xs={4}>
                            <Form.Item
                                name="NEWS_UPDATE_EMAIL"
                                valuePropName="checked"
                            >
                                <Checkbox/>
                            </Form.Item>
                        </Col>
                        {/*<Col md={4} xs={4}>*/}
                        {/*    <Form.Item*/}
                        {/*        name="NEWS_UPDATE_PUSH"*/}
                        {/*        valuePropName="checked"*/}
                        {/*    >*/}
                        {/*        <Checkbox/>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                    </Row>

                    {/*<Divider/>*/}

                    {/*<Row>*/}
                    {/*    <p className={cls.title}>Order Updates</p>*/}
                    {/*</Row>*/}

                    {/*<Row gutter={24} style={{marginBottom: 20}}>*/}
                    {/*    <Col md={16} xs={16}>*/}
                    {/*        <p className={cls.subTitle}>Processing</p>*/}
                    {/*        <span>When the order status changes to “processing”</span>*/}
                    {/*    </Col>*/}
                    {/*    <Col md={4} xs={4}>*/}
                    {/*        <Form.Item*/}
                    {/*            name="ORDER_UPDATE_PROCESSING_EMAIL"*/}
                    {/*            valuePropName="checked"*/}
                    {/*        >*/}
                    {/*            <Checkbox/>*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col md={4} xs={4}>*!/*/}
                    {/*    /!*    <Form.Item*!/*/}
                    {/*    /!*        name="ORDER_UPDATE_PROCESSING_PUSH"*!/*/}
                    {/*    /!*        valuePropName="checked"*!/*/}
                    {/*    /!*    >*!/*/}
                    {/*    /!*        <Checkbox/>*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*</Row>*/}

                    {/*<Row gutter={24} style={{marginBottom: 20}}>*/}
                    {/*    <Col md={16} xs={16}>*/}
                    {/*        <p className={cls.subTitle}>On hold</p>*/}
                    {/*        <span>When the order status changes to “on hold”</span>*/}
                    {/*    </Col>*/}
                    {/*    <Col md={4} xs={4}>*/}
                    {/*        <Form.Item*/}
                    {/*            name="ORDER_UPDATE_ON_HOLD_EMAIL"*/}
                    {/*            valuePropName="checked"*/}
                    {/*        >*/}
                    {/*            <Checkbox/>*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col md={4} xs={4}>*!/*/}
                    {/*    /!*    <Form.Item*!/*/}
                    {/*    /!*        name="ORDER_UPDATE_ON_HOLD_PUSH"*!/*/}
                    {/*    /!*        valuePropName="checked"*!/*/}
                    {/*    /!*    >*!/*/}
                    {/*    /!*        <Checkbox/>*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*</Row>*/}

                    {/*<Row gutter={24} style={{marginBottom: 20}}>*/}
                    {/*    <Col md={16} xs={16}>*/}
                    {/*        <p className={cls.subTitle}>Cancel</p>*/}
                    {/*        <span>When the order status changes to “cancel”</span>*/}
                    {/*    </Col>*/}
                    {/*    <Col md={4} xs={4}>*/}
                    {/*        <Form.Item*/}
                    {/*            name="ORDER_UPDATE_CANCEL_EMAIL"*/}
                    {/*            valuePropName="checked"*/}
                    {/*        >*/}
                    {/*            <Checkbox/>*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col md={4} xs={4}>*!/*/}
                    {/*    /!*    <Form.Item*!/*/}
                    {/*    /!*        name="ORDER_UPDATE_CANCEL_PUSH"*!/*/}
                    {/*    /!*        valuePropName="checked"*!/*/}
                    {/*    /!*    >*!/*/}
                    {/*    /!*        <Checkbox/>*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*</Row>*/}

                    {/*<Row gutter={24} style={{marginBottom: 20}}>*/}
                    {/*    <Col md={16} xs={16}>*/}
                    {/*        <p className={cls.subTitle}>Refund order</p>*/}
                    {/*        <span>When the order status changes to “Refund”</span>*/}
                    {/*    </Col>*/}
                    {/*    <Col md={4} xs={4}>*/}
                    {/*        <Form.Item*/}
                    {/*            name="ORDER_UPDATE_REFUND_EMAIL"*/}
                    {/*            valuePropName="checked"*/}
                    {/*        >*/}
                    {/*            <Checkbox/>*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col md={4} xs={4}>*!/*/}
                    {/*    /!*    <Form.Item*!/*/}
                    {/*    /!*        name="ORDER_UPDATE_REFUND_PUSH"*!/*/}
                    {/*    /!*        valuePropName="checked"*!/*/}
                    {/*    /!*    >*!/*/}
                    {/*    /!*        <Checkbox/>*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*</Row>*/}

                    <Divider/>

                    <Row gutter={24}>
                        <Col md={16} xs={16}>
                            <p className={cls.title} style={{marginBottom: 5}}>Balance Updates</p>
                            <span>When balance fluctuates, insufficient balance, …</span>
                        </Col>
                        <Col md={4} xs={4}>
                            <Form.Item
                                name="BALANCE_UPDATE_EMAIL"
                                valuePropName="checked"
                            >
                                <Checkbox/>
                            </Form.Item>
                        </Col>
                        {/*<Col md={4} xs={4}>*/}
                        {/*    <Form.Item*/}
                        {/*        name="BALANCE_UPDATE_PUSH"*/}
                        {/*        valuePropName="checked"*/}
                        {/*    >*/}
                        {/*        <Checkbox/>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                    </Row>
                    <Divider/>
                    <br/>
                    <Row>
                        <Col md={16} xs={16}>
                        </Col>
                        <Col md={3} xs={3}>
                            <Form.Item>
                                <Button
                                    icon={<SaveOutlined/>}
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={editNotificationLoading}
                                >
                                    Save
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            );
        } else {
            return ''
        }
    }

}

NotificationSetting.propTypes = {};

export default NotificationSetting;
