import React, {Component} from 'react';
import {Alert, Button, Modal} from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';


class GuildModal extends Component {

    render() {
        const {visible, handleCancel} = this.props;

        return (
            <Modal
                title='How to use this app?'
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel}>
                        Ok
                    </Button>,
                ]}
            >
                <p style={{fontWeight: 'bold'}}>Please follow steps below to use this app</p>
                <ul>
                    <li>
                        Verify your email address sent in your account activation email.
                        <CheckOutlined style={{color: 'green', marginLeft: 5}}/>
                    </li>
                    <li>
                        Go to
                    </li>
                </ul>
            </Modal>
        );
    }
}

export default GuildModal;
