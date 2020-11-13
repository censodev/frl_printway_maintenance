import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Menu, Spin} from 'antd';
import React from 'react';
import * as _ from 'lodash';
import HeaderDropdown from '../HeaderDropdown';
import avt from '../../assets/avatar.png';
import cls from './header.module.less';


class AvatarDropdown extends React.Component {
    onMenuClick = (event) => {
        const {key} = event;
        const {signOut} = this.props;

        if (key === 'logout') {
            return signOut();
        }

        this.props.history.push(`/${key}`);
    };

    render() {
        const {
            menu,
            userInfo,
        } = this.props;

        const firstName = _.get(userInfo, 'firstName', '- No data -');
        const lastName = _.get(userInfo, 'lastName', '');

        const menuHeaderDropdown = (
            <Menu className={cls.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                {menu && (
                    <Menu.Item key="profile" style={{fontWeight: '600'}}>
                        <UserOutlined/>
                        Account
                    </Menu.Item>
                )}
                {menu && <Menu.Divider/>}

                <Menu.Item key="logout">
                    <LogoutOutlined/>
                    Logout
                </Menu.Item>
            </Menu>
        );
        return firstName || lastName ? (
            <HeaderDropdown overlay={menuHeaderDropdown}>
         <span className={`${cls.action} ${cls.account}`}>
         <Avatar icon={<UserOutlined/>} size="default" className={cls.avatar} src={avt} alt="avatar"/>
          <div className={cls.name}>
              <p>{`${firstName} ${lastName}`}</p>
          </div>
        </span>
            </HeaderDropdown>
        ) : (
            <span className={`${cls.action} ${cls.account}`}>
        <Spin
            size="small"
            style={{
                marginLeft: 8,
                marginRight: 8,
            }}
        />
      </span>
        );
    }
}

export default AvatarDropdown;
