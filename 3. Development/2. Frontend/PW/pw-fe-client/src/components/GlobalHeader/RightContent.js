import React, {Component} from 'react';
import Avatar from './AvatarDropdown';
import Notifications from './NotificationsDropdown';
import GuideButton from './GuideButton';
import cls from './header.module.less';


class GlobalHeaderRight extends Component {

    // state = {
    //     visible: false
    // };
    //
    // showModal = () => {
    //     this.setState({
    //         visible: true,
    //     });
    // };
    //
    //
    // handleCancel = () => {
    //     this.setState({visible: false});
    // };

    render() {

        const {userInfo, balance, history, listTopNews} = this.props;

        return (
            <div className={cls.right}>
                <GuideButton />
                <Notifications history={history} listTopNews={listTopNews}/>
                <Avatar history={history} menu signOut={this.props.signOut} userInfo={userInfo} balance={balance}/>
            </div>
        );
    }
};

export default GlobalHeaderRight;
