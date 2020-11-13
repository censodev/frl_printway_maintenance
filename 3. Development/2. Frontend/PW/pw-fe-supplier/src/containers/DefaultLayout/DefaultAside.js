import React, { Component } from 'react';
import cls from "./header.module.less";
import { Link } from "react-router-dom";
import * as _ from 'lodash';
import logo from "../../assets/logo-ngang.svg";
import {Layout, Menu} from "antd";
import {
    NotificationOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

class DefaultAside extends Component {

    handleClick = (e) => {
        // console.log('click', e);
        const { history } = this.props;
        history.push(e.key);
    };


    render() {
        const { history } = this.props;
        const AnchorItem = ({ href, children }) => {
            return (
                <a
                    href={href}
                    onClick={e => {
                        e.preventDefault();
                    }}
                    className={cls.link}
                >
                    {children}
                </a>
            )
        }

        const pathName = _.get(history, 'location.pathname', '/');

        return (
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    // console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    // console.log(collapsed, type);
                }}
                style={{
                    overflow: 'initial',
                    minHeight: '100vh',
                    position: 'fixed',
                    zIndex: '9999',
                }}
                className="site-layout-background"
            >
                <div className={cls.logo}>
                    <Link to={'/'}>
                        <img src={logo} />
                    </Link>
                </div>
                <Menu theme="light" mode="inline"
                    selectedKeys={[pathName]}
                    onClick={this.handleClick}
                // defaultOpenKeys={['/category/cate4']}
                >
                    <Menu.Item key="/orders" icon={<ShoppingCartOutlined />}>
                        <AnchorItem href="/orders">
                            Orders
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/export_history" icon={<ClockCircleOutlined />}>
                        <AnchorItem href="/export_history">
                            Export history
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/balance" icon={<DollarCircleOutlined />}>
                        <AnchorItem href="/balance">
                            Balance
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/news" icon={<NotificationOutlined />}>
                        <AnchorItem href="/news">
                            News
                        </AnchorItem>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

DefaultAside
    .propTypes = {};

export default DefaultAside;
