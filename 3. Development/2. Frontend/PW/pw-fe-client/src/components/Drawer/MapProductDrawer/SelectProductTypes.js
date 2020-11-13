import React, {Component} from 'react';
import {Button, Card, Col, Row, Space} from "antd";
import {RightCircleOutlined, LeftCircleOutlined} from "@ant-design/icons";
import {isMobile} from "react-device-detect";
import * as _ from 'lodash';
import greenCheck from '../../../assets/check.svg'
import cls from './style.module.less';

// const {Search} = Input;
const {Meta} = Card;

class SelectProductTypes extends Component {

    // onSearch = (value) => {
    //     // console.log(value);
    //     // if (value) {
    //     //     this.onSubmit();
    //     // }
    // };

    onChangeKeyWord = (e) => {
        // console.log(e.target.value);
        // this.props.searchProductType(e.target.value)

    };


    render() {

        const {listActiveProductTypes, listProductType, handleStep, onSelectCard} = this.props;

        return (
            <>
                {
                    listActiveProductTypes.length > 0 ? (
                        <Row style={{marginBottom: 10}}>
                            <Col md={12}>
                                <span style={{fontFamily: 'Poppins-Medium'}}>
                                    {`${listActiveProductTypes.length} items selected`}
                                </span>
                            </Col>
                            <Col md={12} style={{textAlign: 'right'}}>
                                <Space>
                                    <Button
                                        type="link"
                                        icon={<LeftCircleOutlined/>}
                                        size={isMobile ? 'small' : 'middle'}
                                        onClick={() => handleStep(true, false)}
                                    >
                                        back
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<RightCircleOutlined/>}
                                        size={isMobile ? 'small' : 'middle'}
                                        onClick={() => handleStep(false, false)}
                                    >
                                        Next
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    ) : (
                        <Row style={{marginBottom: 10}}>
                            <Col md={24} style={{textAlign: 'right'}}>
                                <Button
                                    type="link"
                                    icon={<LeftCircleOutlined/>}
                                    size={isMobile ? 'small' : 'middle'}
                                    onClick={() => handleStep(true, false)}
                                >
                                    back
                                </Button>
                            </Col>
                        </Row>
                    )
                }
                {
                    listProductType.productType.sort((a, b) => {
                        return a.priority - b.priority
                    }).map(data => (
                        <Card
                            id={data.id}
                            title={<span style={{fontFamily: 'Poppins-Medium'}}>{data.name || ''}</span>}
                            key={data.id}
                            style={{marginBottom: '30px'}}
                        >
                            {
                                // listActiveProductTypes.length > 0 && (
                                //     <h4><CheckCircleOutlined/> You selected {
                                //         listActiveProductTypes.map((data, i) => {
                                //             return `${data.title}${i === listActiveProductTypes.length - 1 ? '' : ', '}`
                                //         })
                                //     }</h4>
                                // )
                            }
                            <Row gutter={24}>
                                {
                                    _.get(data, 'productTypes', []).sort((a, b) => {
                                        return a.priority - b.priority
                                    }).map(value => (
                                        <Col md={6} style={{marginBottom: 15}} key={value.id}>
                                            <Button
                                                style={{width: '100%', height: '100%'}}
                                                type='link'
                                                onClick={() => onSelectCard(value)}
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
                                                        description={
                                                            <span style={{fontSize: '.75rem'}}>
                                                                Base cost: {value.variantDetails && value.variantDetails.length > 0 ? value.variantDetails.map((data, index) => {
                                                                return index < value.variantDetails.length - 1 ? `${data.baseCost}$ - ` : `${data.baseCost}$`
                                                            }).join('') : ''}
                                                            </span>
                                                        }
                                                    />
                                                    {
                                                        _.find(listActiveProductTypes, {id: value.id}) && (
                                                            <img className={cls.dot} src={greenCheck}/>
                                                        )
                                                    }
                                                </Card>
                                            </Button>
                                        </Col>
                                    ))
                                }
                            </Row>

                        </Card>
                    ))
                }
            </>
        );
    }
}


export default SelectProductTypes;
