import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalcheckAssign = data => {
    if(data === "SUPPLIER") {
        Modal.warning({
            title: 'Error',
            icon: <ExclamationCircleOutlined />,
            content: `You cannot assign supplier product with status is proccessing, in production, shipped, refunded and cancelled`,
        });
        return;
    }
    if(data === "CARRIER") {
        Modal.warning({
            title: 'Error',
            icon: <ExclamationCircleOutlined />,
            content: `You cannot assign carrier product with status is shipped, refunded and cancelled`,
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