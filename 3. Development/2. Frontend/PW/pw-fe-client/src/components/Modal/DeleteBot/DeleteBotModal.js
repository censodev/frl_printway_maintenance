import React, {Component} from 'react';
import {Alert, Button, Col, Form, Input, Modal} from 'antd';
import question from '../../../assets/question.svg';
import cls from './style.module.less';
import {MessageFilled} from "@ant-design/icons";

class DeleteBotModal extends Component {

    render() {
        const {visible, handleCancel, type} = this.props;

        return (
            <Modal
                visible={visible}
                title={type === 'store' ? 'DELETE STORE AND BOT' : 'DELETE BOT'}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button type='primary' icon={<MessageFilled/>}>Contact us</Button>
                ]}
            >
                <div className={cls.box}>
                    <img src={question} style={{marginBottom:' 20px'}}/>
                    <p>{type === 'store' ? 'Are you sure you want to delete the store and bot?' : 'Are you sure you want to delete this bot?'}</p>
                </div>
            </Modal>
        );
    }
}


export default DeleteBotModal;
