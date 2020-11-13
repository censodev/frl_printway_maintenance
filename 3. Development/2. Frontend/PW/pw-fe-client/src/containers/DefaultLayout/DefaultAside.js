import React, {Component} from 'react';
import cls from "./header.module.less";
import {Link} from "react-router-dom";
import * as _ from 'lodash';
import logo from "../../assets/logo-ngang.svg";
import {Layout, Menu} from "antd";
import {
    NotificationOutlined,
    GlobalOutlined,
    DashboardOutlined,
    BlockOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
} from "@ant-design/icons";
import {connect} from "react-redux";

const {Sider} = Layout;

// const {SubMenu} = Menu;

class DefaultAside extends Component {

    handleClick = (e) => {
        // console.log('click', e);
        const {history} = this.props;
        history.push(e.key);
    };


    render() {
        const {history, userInfo} = this.props;
        const AnchorItem = ({href, children}) => {
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
        // let selectedKey = 'sub1';

        // console.log('111', userInfo);

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
                        <img src={logo}/>
                    </Link>
                </div>
                <div className={cls.level}>
                    <p>Your level</p>
                    <span>{_.get(userInfo, ['sellerLevel', 'name'], '-')}</span>
                </div>
                <Menu theme="light" mode="inline"
                      selectedKeys={[pathName]}
                      onClick={this.handleClick}
                    // defaultOpenKeys={['/category/cate4']}
                >
                    <Menu.Item key="/" icon={<DashboardOutlined/>}>
                        <AnchorItem href="/">
                            Dashboard
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/orders" icon={<ShoppingCartOutlined />}>
                        <AnchorItem href="/orders">
                            Orders
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/products" icon={<BlockOutlined/>}>
                        <AnchorItem href="/products">
                            Products
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/sites" icon={<GlobalOutlined/>}>
                        <AnchorItem href="/sites">
                            Sites
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/balance" icon={<DollarCircleOutlined/>}>
                        <AnchorItem href="/balance">
                            Balance
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/news" icon={<NotificationOutlined/>}>
                        <AnchorItem href="/news">
                            News
                        </AnchorItem>
                    </Menu.Item>
                    {/*<SubMenu key="category" icon={<UserOutlined/>} title="Category">*/}
                    {/*    <Menu.Item key="/category/cate1">option1</Menu.Item>*/}
                    {/*    <Menu.Item key="/category/cate2">option2</Menu.Item>*/}
                    {/*    <Menu.Item key="/category/cate3">option3</Menu.Item>*/}
                    {/*    <Menu.Item key="/category/cate4">option4</Menu.Item>*/}
                    {/*</SubMenu>*/}
                </Menu>
            </Sider>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.toJS().auth.userInfo.data,
});

export default connect(
    mapStateToProps,
    null,
)(DefaultAside);
