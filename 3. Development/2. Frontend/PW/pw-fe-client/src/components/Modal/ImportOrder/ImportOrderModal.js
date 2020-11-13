import React, { Component } from 'react';
import { message, Modal, Button, Form, Upload, Select } from 'antd';
import { DownloadOutlined, InboxOutlined, PaperClipOutlined } from '@ant-design/icons';
import Axios from 'axios';

const { Option } = Select;

export default class    ImportOrderModal extends Component {
    state = {
        siteId: "",
        file: null,
        uploading: false,
        error: null,
        data: []
    };
    handleImport = value => {
        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.append("siteId", value.siteId)
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        Axios({
            url: `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/order/import?siteId=${value.siteId}`,
            method: 'post',
            data: formData,
            headers: {
                Authorization: `Bearer ${localStorage.id_token}`
            },
        })
            .then(res => {
                if (res.data.length > 0) {
                    message.error("Import failed!");
                    this.setState({
                        uploading: false,
                        error: true,
                        data: res.data
                    })
                }
                else {
                    this.setState({ file: null, uploading: false })
                    message.success('Import successfully.');
                    this.props.handleCancel();
                    this.props.refreshTable();
                }
            })
            .catch(err => {
                this.setState({
                    uploading: false,
                });
                message.error('Import failed.');
            })
    };
    onChangeSite = value => {
        this.setState({ siteId: value })
    }
    render() {
        const { uploading, error } = this.state;
        const { visible, handleCancel, sites, exportErrorFile, exportErrorFileLoading } = this.props;
        const props = {
            onRemove: file => {
                this.setState({ file: null });
            },
            beforeUpload: file => {
                this.setState({ file, error: null });
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
                                Import
                            </div>
                            <div style={{ textDecoration: "underLine", fontWeight: "lighter" }}>
                                <PaperClipOutlined />
                                <a
                                    style={{ color: "rgba(0, 0, 0, 0.85)", fontSize: "14px" }}
                                    href={`https://www.dropbox.com/s/gthepf69cpyklnq/import_order_template.xlsx?dl=1`}
                                    children="Download template"
                                />
                            </div>
                        </div>
                    }
                    footer={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                {error && <Button
                                    type="link"
                                    style={{ color: "red" }}
                                    children={<><PaperClipOutlined /> Download error file </>}
                                    onClick={() => exportErrorFile(this.state.data)}
                                    loading={exportErrorFileLoading}
                                />}
                            </div>
                            <div>
                                <Button
                                    type="default"
                                    onClick={() => {
                                        this.setState({ error: null });
                                        handleCancel();
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.btnRef.click();
                                    }}
                                    loading={uploading}
                                >
                                    Import
                                </Button>
                            </div>
                        </div>
                    }
                    visible={visible}
                    onCancel={() => {
                        this.setState({ error: null });
                        handleCancel();
                    }}
                    okText="Import"
                    destroyOnClose
                    closable={false}
                >
                    <Form layout="vertical" onFinish={this.handleImport}>
                        <label style={{ fontWeight: "bold" }}>Step 1: Choose site</label>
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
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            // value={siteId}
                            >
                                {sites.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={index} children={item.title} />
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Button htmlType="submit" style={{ display: "none" }} ref={input => this.btnRef = input}>Submit</Button>
                        <label style={{ fontWeight: "bold" }}>Step 2: Upload file</label>
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
