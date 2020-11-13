import React from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'

// const { Option } = Select;
const onFinish = props => {
    const { lineItem, resend, nestedRowsSelected } = props;
    if (nestedRowsSelected.length > 0 && !lineItem) {
        resend(nestedRowsSelected.map(item => ({
            orderId: item.orderId,
            itemSku: item.sku,
        })))
    }
    else {
        resend([{
            orderId: lineItem.orderId,
            itemSku: lineItem.sku,
        }])
    }
}
const confirm = (resendLoading, resend, lineItem, nestedRowsSelected, handleCancel, key) => {
    Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure to resend this product?',
        okText: "OK",
        cancelText: 'Cancel',
        // maskClosable: true,
        onOk: close => {
            message.loading({ content: 'Loading...', key });
            onFinish({ lineItem, resend, nestedRowsSelected });
            close();
        },
        onCancel: close => {
            handleCancel();
            close();
        },
    });
}

export default confirm;
