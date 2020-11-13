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
import ContentSetting from "./ContentSetting";
import LevelContentSetting from "./LevelContentSetting";

const {TabPane} = Tabs;


class Content extends Component {

    state = {};

    componentDidMount() {
        this.props.fetchAllContentSetting();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editContentSuccess,
            editContentError,
        } = this.props;

        if (
            nextProps.editContentSuccess === true
            && nextProps.editContentSuccess !== editContentSuccess
        ) {
            message.success('Success!');
        }

        if (
            nextProps.editContentError && nextProps.editContentError !== editContentError
        ) {
            message.error({content: CatchError[nextProps.editContentError] || nextProps.editContentError});
        }

    }

    callback = (key) => {
        // console.log(key);
    };


    render() {

        const {
            editContentLoading,
            listContentSetting,
            editContentSetting
        } = this.props;

        return (
            <Card
                title={<span><FileTextOutlined style={{marginRight: '5px'}}/> Your Content</span>}
                headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
            >
                <Tabs defaultActiveKey="1" onChange={this.callback} animated={false}>
                    <TabPane tab={<span style={{fontSize: 15}}><UserOutlined/>Order status content</span>} key="1">
                        <br/>
                        <ContentSetting
                            editContentLoading={editContentLoading}
                            listContentSetting={listContentSetting}
                            editContentSetting={editContentSetting}
                        />
                    </TabPane>
                    <TabPane tab={<span style={{fontSize: 15}}><BellOutlined/>Seller next level content</span>} key="2">
                        <br/>
                        <LevelContentSetting
                            editContentLoading={editContentLoading}
                            listContentSetting={listContentSetting}
                            editContentSetting={editContentSetting}
                        />
                    </TabPane>
                </Tabs>
            </Card>
        );
    }
}

export default Content;
