import React, {Component} from 'react';
import {Alert, Button, Form, Input, message, Modal} from 'antd';
import {connect} from 'react-redux';
import cls from './style.module.less';
// import {TransactionActions} from "../../../redux/actions";
import CatchError from '../../../core/util/CatchError';


class AddFundModal extends Component {

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            createSuccess,
            createError
        } = this.props;

        if (
            nextProps.createSuccess === true
            && nextProps.createSuccess !== createSuccess
        ) {
            message.success('Success!', 1.5, () => {
                window.location.reload();
            });
        }

        // if (nextProps.createError && nextProps.createError !== createError) {
        //     message.error(CatchError[nextProps.createError]);
        // }


    }


    onFinish = (values) => {
        // console.log(values);
        const {createDeposit} = this.props;
        createDeposit(values);

    };

    render() {
        const {visible, handleCancel, createLoading, createError} = this.props;

        return (
            <Modal
                visible={visible}
                title="ADD FUND"
                onOk={this.onFinish}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={createLoading}
                            onClick={() => this.inputElement.click()}>
                        Submit
                    </Button>,
                ]}
                className={cls.wrap}
                style={{top: 40}}
            >
                <Alert
                    message="Please send payment to:"
                    description={
                        <>
                            <p>Paypal: xxx</p>
                            <p>Payoneer: xxx</p>
                            <p style={{color: 'rgba(0, 0, 0, 0.85)'}}>then submit the form below:</p>
                        </>
                    }
                    type="info"
                    showIcon
                />
                <br/>
                <Form layout="vertical" hideRequiredMark onFinish={this.onFinish}>
                    <Form.Item
                        name="transactionId"
                        label="Transaction ID:"
                        rules={[{required: true, message: 'Please enter transaction ID:'}]}

                    >
                        <Input placeholder="Enter transaction ID"/>
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{required: true, message: 'Please enter amount'}]}
                    >
                        <Input placeholder="Enter amount"/>
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Note"
                        rules={[
                            {
                                // required: false,
                                // message: 'please enter url description',
                            },
                        ]}
                    >
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    {
                        createError && (
                            <Form.Item>
                                <Alert message={CatchError[createError]} type="error" showIcon style={{textAlign: 'left'}}/>
                            </Form.Item>
                        )
                    }
                    <Button style={{display: 'none'}} htmlType="submit" type="primary"
                            ref={input => this.inputElement = input}>
                        Submit
                    </Button>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    // createLoading: state.toJS().transactions.createLoading,
    // createSuccess: state.toJS().transactions.createSuccess,
    // createError: state.toJS().transactions.createError,
});

const mapDispatchToProps = (dispatch) => ({
    // createDeposit: (params) => dispatch(TransactionActions.createDeposit(params)),
});


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddFundModal);
