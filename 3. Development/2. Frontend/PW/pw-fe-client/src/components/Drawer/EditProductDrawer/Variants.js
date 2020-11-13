import React, {Component} from 'react';
import {Button, Card, Col, Form, Input, Row, Select, Tooltip} from "antd";
import {MinusCircleOutlined, PlusOutlined, InfoCircleOutlined} from "@ant-design/icons";


class Variants extends Component {

    render() {

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
                                        <Col md={11}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'name']}
                                                fieldKey={[field.fieldKey, 'name']}
                                                onChange={this.onChange}
                                                rules={[{required: true, message: 'Missing name'}]}
                                            >
                                                <Input placeholder={'Enter Name'}/>
                                            </Form.Item>
                                        </Col>
                                        <Col md={11}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'options']}
                                                fieldKey={[field.fieldKey, 'options']}
                                                rules={[{required: true, message: 'Missing options'}]}
                                            >
                                                <Select
                                                    onChange={this.onChange}
                                                    mode="tags" style={{width: '100%'}}
                                                    placeholder={'Enter options'}
                                                    // placeholder="Tags Mode"
                                                />

                                            </Form.Item>
                                        </Col>
                                        <Col md={2}>
                                            {
                                                fields.length > 1 && (
                                                    <MinusCircleOutlined
                                                        onClick={remove(field.name)}
                                                    />
                                                )
                                            }
                                        </Col>
                                    </Row>
                                ))}

                                {
                                    fields.length < 2 && (
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
