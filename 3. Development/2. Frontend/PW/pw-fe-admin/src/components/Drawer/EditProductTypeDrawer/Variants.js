import React, {Component} from 'react';
import allPossibleCases from '../../../core/util/allPossibleCases';
import {Button, Card, Col, Form, Input, Popconfirm, Row, Select, Tooltip} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


class Variants extends Component {

    onChange = () => {
        const {form} = this.props;
        let currentVariants = form.current.getFieldValue('variants');
        let variantDetail = [];
        let array = [];


        if (currentVariants && currentVariants.length > 0) {

            let listSupplierCosts = form.current.getFieldValue('suppliers').map(value => {
                return {
                    supplier: {
                        id: value,
                    },
                    cost: 0,
                };
            });

            let sku = form.current.getFieldValue('sku');


            if (currentVariants[0] && currentVariants[0].name && currentVariants[0].options.length > 0) {
                array = allPossibleCases([currentVariants[0].options]);

                if (currentVariants[1] && currentVariants[1].name && currentVariants[1].options.length > 0) {
                    array = allPossibleCases([currentVariants[0].options, currentVariants[1].options]);
                }

            }


            for (let j = 0; j < array.length; j++) {
                variantDetail.push(
                    {
                        "option1": array[j].split('|||')[0] || null,
                        "option2": array[j].split('|||')[1] || null,
                        "sku": sku ? `${sku}-${array[j].replace('|||', '-')}` : array[j].replace('|||', '-'),
                        "supplierCosts": [...listSupplierCosts],
                        "baseCost": 0,
                        "retailCost": 0,
                        "saleCost": 0,
                        "enable": true
                    }
                )
            }


            form.current.setFieldsValue({'variantDetails': variantDetail});


        }


    };

    render() {

        const {disableField} = this.props;

        return (
            <Card
                title='Variants'
                extra={
                    <Tooltip
                        title={'Maximum 2 Variants added'}
                    >
                        <Button onClick={() => this.addVariantBtn && this.addVariantBtn.click()} type='link'>
                            <PlusOutlined/> Add Variant
                        </Button>
                    </Tooltip>
                }
            >
                <Form.List name="variants">
                    {(fields, {add, remove}) => {
                        return (
                            <div>
                                {fields.map(field => (
                                    <Row key={field.key} style={{marginBottom: 8}} gutter={24}>
                                        <Col md={11} xs={11}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'name']}
                                                fieldKey={[field.fieldKey, 'name']}
                                                onChange={this.onChange}
                                                rules={[{required: true, message: 'Missing name'}]}
                                            >
                                                <Input disabled={disableField} placeholder={'Enter Name'}/>
                                            </Form.Item>
                                        </Col>
                                        <Col md={11} xs={11}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'options']}
                                                fieldKey={[field.fieldKey, 'options']}
                                                rules={[{required: true, message: 'Missing options'}]}
                                            >
                                                <Select
                                                    disabled={disableField}
                                                    onChange={this.onChange}
                                                    mode="tags" style={{width: '100%'}}
                                                    placeholder={'Enter options'}
                                                    // placeholder="Tags Mode"
                                                />

                                            </Form.Item>
                                        </Col>
                                        <Col md={2} xs={2}>
                                            {
                                                fields.length > 1 && (
                                                    <Popconfirm
                                                        title="Are you sure to delete？"
                                                        okText="Yes" cancelText="No"
                                                        onConfirm={() => {
                                                            remove(field.name);
                                                            this.onChange();
                                                        }}
                                                    >
                                                        <MinusCircleOutlined className={'red'}/>
                                                    </Popconfirm>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                ))}

                                {
                                    fields.length < 2 && (
                                        <Row gutter={24}>
                                            <Col md={22}>
                                                <Form.Item>
                                                    <Button
                                                        ref={input => this.addVariantBtn = input}
                                                        type="dashed"
                                                        onClick={() => {
                                                            add({
                                                                "name": "",
                                                                "options": []
                                                            },);
                                                        }}
                                                        block
                                                    >
                                                        <PlusOutlined/> Add variant
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )
                                }
                            </div>
                        );
                    }}
                </Form.List>
            </Card>
        );
    }
}

Variants.propTypes = {};

export default Variants;
