import React, {Component} from 'react';
import cls from "./header.module.less";
import {Link} from "react-router-dom";
import * as _ from 'lodash';
import logo from "../../assets/logo-ngang.svg";
import {Layout, Menu} from "antd";
import {isMobile} from 'react-device-detect';
import {
    DashboardOutlined,
    GlobalOutlined,
    UsergroupDeleteOutlined,
    BlockOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    SettingOutlined,
    ImportOutlined,
} from "@ant-design/icons";
import {AuthActions, NewsActions} from "../../redux/actions";
import {connect} from "react-redux";

const {Sider} = Layout;
const {SubMenu} = Menu;

class DefaultAside extends Component {

    handleClick = (e) => {
        const {history} = this.props;
        history.push(e.key);
    };


    render() {
        const AnchorItem = ({href, children}) => {
            return (
                <a
                    href={href}
                    onClick={e => {
                        e.preventDefault();
                    }}
                    style={{fontSize: '.85rem'}}
                >
                    {children}
                </a>
            )
        }
        const {history, userInfo} = this.props;

        // let selectedKey = 'sub1';

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
                    overflowY: isMobile ? 'none' : 'scroll',
                    overflowX: 'hidden',
                    minHeight: '100vh',
                    position: 'fixed',
                    zIndex: '9999',
                    height: '100%',
                }}
                collapsible={true}
                className="site-layout-background"
            >
                <div className={cls.logo}>
                    <Link to={'/'}>
                        <img src={logo}/>
                    </Link>
                </div>
                <Menu theme="light" mode="inline"
                      selectedKeys={[pathName]}
                      onClick={this.handleClick}
                      defaultOpenKeys={['/balance', '/setting']}
                >
                    <Menu.Item key="/" icon={<DashboardOutlined/>}>
                        <AnchorItem href="/">
                            Dashboard
                        </AnchorItem>
                    </Menu.Item>
                    <Menu.Item key="/orders" icon={<ShoppingCartOutlined/>}>
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
                    <SubMenu key="/balance" icon={<DollarOutlined/>} title="Balance">
                        <Menu.Item key="/balance/user">
                            <AnchorItem href="/balance/user">
                                Seller transaction
                            </AnchorItem>
                        </Menu.Item>
                        <Menu.Item key="/balance/supplier">
                            <AnchorItem href="/balance/supplier">
                                Supplier transaction
                            </AnchorItem>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/users" icon={<UsergroupDeleteOutlined/>}>
                        <AnchorItem href="/users">
                            User management
                        </AnchorItem>
                    </Menu.Item>

                    {
                        userInfo && userInfo.roles
                        && Array.isArray(userInfo.roles)
                        && userInfo.roles.includes('ROLE_ADMIN')
                        && (
                            <Menu.Item key="/export_history" icon={<ImportOutlined/>}>
                                <AnchorItem href="/export_history">
                                    Supplier-Import tracking
                                </AnchorItem>
                            </Menu.Item>
                        )

                    }

                    <SubMenu key="/setting" icon={<SettingOutlined/>} title="App Setting">
                        <Menu.Item key="/categories">
                            <AnchorItem href="/categories">
                                Categories
                            </AnchorItem>
                        </Menu.Item>
                        <Menu.Item key="/productTypes">
                            <AnchorItem href="/productTypes">
                                Product Types
                            </AnchorItem>
                        </Menu.Item>
                        <Menu.Item key="/carriers">
                            <AnchorItem href="/carriers">
                                Carries
                            </AnchorItem>
                        </Menu.Item>
                        <Menu.Item key="/levels">
                            <AnchorItem href="/levels">
                                Seller Levels
                            </AnchorItem>
                        </Menu.Item>
                        <Menu.Item key="/news">
                            <AnchorItem href="/news">
                                News
                            </AnchorItem>
                        </Menu.Item>
                        <Menu.Item key="/content_setting">
                            <AnchorItem href="/content_setting">
                                Content Setting
                            </AnchorItem>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.toJS().auth.userInfo.data,
});

const mapDispatchToProps = (dispatch) => ({
    // fetchUserInfo: () => dispatch(AuthActions.fetchUserInfo()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DefaultAside);

