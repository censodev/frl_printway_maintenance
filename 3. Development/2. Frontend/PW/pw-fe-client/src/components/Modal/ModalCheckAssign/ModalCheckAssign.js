import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalcheckAssign = data => {
    if(data === "CANCELED") {
        Modal.warning({
            title: 'Error',
            icon: <ExclamationCircleOutlined />,
            content: `You cannot assign carrier product with status is processing, in production, shipped or cancelled`,
        });
    }
    else {
        Modal.warning({
            title: 'Error',
            icon: <ExclamationCircleOutlined />,
            content: `You picked ${data.length} products with different product type!`,
        });
    }
};
export default ModalcheckAssign