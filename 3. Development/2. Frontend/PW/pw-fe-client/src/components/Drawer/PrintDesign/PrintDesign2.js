import React, { Component } from 'react';
import { Drawer, Collapse, Row, Col, Button, message } from 'antd';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';

import { OrdersActions } from '../../../redux/actions/index';

import UploadImage from './UploadImage';

const { Panel } = Collapse;

class PrintDesignDrawer extends Component {
    state = {
        designUpdates: [],
        currentSKU: null
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { saveImageDesignSuccess, saveImageDesignError } = this.props;
        if (nextProps.saveImageDesignError && nextProps.saveImageDesignError !== saveImageDesignError) {
            message.error({ content: nextProps.saveImageDesignError });
        }
        if (nextProps.saveImageDesignSuccess && nextProps.saveImageDesignSuccess !== saveImageDesignSuccess) {
            message.success({ content: "Update Success" , onClose: () => window.location.reload()})

        }
    }
    onDone = () => {
        const { lineItemCurrent, saveImageDesign } = this.props;
        let value = {};
        value.orderId = lineItemCurrent.orderId;
        value.lineItemId = lineItemCurrent.id;
        value.designUpdates = this.state.designUpdates;
        saveImageDesign(value);

    }
    getSKU = sku => {
        // console.log(sku)
        this.setState({ currentSKU : sku})
    }
    render() {
        const {
            onClose,
            visible,
            lineItemCurrent,
            doSaveImageDesign
        } = this.props;
        const props = {
            name: 'file',
            accept: '.png, .jpg, .tiff',
            multiple: false,
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
            showUploadList: false
        };
        return (
            <Drawer
                title="View print designs"
                // destroyOnClose
                width={isMobile ? 360 : 426}
                visible={visible}
                onClose={onClose}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}>

                        <Button
                            type="link"
                            onClick={this.onClear}
                        >
                            Clear
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.onDone}
                            loading={doSaveImageDesign}
                        >
                            Done
                        </Button>

                    </div>
                }

            >
                <Collapse
                    defaultActiveKey={['1', '2', '3', '4', '5']}
                    expandIconPosition='right'
                    bordered={false}
                    style={{ backgroundColor: 'white' }}
                >
                    <Panel
                        header={<span style={{ fontWeight: 600 }}>ABC</span>}
                        key="1"
                    >
                        {lineItemCurrent.printFileImages && lineItemCurrent.printFileImages.map((item, index) => {
                            return (
                                <Row key={index} gutter={24}>
                                    <Col sm={8}>
                                        <UploadImage
                                            imageUrl={item.image.id ? `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/upload/image-source/${item.image.id}/thumb` : null}
                                            props={props}
                                            sku={item.sku}
                                            getSKU={this.getSKU}
                                        />
                                    </Col>
                                    <Col sm={16}>
                                        <p>SKU: {item.sku}</p>
                                    </Col>
                                </Row>
                            )
                        })}
                    </Panel>
                </Collapse>
            </Drawer>
        )
    }
}

const mapStateToProps = state => ({
    doSaveImageDesign: state.toJS().orders.doSaveImageDesign,
    saveImageDesignSuccess: state.toJS().orders.saveImageDesignSuccess,
    saveImageDesignError: state.toJS().orders.saveImageDesignError
})

const mapDispatchToProps = dispatch => ({
    saveImageDesign: value => {
        dispatch(OrdersActions.saveImageDesign(value))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(PrintDesignDrawer)
