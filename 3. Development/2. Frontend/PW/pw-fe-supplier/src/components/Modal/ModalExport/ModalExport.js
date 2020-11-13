import React from 'react';
import { Modal, Button, Row, Col, Checkbox } from 'antd';
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
                    footer={
                        <div className={cls.footer}>
                            <div></div>
                            {/* <a href="https://www.dropbox.com/sh/gocj90noazt5hbd/AAA8-rmk6wsUcBq5bsaenRtua?dl=0" target="blank" children={<><PaperClipOutlined />Download tool</>} /> */}
                            <div>
                                <Button type="default" children="Close" onClick={handleCancel} />
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
                                <Checkbox onChange={this.props.onChangeCheckBox}></Checkbox>
                            </Col>
                            <Col xs={23}>
                                <p>
                                    Check this box, all "Processing" order status will be change to "In production" status !
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <ExclamationCircleOutlined className={cls.orange} />
                            </Col>
                            <Col xs={23}>
                                <p>
                                    You can download printed images using our tool <br />
                                    (<a
                                        href="https://www.dropbox.com/sh/mxpq5eb4xm52alu/AABnhC0S0wPVvTjafHDCIv1ga?dl=0"
                                        target="blank"
                                        children={"Download tool here"}
                                        style={{ color: "rgba(0, 0, 0, 0.65)", textDecoration: "underline"}}
                                    />)
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
