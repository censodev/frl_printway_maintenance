import {BellOutlined, EyeOutlined} from '@ant-design/icons';
import { Dropdown, List} from 'antd';
import React from 'react';
import cls from './header.module.less';
import ReactHtmlParser from "react-html-parser";


class NotificationsDropdown extends React.Component {

    render() {

        const {listTopNews, history} = this.props;

        const menuHeaderDropdown = (
            <List
                footer={<div style={{padding: '0 20px 10px 20px'}}>
                    <a onClick={()=>history.push('/news')} style={{fontStyle: 'italic', color: '#1890ff'}}><EyeOutlined/>View
                        all</a>
                </div>}
                size="small"
                itemLayout="horizontal"
                dataSource={listTopNews && listTopNews.news || []}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={<span style={{fontWeight: '500'}}>{item.title}</span>}
                            description={
                                <div className={cls.notificationItem}>
                                    {item.shortDescription &&
                                    ReactHtmlParser(item.shortDescription.length > 90
                                        ? item.shortDescription.substring(0, 90) + " ..."
                                        : item.shortDescription)
                                    }
                                    {item.createdDate &&
                                    <span>{new Date(item.createdDate).toLocaleDateString('en-GB')}</span>}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        );
        return (
            <Dropdown overlay={menuHeaderDropdown}>
                <div className={cls.notificationBox}>
                    <BellOutlined style={{fontSize: '1.2rem'}}/>
                    {listTopNews && listTopNews.news.length > 0 && <span className={cls.count}>{listTopNews.news.length}</span>}
                </div>
            </Dropdown>
        )
    }
}

export default NotificationsDropdown;
