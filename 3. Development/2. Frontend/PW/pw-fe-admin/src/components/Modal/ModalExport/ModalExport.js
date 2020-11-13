import React from 'react';
import { Modal, Button, Row, Col } from 'antd';
import { UploadOutlined, PaperClipOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import cls from "./style.module.less"

// const { Option } = Select;

class ModalExport extends React.Component {

    onFinish = () => {
        this.props.export();
    }

    render() {
        const { visible, handleCancel, doExport } = this.props;
        return (
            <div>
                <Modal
                    title={
                        <><UploadOutlined style={{ marginRight: "8px" }} />
                            Are you sure to want to export order?
                        </>
                    }
                    onCancel={handleCancel}
                    visible={visible}
                    closable={true}
                    footer={
                        <div className={cls.footer}>
                            <a href="https://www.dropbox.com/sh/gocj90noazt5hbd/AAA8-rmk6wsUcBq5bsaenRtua?dl=0" target="blank" children={<><PaperClipOutlined />Download tool</>} />
                            <div>
                                <Button type="default" children="Close" onClick={handleCancel}/>
                                <Button
                                    type="primary"
                                    children={<> <UploadOutlined /> Export order</>}
                                    onClick={this.onFinish}
                                    loading={doExport}
                                />
                            </div>
                        </div>
                    }
                    bodyStyle={{ padding: "40px" }}
                >
                    <div>
                        <Row>
                            <Col xs={1}>
                                <ExclamationCircleOutlined className={cls.orange} />
                            </Col>
                            <Col xs={23}>
                                <p>
                                    Note: when you export order, all "Processsing" order status will be change to "In production"! <br />
                                    After export order, you can import this order into our tool to download print file.
                                </p>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default ModalExport;
