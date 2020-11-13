import React, {Component} from 'react';
import {Button, Card, Col, Input, Row, Tabs} from "antd";
import {BlockOutlined, RightCircleOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {isMobile} from "react-device-detect";
import * as _ from 'lodash';
import greenCheck from '../../../assets/check.svg'
import cls from './style.module.less';

const {Search} = Input;
const {TabPane} = Tabs;
const {Meta} = Card;

class SelectProductTypes extends Component {

    onSearch = (value) => {
        console.log(value);
        // if (value) {
        //     this.onSubmit();
        // }
    };

    onChangeKeyWord = (e) => {
        // console.log(e.target.value);
        this.props.searchProductType(e.target.value);

    };


    render() {

        const {listActiveProductTypes, listProductType} = this.props;

        console.log(listProductType);

        return (
            <Card
                title={
                    <Row>
                        <Col md={18}>
                            <span>
                                <BlockOutlined style={{marginRight: '5px'}}/> PRODUCTS MANAGER > SELECT PRODUCT TYPE
                            </span>
                        </Col>
                        {/*<Col md={6}>*/}
                        {/*    <Search*/}
                        {/*        allowClear*/}
                        {/*        placeholder="Search by name"*/}
                        {/*        onSearch={this.onSearch}*/}
                        {/*        onChange={this.onChangeKeyWord}*/}
                        {/*        style={{width: '100%'}}*/}
                        {/*    />*/}
                        {/*</Col>*/}
                    </Row>
                }
                headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                extra={
                    listActiveProductTypes.length > 0 && (
                        <Button
                            type="primary"
                            icon={<RightCircleOutlined/>}
                            size={isMobile ? 'small' : 'middle'}
                            onClick={this.props.onChangeShowProductType}
                        >
                            Continue
                        </Button>
                    )
                }
            >
                <Tabs
                    onChange={(e) => {
                        console.log(e)
                    }}
                    animated={true}
                >
                    {
                        listProductType.productType.map(data => (
                            <TabPane tab={data.name || ''} key={data.id}>
                                {
                                    listActiveProductTypes.length > 0 && (
                                        <h4><CheckCircleOutlined/> You selected {
                                            listActiveProductTypes.map((data, i) => {
                                                return `${data.title}${i === listActiveProductTypes.length - 1 ? '' : ', '}`
                                            })
                                        }</h4>
                                    )
                                }
                                <br/>
                                <Row gutter={24}>
                                    {
                                        _.get(data, 'productTypes', []).map(value => {
                                            return (
                                                <Col md={6} style={{marginBottom: 15}} key={value.id}>
                                                    <Button
                                                        style={{width: '100%', height: '100%'}}
                                                        type='link'
                                                        onClick={() => this.props.onSelectCard(value)}
                                                        disabled={
                                                            listActiveProductTypes
                                                            && listActiveProductTypes[0]
                                                            && listActiveProductTypes[0].category
                                                            && listActiveProductTypes[0].category.id !== value.category.id
                                                        }
                                                    >
                                                        <Card
                                                            hoverable
                                                            style={{
                                                                position: 'relative',
                                                            }}
                                                            bodyStyle={{
                                                                backgroundColor: "rgb(245, 245, 245)",
                                                                marginTop: 10,
                                                                padding: 10,
                                                                textAlign: 'left'
                                                            }}
                                                            cover={
                                                                <div className={cls.bgCard}
                                                                     style={{
                                                                         backgroundImage: `url(${value.images[0] ? value.images[0].imageUrl : ''})`
                                                                     }}
                                                                />
                                                            }
                                                            // loading={listProductType.loading}
                                                        >
                                                            <Meta
                                                                title={value.title || ''}
                                                                description={`Base cost: ${value.variantDetails && value.variantDetails[0] ? value.variantDetails[0].baseCost : 0}$`}
                                                            />
                                                            {
                                                                _.find(listActiveProductTypes, {id: value.id}) && (
                                                                    <img className={cls.dot} src={greenCheck}/>
                                                                )
                                                            }
                                                        </Card>
                                                    </Button>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </TabPane>
                        ))
                    }
                </Tabs>
            </Card>
        );
    }
}


export default SelectProductTypes;
