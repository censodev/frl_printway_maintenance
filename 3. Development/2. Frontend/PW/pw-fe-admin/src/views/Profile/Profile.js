import React, {Component} from 'react';
import {
    Card,
    message,
    Tabs,
} from 'antd';
import {
    FileTextOutlined,
    UserOutlined,
    BellOutlined,
} from "@ant-design/icons";
import CatchError from '../../core/util/CatchError';
import NotificationSetting from "./NotificationSetting";
import Account from "./Account";

const {TabPane} = Tabs;


class Profile extends Component {

    state = {};

    componentDidMount() {
        this.props.fetchAllNotificationSetting();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editNotificationSuccess,
            editNotificationError,
            editUserInfoSuccess,
            editUserInfoError,
            editPassSuccess,
            editPassError
        } = this.props;

        if (
            nextProps.editNotificationSuccess === true
            && nextProps.editNotificationSuccess !== editNotificationSuccess
        ) {
            message.success('Success!');
        }

        if (
            nextProps.editNotificationError && nextProps.editNotificationError !== editNotificationError
        ) {
            message.error({content: CatchError[nextProps.editNotificationError] || nextProps.editNotificationError});
        }

        if (
            nextProps.editUserInfoSuccess === true
            && nextProps.editUserInfoSuccess !== editUserInfoSuccess
        ) {
            message.success('Success!');
        }

        if (
            nextProps.editUserInfoError && nextProps.editUserInfoError !== editUserInfoError
        ) {
            message.error({content: CatchError[nextProps.editUserInfoError] || nextProps.editUserInfoError});
        }

        if (
            nextProps.editPassSuccess === true
            && nextProps.editPassSuccess !== editPassSuccess
        ) {
            message.success('Success!', 1.5, () => {
                localStorage.clear();
                window.location.href = '/login';
            });
        }

        if (
            nextProps.editPassError && nextProps.editPassError !== editPassError
        ) {
            message.error({content: CatchError[nextProps.editPassError] || nextProps.editPassError});
        }


    }

    callback = (key) => {
        // console.log(key);
    };


    render() {

        const {
            listNotificationSetting,
            editNotificationSetting,
            editNotificationLoading,
            userInfo,
            editUserInfoLoading,
            editUserInfo,
            editPassLoading,
            editPassword
        } = this.props;

        return (
            <Card
                title={<span><FileTextOutlined style={{marginRight: '5px'}}/> Your Profile</span>}
                headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
            >
                <Tabs defaultActiveKey="1" onChange={this.callback} animated={false}>
                    <TabPane tab={<span style={{fontSize: 15}}><UserOutlined/>Account overview</span>} key="1">
                        <Account
                            userInfo={userInfo}
                            editUserInfo={editUserInfo}
                            editUserInfoLoading={editUserInfoLoading}
                            editPassLoading={editPassLoading}
                            editPassword={editPassword}
                        />
                    </TabPane>
                    <TabPane tab={<span style={{fontSize: 15}}><BellOutlined/>Notification Setting</span>} key="2">
                        <br/>
                        <NotificationSetting
                            listNotificationSetting={listNotificationSetting}
                            editNotificationSetting={editNotificationSetting}
                            editNotificationLoading={editNotificationLoading}
                        />
                    </TabPane>
                </Tabs>
            </Card>
        );
    }
}

export default Profile;
