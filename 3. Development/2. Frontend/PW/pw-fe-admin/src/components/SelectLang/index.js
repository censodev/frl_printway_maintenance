import {GlobalOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown/index';
import styles from './selectLang.module.less';

const SelectLang = (props) => {
    const {className} = props;
    const selectedLang = () => {
    };

    const changeLang = ({key}) => {
    };

    const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR'];
    const languageLabels = {
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'en-US': 'English',
        'pt-BR': 'Português',
    };
    const languageIcons = {
        'zh-CN': '🇨🇳',
        'zh-TW': '🇭🇰',
        'en-US': '🇺🇸',
        'pt-BR': '🇧🇷',
    };
    const langMenu = (
        <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
            {locales.map((locale) => (
                <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
                    {languageLabels[locale]}
                </Menu.Item>
            ))}
        </Menu>
    );
    return (
        <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <GlobalOutlined title="语言"/>
      </span>
        </HeaderDropdown>
    );
};

export default SelectLang;