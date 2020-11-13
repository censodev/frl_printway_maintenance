import React, { Component } from 'react';
import { message, Modal, Button, Form, Upload, Select } from 'antd';
import { DownloadOutlined, InboxOutlined, PaperClipOutlined } from '@ant-design/icons';
import Axios from 'axios';

const { Option } = Select;

export default class ImportOrderModal extends Component {
    state = {
        siteId: "",
        file: null,
        uploading: false,
    };
    handleImport = value => {
        const { refreshTable } = this.props;
        const formData = new FormData();
        formData.append('file', this.state.file);
        // formData.append("siteId", value.siteId)
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        Axios({
            url: `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/order/supplier/import-tracking`,
            method: 'post',
            data: formData,
            headers: {
                Authorization: `Bearer ${localStorage.id_token}`,
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then(res => {
                this.setState({ file: null, uploading: false })
                if (res.data.length > 0) {
                    message.error('Import failed!');
                }
                else {
                    message.success('Import successfully.');
                    this.props.handleCancel();
                    refreshTable();
                }
            })
            .catch(err => {
                this.setState({
                    uploading: false,
                });
                message.error('Import failed!');
            })
    };
    onChangeSite = value => {
        this.setState({ siteId: value })
    }
    render() {
        const { uploading, file, siteId } = this.state;
        const { visible, handleCancel, sites } = this.props;
        const props = {
            onRemove: file => {
                this.setState({ file: null });
            },
            beforeUpload: file => {
                this.setState({ file });
                return false;
            },

        };
        const { Dragger } = Upload;
        return (
            <>
                <Modal
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <DownloadOutlined style={{ marginRight: "8px" }} />
                                Import Tracking
                            </div>
                        </div>
                    }
                    visible={visible}
                    onOk={() => this.btnRef.click()}
                    confirmLoading={uploading}
                    onCancel={handleCancel}
                    okText="Import"
                    destroyOnClose
                    closable={false}
                >
                    <Form layout="vertical" onFinish={this.handleImport}>
                        {/* <label style={{ fontWeight: "bold" }}>Step 1: Choose site</label>
                        <Form.Item
                            name="siteId"
                            rules={[{ required: true, message: 'Please choose site!' }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Choose site"
                                onChange={this.onChangeSite}
                                style={{ width: "100%", marginTop: "16px" }}
                            // value={siteId}
                            >
                                {sites.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={index} children={item.title} />
                                    )
                                })}
                            </Select>
                        </Form.Item> */}

                        <Button htmlType="submit" style={{ display: "none" }} ref={input => this.btnRef = input}>Submit</Button>
                        {/* <label style={{ fontWeight: "bold"}}>Step 2: Upload file</label> */}
                        <Dragger {...props} style={{ marginTop: "16px" }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>

                        </Dragger>
                    </Form>
                </Modal>
            </>
        )
    }
}

// state = {
//     file: null,
//     uploading: false,
// };

// handleUpload = () => {
//     const formData = new FormData();
//     formData.append('files[]', this.state.file);

//     this.setState({
//         uploading: true,
//     });

//     // You can use any AJAX library you like
//     // reqwest({
//     //     url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//     //     method: 'post',
//     //     processData: false,
//     //     data: formData,
//     //     success: () => {
//     //         this.setState({
//     //             fileList: [],
//     //             uploading: false,
//     //         });
//     //         message.success('upload successfully.');
//     //     },
//     //     error: () => {
//     //         this.setState({
//     //             uploading: false,
//     //         });
//     //         message.error('upload failed.');
//     //     },
//     // });
// };

// render() {
//     const { uploading, fileList } = this.state;
//     const props = {
//         onRemove: file => {
//             this.setState({file: null});
//         },
//         beforeUpload: file => {
//             this.setState({file});
//             return false;
//         },

//     };

//     return (
//         <div>
//             <Dragger {...props}>
//                 <p className="ant-upload-drag-icon">
//                     <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">Click or drag file to this area to upload</p>
//             </Dragger>
//         </div>
//     );
// }
// }
