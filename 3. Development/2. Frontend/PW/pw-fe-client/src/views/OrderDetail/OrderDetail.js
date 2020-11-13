import React, { Component } from 'react';
import { Row, Col, Card, Button, Typography, Badge, Checkbox, message } from 'antd';
import {
    ShoppingCartOutlined,
    EditOutlined,
    PauseCircleOutlined,
    ExportOutlined,
    FileTextOutlined,
    ShopOutlined,
    SolutionOutlined,
    ContactsOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

import cls from "./OrdersDetail.module.less";
import capitalize from '../../core/util/capitalize';
import getImageUrl from '../../core/util/getImageUrl';
import PrintDesignDrawer from '../../components/Drawer/PrintDesign/PrintDesign';
import EditShippingOrder from '../../components/Modal/EditShippingOrder/EditShippingOrder';
import EditNoteOrder from '../../components/Modal/EditNoteOrder/EditNoteOrder';
import OnHoldModal from '../../components/Modal/OnHoldModal/OnHoldModal';
import ResendModal from '../../components/Modal/ResendModal/ResendModal';
import ModalCheckMoreAction from '../../components/Modal/ModalCheckMoreAction/ModalCheckMoreAction';
import checkMoreAction from '../../core/util/checkMoreAction';
import TimeLine from '../../components/TimeLine/TimeLine';

const { Title, Text } = Typography;
const key = "resend";

export default class OrderDetail extends Component {
    state = {
        openPrintDesignDrawer: false,
        lineItemCurrent: {},
        lineItemsWithOrderId: [],
        openEditNoteModal: false,
        openEditShippingModal: false,
        rowsSelected: [],
        openModalResend: false,
        openModalOnHold: false,
    }
    componentDidMount() {
        const { fetchOneOrder, match } = this.props;

        fetchOneOrder(match.params.id);

    }
    componentDidUpdate(preProps) {
        const { oneOrder } = this.props;
        const { order, success } = oneOrder;

        if (success && preProps.oneOrder.success !== success) {
            this.setState({
                lineItemsWithOrderId: (order.lineItems || []).map(item => ({
                    ...item, orderId: order.id, currency: order.currency, checked: false
                }))
            })
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { onHoldSuccess, onHoldError, resendError, resendSuccess, match, editNoteSuccess, editNoteError, editShippingSuccess, editShippingError } = this.props;
        if (nextProps.resendSuccess && nextProps.resendSuccess !== resendSuccess) {
            message.success({ content: "Resend success!", key });
            this.setState({
                openModalResend: false,
                rowsSelected: [],
                lineItemCurrent: null
            }, () => this.props.fetchOneOrder(match.params.id))
        }
        if (nextProps.resendError && nextProps.resendError !== resendError) {
            message.error({ content: "Resend error!", key });
        }
        if (nextProps.onHoldSuccess && nextProps.onHoldSuccess !== onHoldSuccess) {
            message.success("On hold success!")
            this.setState({
                openModalOnHold: false,
                rowsSelected: [],
                lineItemCurrent: null
            }, () => this.props.fetchOneOrder(match.params.id))
        }
        if (nextProps.onHoldError && nextProps.onHoldError !== onHoldError) {
            message.error("On hold error!")
        }
        if (nextProps.editNoteSuccess && nextProps.editNoteSuccess !== editNoteSuccess) {
            message.success("Edit note success!")
            this.setState({
                openEditNoteModal: false,
                rowsSelected: [],
                lineItemCurrent: null
            }, () => this.props.fetchOneOrder(match.params.id))
        }
        if (nextProps.editNoteError && nextProps.editNoteError !== editNoteError) {
            message.error("Edit note error!")
        }
        if (nextProps.editShippingSuccess && nextProps.editShippingSuccess !== editShippingSuccess) {
            message.success("Edit shipping success!")
            this.setState({
                openEditShippingModal: false,
                rowsSelected: [],
                lineItemCurrent: null
            }, () => this.props.fetchOneOrder(match.params.id))
        }
        if (nextProps.editShippingError && nextProps.editShippingError !== editShippingError) {
            message.error("Edit shipping error!")
        }
    }
    onChangeCheckBox = e => {
        const { rowsSelected } = this.state;
        const lineItem = e.target.value;
        if (e.target.checked) {
            const newArr = [...rowsSelected, lineItem];
            this.setState({ rowsSelected: newArr })
            this.setState({ lineItemsWithOrderId: this.state.lineItemsWithOrderId.map(item => {
                if(item.sku === lineItem.sku) return {...item, checked: true}
                return item;
            })})
        }
        else {
            const newArr = rowsSelected.filter(x => x.id !== lineItem.id)
            this.setState({ rowsSelected: newArr })
            this.setState({ lineItemsWithOrderId: this.state.lineItemsWithOrderId.map(item => {
                if(item.sku === lineItem.sku) return {...item, checked: false}
                return item;
            })})
        }
    }
    checkStatusOrder = order => {
        const date = new Date();
        if( date < new Date(order.coolingOffExp)) {
            return "Cooling-off"
        }
        return capitalize(order.status)
    }
    render() {
        const {
            openPrintDesignDrawer,
            lineItemCurrent,
            openEditShippingModal,
            rowsSelected,
            openModalOnHold,
            openEditNoteModal,
            lineItemsWithOrderId
        } = this.state;
        const {
            oneOrder,
            saveImageDesign,
            saveImageDesignSuccess,
            saveImageDesignError,
            doSaveImageDesign,

            editNote,
            editNoteSuccess,
            editNoteError,
            doEditNote,

            editShipping,
            editShippingSuccess,
            editShippingError,
            doEditShipping,

            history,
            onHold,
            onHoldLoading,
            resend,
            resendLoading,

            auth
        } = this.props;
        const { order, loading } = oneOrder;
        // const { user } = oneUser;
        const { userInfo } = auth;

        // const lineItemsWithOrderId = (order.lineItems || []).map(item => ({
        //     ...item, orderId: order.id
        // }))
        const orderLogsGroupByDate = (order.orderLogs || []).map(x => {
            return { ...x, date: new Date(x.time).toLocaleDateString(), hourAndMin: new Date(x.time).toLocaleTimeString() }
        })
        let groupOrderLogs = orderLogsGroupByDate.reduce((r, a) => {
            r[a.date] = [...r[a.date] || [], a];
            return r;
        }, {});
        const renderTimeline = () => {
            const arr = []
            for (let key in groupOrderLogs) {
                arr.push(
                    <div key={key}>
                        <h3 style={{ marginLeft: "26px", paddingBottom: "20px" }}>{key}</h3>
                        <TimeLine data={groupOrderLogs[key].reverse()} />
                    </div>
                )
            }
            return arr.reverse();
        }
        const ButtonGroup = ({ rowsSelected }) => {
            return (
                rowsSelected.length > 0 ? (
                    <div className={cls.btnGroup}>
                        <Button
                            onClick={() => {
                                this.setState({ rowsSelected: [] });
                                this.setState({
                                    lineItemsWithOrderId: this.state.lineItemsWithOrderId.map(item => {
                                        return { ...item, checked: false }
                                    })
                                })
                            }}
                            style={{ marginRight: '16px' }}

                        >
                            <Checkbox indeterminate={rowsSelected.length > 0} className={cls.totalRow}>{`${rowsSelected.length} selected`}</Checkbox>
                        </Button>
                        <Button
                            type="default"
                            icon={<PauseCircleOutlined />}
                            style={{ marginRight: '16px' }}
                            size={isMobile ? 'small' : 'middle'}
                            disabled={rowsSelected.length === 0}
                            onClick={() => {
                                if (checkMoreAction("ON_HOLD", rowsSelected)) {
                                    this.setState({ openModalOnHold: true })
                                }
                                else {
                                    ModalCheckMoreAction("ON_HOLD")
                                }
                            }}
                        >
                            On hold
                        </Button>
                        <Button
                            type="default"
                            icon={<ExportOutlined />}
                            style={{ marginRight: '16px' }}
                            size={isMobile ? 'small' : 'middle'}
                            disabled={rowsSelected.length === 0}
                            onClick={() => ResendModal(
                                resendLoading,
                                resend,
                                null,
                                rowsSelected,
                                () => { },
                                key
                            )}
                        >
                            Resend
                        </Button>
                    </div>
                ) : (<Text className={cls.bold}> Product </Text>)
            )
        }
        return (
            <>
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col md={24} xs={24}>
                        <Card
                            title={
                                <Text>
                                    <ShoppingCartOutlined style={{ marginRight: '5px' }} /> <span className={cls.breakCrum} onClick={() => history.goBack()}>ORDERS MANAGER</span> {">"} DETAILS
                                </Text>
                            }
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        >
                            <div className={cls.detail} >
                                <Title level={2}>{order.orderName && ("#" + order.orderName)}</Title>
                                {/* <p>{order.orderId && order.orderId}</p> */}
                                <p>{order.createdDate && new Date(order.createdDate).toLocaleString('en-GB')}</p>
                                {/* <Tag icon={<SyncOutlined />} color={order.status === "PROCESSING" ? "blue" : (order.status === "COMPLETED" ? "green" : "red")}>{order.status && capitalize(order.status)}</Tag> */}
                            </div>

                        </Card>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col md={16} xs={24}>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<ButtonGroup rowsSelected={rowsSelected} />}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        // extra={<Button style={{ marginRight: '16px' }} />}
                        >
                            {(lineItemsWithOrderId || []).map((item, index) => {
                                return (
                                    <div className={cls.card} key={index}>
                                        <Checkbox value={item} children=" " onChange={this.onChangeCheckBox} className={cls.checkbox} checked={item.checked} />
                                        <div className={cls.cardImg}>
                                            <img src={getImageUrl(item.imageId)} alt={index} />
                                        </div>
                                        <div className={cls.cardContent}>
                                            <div className={cls.cardTitle}>
                                                <h4 className={cls.bold}>{item.name}</h4>
                                                <Badge count={item.numberDesignMissing}>
                                                    <Button onClick={() => this.setState({ lineItemCurrent: item, openPrintDesignDrawer: true })}>
                                                        Design
                                                    </Button>
                                                </Badge>

                                            </div>
                                            <div className={cls.cardDescription}>
                                                <div className={cls.cardDescriptionLeft}>
                                                    <div><span className={cls.title}>Product status: </span><span>{capitalize(item.status)}</span></div>
                                                    <div><span className={cls.title}>Quantity: </span><span>{item.quantity}</span></div>
                                                    <div><span className={cls.title}>Base cost: </span><span>{parseFloat(item.baseCost).toLocaleString('en-GB')}{item.currency === 'VND' ? 'đ':'$'}</span></div>
                                                </div>
                                                <div className={cls.cardDescriptionRight}>
                                                    <div><span className={cls.title}>Product SKU: </span><span>{item.sku}</span></div>
                                                    {/* <div><span className={cls.title}>Supplier: </span><span>{item.supplier}</span></div> */}
                                                    <div><span className={cls.title}>Carrier: </span><span>{item.carrier}</span></div>
                                                    <div><span className={cls.title}>Tracking ID: </span>
                                                        <span>
                                                            <a href={item.trackingUrl} target="blank" children={item.trackingNumber} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </Card>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}> Order logs </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        >
                            {renderTimeline()}
                        </Card>
                    </Col>
                    <Col md={8} xs={24}>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}><EditOutlined /> Notes </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            extra={
                                <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    size={isMobile ? 'small' : 'middle'}
                                    onClick={() => this.setState({ openEditNoteModal: true })}
                                >
                                    Edit
                            </Button>
                            }
                            loading={loading}
                        >
                            <p>{order.note}</p>
                        </Card>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}><FileTextOutlined /> Order information </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        >
                            <div className={cls.description}>
                                <p className={cls.title}>Order status:</p>
                                <span>{order.status && this.checkStatusOrder(order)}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Total orders:</p>
                                <span>{(parseFloat(order.total) || 0).toLocaleString('en-US')}{order.currency === 'VND' ? 'đ':'$'}</span>
                            </div>
                        </Card>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}><SolutionOutlined /> Seller information </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        >
                            <div className={cls.description}>
                                <p className={cls.title}>Seller name:</p>
                                <span>{(userInfo.data || {}).firstName || '' + " " + (userInfo.data || {}).lastName || ''}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Email:</p>
                                <span>{order.sellerEmail}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Seller plan:</p>
                                <span>{order.sellerPlan}</span>
                            </div>
                        </Card>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}><ShopOutlined /> Store information </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        >
                            <div className={cls.description}>
                                <p className={cls.title}>Site:</p>
                                <span>{order && order.site && order.site.url && order.site.virtual ? "Virtual site" : <a target='blank' href={(order.site || { url: "" }).url}>{(order.site || { title: "" }).title}</a>}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Platform:</p>
                                <span>{order && order.site && order.site.siteType === "WOO" ? "Woo Commerce" : "Shoplify"}</span>
                            </div>
                        </Card>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}><ContactsOutlined /> Customer information </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            loading={loading}
                        >
                            <div className={cls.description}>
                                <p className={cls.title}>Customer:</p>
                                <span>{order.billingAddress && (order.billingAddress.firstName || '' + " " + order.billingAddress.lastName || '')}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Email:</p>
                                <span>{order.billingAddress && order.billingAddress.email || ''}</span>
                            </div>
                        </Card>
                        <Card
                            style={{ marginBottom: "20px" }}
                            title={<Text className={cls.bold}><ShoppingCartOutlined /> Shipping information </Text>}
                            headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            bodyStyle={{ paddingBottom: '12px' }}
                            extra={
                                <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    size={isMobile ? 'small' : 'middle'}
                                    onClick={() => this.setState({ openEditShippingModal: true })}
                                >
                                    Edit
                                </Button>
                            }
                            loading={loading}
                        >
                            <div className={cls.description}>
                                <p className={cls.title}>Fullname:</p>
                                <span>
                                    {order && order.shippingAddress && order.shippingAddress.firstName && order.shippingAddress.lastName &&
                                        order.shippingAddress.firstName + " " + order.shippingAddress.lastName}
                                </span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Address:</p>
                                <span>
                                    {order && order.shippingAddress && (order.shippingAddress.address1 || "") + " " + (order.shippingAddress.address2 || "")}
                                </span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Company:</p>
                                <span>{order && order.shippingAddress && order.shippingAddress.company}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Zip:</p>
                                <span>{order && order.shippingAddress && order.shippingAddress.postcode}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>State/Province code:</p>
                                <span>{order && order.shippingAddress && order.shippingAddress.province}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Country code:</p>
                                <span>{order && order.shippingAddress && order.shippingAddress.country}</span>
                            </div>
                            <div className={cls.description}>
                                <p className={cls.title}>Phone Number:</p>
                                <span>{order.billingAddress && order.billingAddress.phone}</span>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <PrintDesignDrawer
                    visible={openPrintDesignDrawer}
                    onClose={() => this.setState({ openPrintDesignDrawer: false, lineItemCurrent: {} })}
                    lineItemCurrent={lineItemCurrent}
                    saveImageDesign={saveImageDesign}
                    doSaveImageDesign={doSaveImageDesign}
                    saveImageDesignSuccess={saveImageDesignSuccess}
                    saveImageDesignError={saveImageDesignError}
                />
                <EditShippingOrder
                    visible={openEditShippingModal}
                    handleCancel={() => this.setState({ openEditShippingModal: false })}
                    order={order}
                    editShipping={editShipping}
                    editShippingSuccess={editShippingSuccess}
                    editShippingError={editShippingError}
                    doEditShipping={doEditShipping}
                />
                <EditNoteOrder
                    visible={openEditNoteModal}
                    handleCancel={() => this.setState({ openEditNoteModal: false })}
                    order={order}
                    editNote={editNote}
                    editNoteSuccess={editNoteSuccess}
                    editNoteError={editNoteError}
                    doEditNote={doEditNote}
                />
                <OnHoldModal
                    visible={openModalOnHold}
                    handleCancel={() => this.setState({ openModalOnHold: false })}
                    nestedRowsSelected={rowsSelected}
                    onHoldLoading={onHoldLoading}
                    onHold={onHold}
                />
                {/* <ResendModal
                    visible={openModalResend}
                    handleCancel={() => this.setState({ openModalResend: false, lineItemCurrent: null })}
                    nestedRowsSelected={rowsSelected}
                    resend={resend}
                    resendLoading={resendLoading}
                /> */}
            </>
        )
    }
}
