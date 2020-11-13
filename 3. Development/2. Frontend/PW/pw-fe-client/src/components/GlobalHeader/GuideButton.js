import React, {Component} from 'react';
import {Button} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import cls from './header.module.less';

// import GuildModal from "../Modal/GuideModal/GuildModal";

class GuideButton extends Component {

    state = {
        visible: false,
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <>
                <Button className={`${cls.action} ${cls.guideBtn}`} type={"link"}
                        icon={<QuestionCircleOutlined/>}
                        onClick={() => window.open('https://pgcfulfillment.com/faqs')}
                />
                {/*<GuildModal handleCancel={this.handleCancel} visible={this.state.visible}/>*/}
            </>
        );
    }
}

export default GuideButton;
