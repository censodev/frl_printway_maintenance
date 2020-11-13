import React, { Component } from 'react';
import { message, Modal, Button, Form, Upload } from 'antd';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import Axios from 'axios';


export default class ImportTracking extends Component {
    state = {
        siteId: "",
        file: null,
        uploading: false,
    };
    handleImport = value => {
        const formData = new FormData();
        formData.append('file', this.state.file);
        // formData.append("siteId", value.siteId)
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        Axios({
            url: `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/order/admin/import-tracking`,
            method: 'post',
            data: formData,
            headers: {
                Authorization: `Bearer ${localStorage.id_token}`,
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then(res => {
                this.setState({ file: null, uploading: false })
                message.success('Import successfully.');
                this.props.handleCancel();
                this.props.refreshTable();
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
        const { uploading } = this.state;
        const { visible, handleCancel } = this.props;
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
                        <Button htmlType="submit" style={{ display: "none" }} ref={input => this.btnRef = input}>Submit</Button>
                        {/* <label style={{ fontWeight: "bold"}}>Step 2: Upload file</label> */}
                        <Dragger {...props} style={{ marginTop: "16px"}}>
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
