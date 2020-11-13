import React, {Component} from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Switch,
    Modal,
    InputNumber,
    Collapse,
    Table,
    Space,
    Checkbox
} from "antd";
import * as _ from 'lodash';
import {DollarCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";

let suppliersData = [];

const {Panel} = Collapse;

const layout = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
};

class VariantDetails extends Component {

    state = {
        selectedRowKeys: [],
        selectedRows: [],
        visible: false,
        showHeader: true,
        editType: ''
    };

    showModal = (type) => {
        this.setState({
            editType: type,
            visible: true,
        });
    };


    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRowKeys, selectedRows});
        if (selectedRows.length > 0) {
            this.setState({
                showHeader: false
            })
        } else {
            this.setState({
                showHeader: true
            })
        }
    };

    onFinish = (values, type) => {

        let currentVariantDetails = this.props.form.current.getFieldValue('variantDetails');

        // console.log('before', currentVariantDetails);

        // const {form} = this.props;
        const {selectedRows} = this.state;

        // form.current.setFieldsValue({'variantDetails': currentVariantDetails})

        if (type === 'product') {

            const {baseCost, retailCost, saleCost} = values;

            for (let i = 0; i < selectedRows.length; i++) {
                if (currentVariantDetails[selectedRows[i].key]) {
                    currentVariantDetails[selectedRows[i].key].baseCost = baseCost;
                    currentVariantDetails[selectedRows[i].key].retailCost = retailCost;
                    currentVariantDetails[selectedRows[i].key].saleCost = saleCost;
                }
            }

            // await form.current.setFieldsValue({'variantDetails': currentVariantDetails});

            this.handleCancel();


        } else if (type === 'status') {
            let {status} = values;

            for (let i = 0; i < selectedRows.length; i++) {
                if (currentVariantDetails[selectedRows[i].key]) {
                    currentVariantDetails[selectedRows[i].key].enable = status;
                }
            }

            // await form.current.setFieldsValue({'variantDetails': currentVariantDetails});
            this.handleCancel();

        } else if (type === 'supplier') {
            let arrayValue = Object.values(values);

            // console.log(arrayValue, currentVariantDetails, selectedRows);
            // console.log('before', currentVariantDetails);

            for (let i = 0; i < selectedRows.length; i++) {
                if (currentVariantDetails[selectedRows[i].key]) {
                    for (let j = 0; j < currentVariantDetails[selectedRows[i].key].supplierCosts.length; j++) {
                        // console.log('vo');
                        currentVariantDetails[selectedRows[i].key].supplierCosts[j].cost = arrayValue[j];
                        // console.log('after', currentVariantDetails);
                    }
                }
            }

            // form.current.setFieldsValue({'variantDetails': currentVariantDetails});
            this.handleCancel();

        }

    };


    render() {

        const {selectedRowKeys, editType, visible, showHeader, form} = this.state;

        const {listSuppliersNoPaging, disableField} = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const hasSelected = selectedRowKeys.length > 0;

        let supplierInitialValues = {};
        for (let i = 0; i < suppliersData.length; i++) {
            supplierInitialValues[`value${i}`] = 0
        }

        // console.log('123', supplierInitialValues);

        return (
            <Card
                title='Preview'
            >
                {
                    <Collapse defaultActiveKey={['1']} expandIconPosition='right' bordered={false}
                              style={{backgroundColor: 'white'}}>
                        <Panel
                            key="1"
                            className="user-collapse-custom-panel"
                            style={{borderBottom: 'none'}}
                        >
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.variantDetails !== currentValues.variantDetails}>
                                {({getFieldValue}) => {
                                    // console.log(getFieldValue('variantDetails'));
                                    suppliersData = getFieldValue('suppliers');
                                    let currentVariants = getFieldValue('variants');
                                    if (currentVariants && currentVariants.length > 0 && currentVariants[0] && currentVariants[0].name && currentVariants[0].options.length > 0) {
                                        return (
                                            <Form.List name="variantDetails">
                                                {(fields) => {
                                                    const dataSource = fields.map((field, index) => ({
                                                        key: index,
                                                        variants: `${getFieldValue('variantDetails')[field.name].option1}${getFieldValue('variantDetails')[field.name].option2 ? '/' : ''}${getFieldValue('variantDetails')[field.name].option2 ? getFieldValue('variantDetails')[field.name].option2 : ''}`,
                                                        sku: (
                                                            <Form.Item
                                                                name={[field.name, 'sku']}
                                                                style={{marginBottom: 0}}
                                                            >
                                                                <Input disabled/>
                                                            </Form.Item>
                                                        ),
                                                        supplierCosts: (
                                                            <Form.List
                                                                name={[field.name, 'supplierCosts']}>
                                                                {(fields2) => {
                                                                    return (
                                                                        <div>
                                                                            {
                                                                                fields2.map((field2, i) => {
                                                                                    return (
                                                                                        <Row
                                                                                            key={`${field2.key}`}>
                                                                                            <Col md={10}>
                                                                                                <Form.Item
                                                                                                    noStyle
                                                                                                    shouldUpdate={(prevValues, currentValues) => prevValues.variantDetails !== currentValues.variantDetails}>
                                                                                                    {({getFieldValue}) => {
                                                                                                        return (
                                                                                                            <span
                                                                                                                style={{fontSize: '.75rem'}}>
                                                                                                                  {
                                                                                                                      getFieldValue('variantDetails')
                                                                                                                      && listSuppliersNoPaging.suppliers.length > 0
                                                                                                                      && `${_.find(listSuppliersNoPaging.suppliers,
                                                                                                                          {id: getFieldValue('variantDetails')[field.name].supplierCosts[field2.name].supplier.id}) ? _.find(listSuppliersNoPaging.suppliers,
                                                                                                                          {id: getFieldValue('variantDetails')[field.name].supplierCosts[field2.name].supplier.id}).firstName : ''}
                                                                                                                          ${_.find(listSuppliersNoPaging.suppliers,
                                                                                                                          {id: getFieldValue('variantDetails')[field.name].supplierCosts[field2.name].supplier.id}) ? _.find(listSuppliersNoPaging.suppliers,
                                                                                                                          {id: getFieldValue('variantDetails')[field.name].supplierCosts[field2.name].supplier.id}).lastName : ''}`
                                                                                                                  }
                                                                                                            </span>
                                                                                                        )
                                                                                                    }}
                                                                                                </Form.Item>
                                                                                            </Col>
                                                                                            <Col md={14}>
                                                                                                <Form.Item
                                                                                                    name={[field2.name, 'cost']}
                                                                                                    style={i === fields2.length - 1 ? {marginBottom: 0} : {}}
                                                                                                >
                                                                                                    <InputNumber
                                                                                                        style={{width: '100%'}}
                                                                                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                                    />
                                                                                                </Form.Item>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    )
                                                                }}
                                                            </Form.List>
                                                        ),
                                                        seller: (
                                                            <>
                                                                <Row>
                                                                    <Col md={10}
                                                                         style={{marginTop: '5px'}}>
                                                                        <span
                                                                            style={{fontSize: '.75rem'}}>Base Cost</span>
                                                                    </Col>
                                                                    <Col md={14}>
                                                                        <Form.Item
                                                                            name={[field.name, 'baseCost']}
                                                                        >
                                                                            <InputNumber
                                                                                style={{width: '100%'}}
                                                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={10}
                                                                         style={{marginTop: '5px'}}>
                                                                        <span
                                                                            style={{fontSize: '.75rem'}}>Regular Price </span>
                                                                    </Col>
                                                                    <Col md={14}>
                                                                        <Form.Item
                                                                            name={[field.name, 'retailCost']}
                                                                        >
                                                                            <InputNumber
                                                                                style={{width: '100%'}}
                                                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={10}>
                                                                        <span
                                                                            style={{fontSize: '.75rem'}}>Sale Price</span>
                                                                    </Col>
                                                                    <Col md={14}>
                                                                        <Form.Item
                                                                            name={[field.name, 'saleCost']}
                                                                            style={{marginBottom: 0}}
                                                                        >
                                                                            <InputNumber
                                                                                style={{width: '100%'}}
                                                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </>
                                                        ),
                                                        status: (
                                                            <Form.Item
                                                                name={[field.name, 'enable']}
                                                                valuePropName="checked"
                                                            >
                                                                <Switch disabled={disableField}/>
                                                            </Form.Item>
                                                        )
                                                    }));


                                                    const columns = [
                                                        {
                                                            title: 'Variants',
                                                            dataIndex: 'variants',
                                                            key: 'variants',
                                                        },
                                                        {
                                                            title: 'SKU',
                                                            dataIndex: 'sku',
                                                            key: 'sku',
                                                        },
                                                        {
                                                            title: 'Supplier Costs',
                                                            dataIndex: 'supplierCosts',
                                                            key: 'supplierCosts',
                                                        },
                                                        {
                                                            title: 'Seller',
                                                            dataIndex: 'seller',
                                                            key: 'seller',
                                                        },
                                                        {
                                                            title: 'Status',
                                                            dataIndex: 'status',
                                                            key: 'status',
                                                        },
                                                    ];

                                                    return (
                                                        <>
                                                            {
                                                                hasSelected && (
                                                                    <Space style={{marginBottom: 16}}>
                                                                        <Button
                                                                            onClick={() => this.setState({
                                                                                showHeader: true,
                                                                                selectedRowKeys: []
                                                                            })}
                                                                        >
                                                                            <Checkbox
                                                                                indeterminate
                                                                                style={{marginRight: 5}}
                                                                            />
                                                                            <span
                                                                                style={{color: '#1890ff'}}>{selectedRowKeys.length} selected </span>
                                                                        </Button>
                                                                        {
                                                                            getFieldValue('suppliers').length > 0 &&
                                                                            (
                                                                                <Button
                                                                                    icon={<DollarCircleOutlined/>}
                                                                                    onClick={() => this.showModal('supplier')}
                                                                                >
                                                                                    Edit supplier cost
                                                                                </Button>
                                                                            )
                                                                        }
                                                                        <Button
                                                                            icon={<DollarCircleOutlined/>}
                                                                            onClick={() => this.showModal('product')}
                                                                        >
                                                                            Edit product cost
                                                                        </Button>
                                                                        {
                                                                            !disableField && (
                                                                                <Button
                                                                                    icon={<InfoCircleOutlined/>}
                                                                                    onClick={() => this.showModal('status')}
                                                                                >
                                                                                    Edit status
                                                                                </Button>
                                                                            )
                                                                        }
                                                                    </Space>
                                                                )
                                                            }
                                                            <Table
                                                                dataSource={dataSource}
                                                                columns={columns}
                                                                pagination={false}
                                                                showHeader={showHeader}
                                                                rowSelection={{
                                                                    ...rowSelection,
                                                                }}
                                                            />
                                                        </>
                                                    )
                                                }}
                                            </Form.List>
                                        )
                                    }

                                }}
                            </Form.Item>
                        </Panel>
                    </Collapse>
                }
                <Modal
                    title={
                        editType === 'supplier'
                            ? 'Edit supplier cost'
                            : editType === 'product'
                            ? 'Edit product cost'
                            : 'Edit status'
                    }
                    visible={visible}
                    onOk={() => this.submitBtn.click()}
                    onCancel={this.handleCancel}
                >
                    {
                        editType === 'product' && (
                            <Row>
                                <Col md={16}>
                                    <Form
                                        {...layout}
                                        name={editType}
                                        initialValues={{
                                            baseCost: 0,
                                            retailCost: 0,
                                            saleCost: 0
                                        }}
                                        onFinish={(values) => this.onFinish(values, editType)}
                                    >
                                        <Form.Item
                                            label="Base cost"
                                            name="baseCost"
                                            // rules={[{required: true, message: 'Please input your username!'}]}
                                        >
                                            <InputNumber
                                                style={{width: '100%'}}
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Regular Price"
                                            name="retailCost"
                                            // rules={[{required: true, message: 'Please input your username!'}]}
                                        >
                                            <InputNumber
                                                style={{width: '100%'}}
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Sale Price"
                                            name="saleCost"
                                            // rules={[{required: true, message: 'Please input your username!'}]}
                                        >
                                            <InputNumber
                                                style={{width: '100%'}}
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}>
                                            <Button ref={input => this.submitBtn = input} htmlType="submit">
                                                Save
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        )
                    }

                    {
                        editType === 'status' && (
                            <Row>
                                <Col md={14}>
                                    <Form
                                        name={editType}
                                        initialValues={{
                                            status: false,
                                        }}
                                        onFinish={(values) => this.onFinish(values, editType)}
                                    >
                                        <Form.Item
                                            label="Status"
                                            name="status"
                                            valuePropName="checked"
                                            // rules={[{required: true, message: 'Please input your username!'}]}
                                        >
                                            <Switch/>
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}>
                                            <Button ref={input => this.submitBtn = input} htmlType="submit">
                                                Save
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        )
                    }

                    {
                        editType === 'supplier' && (
                            <Row>
                                <Col md={16}>
                                    <Form
                                        {...layout}
                                        name={editType}
                                        initialValues={supplierInitialValues}
                                        onFinish={(values) => this.onFinish(values, editType)}
                                    >
                                        {
                                            suppliersData.map((value, index) => (
                                                <Form.Item
                                                    key={value}
                                                    label={`${_.find(listSuppliersNoPaging.suppliers, {id: value}).lastName || ''} ${_.find(listSuppliersNoPaging.suppliers, {id: value}).firstName || ''}`}
                                                    name={`value${index}`}
                                                    // rules={[{required: true, message: 'Please input your username!'}]}
                                                >
                                                    <InputNumber
                                                        style={{width: '100%'}}
                                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                    />
                                                </Form.Item>
                                            ))
                                        }
                                        <Form.Item style={{display: 'none'}}>
                                            <Button ref={input => this.submitBtn = input} htmlType="submit">
                                                Save
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        )
                    }

                </Modal>
            </Card>
        );
    }
}

VariantDetails.propTypes = {};

export default VariantDetails;
