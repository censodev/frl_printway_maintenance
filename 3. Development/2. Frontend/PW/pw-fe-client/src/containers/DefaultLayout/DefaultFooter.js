import React, {Component} from 'react';
import cls from "./header.module.less";
import {Layout} from "antd";

const {Footer} = Layout;

class DefaultFooter extends Component {
    render() {
        return (
            <Footer className={cls.footer}>PrintWay ©2020 All Rights Reserved </Footer>
        );
    }
}

DefaultFooter.propTypes = {};

export default DefaultFooter;
