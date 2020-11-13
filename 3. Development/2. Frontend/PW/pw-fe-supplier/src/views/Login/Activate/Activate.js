import React, {Component} from 'react';
import {Button, Result, Alert} from "antd";
import CatchError from "../../../core/util/CatchError";
import cls from './activate.module.scss';

class Activate extends Component {


    UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            auth,
        } = this.props;

        if (nextProps.auth.activateSuccess === true && nextProps.auth.activateSuccess !== auth.activateSuccess) {
            window.location.href = '/login';
        }
    }

    componentDidMount() {
        const {search} = this.props.location;
        const params = new URLSearchParams(search);
        const key = params.get('key');

        if (key) {
            this.props.activate(key);
        }
    }


    // submit = () => {
    //
    // };

    render() {

        const {auth} = this.props;

        return (
            <div className={cls.wrap}>
                <Result
                    status="info"
                    // title="Activate Account"
                    subTitle={`Active your account`}
                    extra={[
                        <Button type="link"
                                loading={this.props.auth.activateLoading}
                                disabled
                        />
                    ]}
                    style={{paddingTop: '100px', paddingBottom:'0'}}
                />
                {
                    auth.activateError && (
                        <Alert message={CatchError[auth.activateError] || auth.activateError} type="error" showIcon
                               style={{textAlign: 'left'}} />
                    )
                }
            </div>
        );
    }
}

Activate.propTypes = {};

export default Activate;
