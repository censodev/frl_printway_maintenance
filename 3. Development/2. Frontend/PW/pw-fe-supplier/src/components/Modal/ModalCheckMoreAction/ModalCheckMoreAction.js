import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalCheckMoreAction = item => {
    switch (item) {
        case "ON_HOLD":
            Modal.warning({
                title: 'Error',
                icon: <ExclamationCircleOutlined />,
                content: "You can not on hold products with status are on hold, processing, in production and shipped!",
            });
            break;
        case "CANCEL":
            Modal.warning({
                title: 'Error',
                icon: <ExclamationCircleOutlined />,
                content: "You can not cancel products with status are canceled, in production and shipped!",
            });
            break;
        default:
            break;
    }

};
export default ModalCheckMoreAction