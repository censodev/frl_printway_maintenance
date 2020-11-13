import React from 'react';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


class Avatar extends React.Component {
    state = {
        loading: false,
    };
    render() {
        const { props, imageUrl, getSKU, sku } = this.props;
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div onClick={() => getSKU(sku)}>
                <Upload
                    name="avatar"
                    {...props}
                    disabled
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100px', height: '100px' }} /> : uploadButton}
                </Upload>
            </div>
        );
    }
}
export default Avatar
