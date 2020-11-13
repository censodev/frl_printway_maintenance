import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalCheckMoreAction = item => {
    switch (item) {
        case "ACTION_REQUIRED":
            Modal.warning({
                title: 'Error',
                icon: <ExclamationCircleOutlined />,
                content: "You can not set action required products with status are action required, processing, in production, shipped and canceled!",
            });
            break;
        case "REFUND":
            Modal.warning({
                title: 'Error',
                icon: <ExclamationCircleOutlined />,
                content: "You can only refund products with status is processing!",
            });
            break;
        case "CANCEL":
            Modal.warning({
                title: 'Error',
                icon: <ExclamationCircleOutlined />,
                content: "You can not cancel products with status are refunded, shipped and canceled!",
            });
            break;
        default:
            break;
    }

};
export default ModalCheckMoreAction