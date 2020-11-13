import React, { Component } from 'react'
import cls from './style.module.less';
import checkOrderLogs from '../../core/util/checkOrderLog';

export default class TimeLine extends Component {
    render() {
        const { data } = this.props;
        return (
            <div className={cls.timeLine}>
                <div className={cls.timeLineBody}>
                    {(data || []).map((item, index) => {
                        return (
                            <div className={cls.timeLineItem} key={index}>
                                <div className={cls.timeLineContent}>
                                    <p className="title">{checkOrderLogs(item)}</p>
                                    <p className="time">{item.hourAndMin}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
