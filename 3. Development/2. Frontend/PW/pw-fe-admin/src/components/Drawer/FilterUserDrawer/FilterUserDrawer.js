import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {Drawer, Button, Collapse, message, Radio, Checkbox, InputNumber, Input, Space, DatePicker} from 'antd';
import configs from "../../../config/project.config";
import capitalizeRole from "../../../core/util/capitalizeRole";
import moment from "moment";

const {RangePicker} = DatePicker;
const {Panel} = Collapse;
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

class FilterUserDrawer extends Component {


    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            editSuccess,
            onClose,
        } = this.props;

        if (
            nextProps.editSuccess === true
            && nextProps.editSuccess !== editSuccess
        ) {
            onClose();
            message.success('Success!', 1.5, () => {
                window.location.reload()
            });
        }

    }

    _onChangeStatus = (e) => {
        this.props.onChangeStatus(e.target.value || undefined);
    };

    _onChangeRole = (e) => {
        if (Array.isArray(e)) {
            this.props.onChangeRole(e);
        } else {
            this.props.onChangeRole([]);
        }

    };

    _onChangeDate = (dates) => {
        this.props.onChangeDate(dates);
    };

    _onChangeLevel = (e) => {
        if (Array.isArray(e)) {
            this.props.onChangeLevel(e);
        } else {
            this.props.onChangeLevel([]);
        }
    };

    _onChangeNextLevel = (e) => {
        this.props.onChangeNextLevel(e.target.value || undefined);
    };

    _onChangeSaleRange = (key, e) => {
        this.props.onChangeSaleRange(key, e);
    };

    _onSubmit = () => {
        this.props.onCloseDrawer();
        this.props.onSubmit();
    };


    // onReset = () => {
    //     this.formRef.current.resetFields();
    // };

    render() {

        const {
            visible,
            onClose,
            listLevelsNoPaging,
            status,
            roles,
            levels,
            nextLevel,
            fromSaleAmount,
            toSaleAmount,
            onClear,
            startDate,
            endDate
        } = this.props;

        // console.log(data);

        return (
            <Drawer
                title='More filters'
                width={isMobile ? 360 : 426}
                onClose={onClose}
                visible={visible}
                className="user-collapse-custom-collapse"
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Space>
                            <Button onClick={this._onSubmit} type='primary'>
                                Done
                            </Button>
                            <Button onClick={onClear} type='link'>
                                Clear all filters
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6']} expandIconPosition='right' bordered={false}
                          style={{backgroundColor: 'white'}}>
                    <Panel header={<span style={{fontWeight: 600}}>Status</span>}
                           key="1"
                           className="user-collapse-custom-panel"
                    >
                        <Radio.Group onChange={this._onChangeStatus} value={status}>
                            <Radio style={radioStyle} value='active'>
                                Active
                            </Radio>
                            <Radio style={radioStyle} value='deactivate'>
                                Inactivate
                            </Radio>
                            <Button style={{paddingLeft: '0'}} type='link' onClick={this._onChangeStatus}>Clear</Button>
                        </Radio.Group>
                    </Panel>
                    <Panel header={<span style={{fontWeight: 600}}>Date created</span>}
                           key="2"
                           className="user-collapse-custom-panel"
                    >
                        <RangePicker
                            ranges={{
                                Today: [moment(), moment()],
                                Yesterday: [moment().add(-1, 'days'), moment().add(-1, 'days')],
                                'Last 7 days': [moment().subtract(6, 'days'), moment()],
                                'Last 30 days': [moment().subtract(29, 'days'), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last Month': [moment().subtract(1, 'months').startOf('month'),
                                    moment().subtract(1, 'months').endOf('month')],
                                // 'Last 3 Month': [moment().subtract(3, 'months').startOf('month'),
                                //     moment().subtract(1, 'months').endOf('month')],
                            }}
                            // renderExtraFooter={() => <div>MyFooter</div>}
                            // showToday
                            showTime={!!isMobile}
                            format="DD/MM/YYYY"
                            // defaultValue={[moment().subtract(6, 'days'), moment()]}
                            onChange={this._onChangeDate}
                            style={{width: '100%', marginBottom: 15}}
                            value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
                        />
                        <Button
                            style={{paddingLeft: '0', marginBottom: 5}}
                            type='link'
                            onClick={() => this._onChangeDate(null)}
                        >
                            Clear
                        </Button>
                    </Panel>
                    <Panel header={<span style={{fontWeight: 600}}>Roles</span>}
                           key="3"
                           className="user-collapse-custom-panel"
                    >
                        <Checkbox.Group style={{width: '100%'}} onChange={this._onChangeRole} value={roles}>
                            {
                                configs.roles.map(value => (
                                    <div style={{display: 'flex'}} key={value}>
                                        <Checkbox
                                            value={value}
                                            style={{marginBottom: '10px'}}
                                        >
                                            {capitalizeRole(value)}
                                        </Checkbox>
                                    </div>
                                ))
                            }
                        </Checkbox.Group>
                        <Button style={{paddingLeft: '0'}} type='link' onClick={this._onChangeRole}>Clear</Button>
                    </Panel>
                    <Panel header={<span style={{fontWeight: 600}}>Level</span>}
                           key="4"
                           className="user-collapse-custom-panel"
                    >
                        <Checkbox.Group style={{width: '100%'}} onChange={this._onChangeLevel} value={levels}>
                            {
                                listLevelsNoPaging.levels && listLevelsNoPaging.levels.map(value => (
                                    <div style={{display: 'flex'}} key={value.id || ''}>
                                        <Checkbox
                                            value={value.id}
                                            style={{marginBottom: '10px'}}
                                        >
                                            {value.name}
                                        </Checkbox>
                                    </div>
                                ))
                            }
                        </Checkbox.Group>
                        <Button style={{paddingLeft: '0'}} type='link' onClick={this._onChangeLevel}>Clear</Button>
                    </Panel>
                    <Panel
                        header={<span style={{fontWeight: 600}}>Sale range</span>}
                        key="5"
                        className="user-collapse-custom-panel"
                    >
                        <Input.Group compact style={{marginBottom: 15}}>
                            <InputNumber
                                onChange={(e) => this._onChangeSaleRange('fromSaleAmount', e)}
                                style={{width: '45%', textAlign: 'center'}}
                                placeholder="From"
                                value={fromSaleAmount}
                            />
                            <Input
                                className="site-input-split"
                                style={{
                                    width: '10%',
                                    borderLeft: 0,
                                    textAlign: 'center',
                                    borderRight: 0,
                                    pointerEvents: 'none',
                                    backgroundColor: 'transparent'
                                }}
                                placeholder="~"
                                disabled
                            />
                            <InputNumber
                                onChange={(e) => this._onChangeSaleRange('toSaleAmount', e)}
                                className="site-input-right"
                                style={{
                                    width: '45%',
                                    textAlign: 'center',
                                }}
                                placeholder="To"
                                value={toSaleAmount}
                            />
                        </Input.Group>
                        <Button
                            style={{paddingLeft: '0', marginTop: '10px'}}
                            type='link'
                            onClick={() => this._onChangeSaleRange(null, null)}
                        >
                            Clear
                        </Button>
                    </Panel>
                    <Panel
                        header={<span style={{fontWeight: 600}}>Filter by users prepare to next level</span>}
                        key="6"
                        className="user-collapse-custom-panel"
                    >
                        <Radio.Group onChange={this._onChangeNextLevel} value={nextLevel}>
                            {
                                listLevelsNoPaging.levels && listLevelsNoPaging.levels.map(value => (
                                    <Radio style={radioStyle} value={value.id} key={value.id}>
                                        {value.name}
                                    </Radio>
                                ))
                            }
                            <Button
                                style={{paddingLeft: '0'}}
                                type='link'
                                onClick={this._onChangeNextLevel}
                            >
                                Clear
                            </Button>
                        </Radio.Group>
                    </Panel>
                </Collapse>
            </Drawer>
        );
    }
}

export default FilterUserDrawer;
