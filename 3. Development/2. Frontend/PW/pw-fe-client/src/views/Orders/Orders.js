import React, { Component } from 'react';
import { Card, Button, Input, Select, Row, Col, Menu, Badge, Table, Checkbox, Dropdown, Tooltip, Tag, message, DatePicker, Space } from 'antd';
import {
    UploadOutlined,
    ShoppingCartOutlined,
    DownloadOutlined,
    FilterOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SettingOutlined,
    ExportOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    PauseCircleOutlined,
    FormOutlined,
    ClockCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import * as _ from 'lodash';

import * as config from '../../config/project.config';
import FilterOrdersDrawer from '../../components/Drawer/FilterOrdersDrawer/FilterOrdersDrawer';
import PrintDesignDrawer from '../../components/Drawer/PrintDesign/PrintDesign';
import ResolveModal from '../../components/Modal/ResolveModal/ResolveModal';
import OnHoldModal from '../../components/Modal/OnHoldModal/OnHoldModal';
import ImportOrderModal from '../../components/Modal/ImportOrder/ImportOrderModal';
// import RefundOrder from '../../components/Modal/RefundOrder/RefundOrder';
// import AssignSupplier from '../../components/Modal/AssignSupplier/AssignSupplier';
import ResendModal from '../../components/Modal/ResendModal/ResendModal';
import CancelModal from '../../components/Modal/CancelModal/CancelModal';
import cls from './Orders.module.less';
import capitalize from '../../core/util/capitalize';
import getImageUrl from '../../core/util/getImageUrl';
import moment from 'moment';
import ModalCheckMoreAction from '../../components/Modal/ModalCheckMoreAction/ModalCheckMoreAction';
import ModalCheckAssign from '../../components/Modal/ModalCheckAssign/ModalCheckAssign';
import checkMoreAction from '../../core/util/checkMoreAction';
import checkAssign from '../../core/util/checkAssign';
import AssignCarrierModal from '../../components/Modal/AssignCarrier/AssignCarrier';
import checkSiteStatus from "../../core/util/checkSiteStatus";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const tagStyle = {
    marginBottom: '15px',
    fontSize: '13px',
    padding: '2px 8px',
    borderStyle: 'dashed',
};
const key = "resend";

export default class Orders extends Component {
    state = {
        active: "ALL",
        currentPage: 0,
        pageSize: 10,
        keyword: "",
        startDate: null,
        endDate: null,
        rowsSelected: [],
        expandedRowKeys: [],
        nestedRowsSelected: [],
        nestedRowKeysSelected: [],
        openMoreFilterDrawer: false,
        openPrintDesignDrawer: false,
        lineItemCurrent: null,
        openModalResolveOnHold: false,
        openModalOnHold: false,
        openModalAssignSupplier: false,
        openModalImportOrder: false,
        productTypeId: undefined,
        seller: undefined,
        supplier: undefined,
        site: undefined,
        openModalResend: false,
        openModalCancel: false,
        openModalAssignCarrier: false,
        showBadge:true,
    }
    componentDidMount() {
        const { fetchAllProductTypeNoPaging, fetchAllOrder, getAllSupplier, fetchAllSitesNoPaging, fetchStatistic, fetchAllCarriesNoPaging } = this.props;
        fetchAllOrder(this.checkParam());
        fetchAllProductTypeNoPaging();
        getAllSupplier();
        fetchAllSitesNoPaging();
        fetchStatistic();
        fetchAllCarriesNoPaging();
        const expandedRowKeys = JSON.parse(localStorage.getItem("expandedRowKeys") || "[]");
        this.setState({ expandedRowKeys })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            resolveOnHoldSuccess,
            resolveOnHoldError,
            onHoldSuccess,
            onHoldError,
            exportError,
            resendSuccess,
            resendError,
            cancelSuccess,
            cancelError,
            assignCarrierError,
            assignCarrierSuccess
        } = this.props;
        if (nextProps.resolveOnHoldSuccess && nextProps.resolveOnHoldSuccess !== resolveOnHoldSuccess) {
            message.success("Resolve success!")
            this.setState({ openModalResolveOnHold: false, nestedRowKeysSelected: [], rowsSelected: [], nestedRowsSelected: [] }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.resolveOnHoldError && nextProps.resolveOnHoldError !== resolveOnHoldError) {
            message.error("Resolve error!")
        }
        if (nextProps.onHoldSuccess && nextProps.onHoldSuccess !== onHoldSuccess) {
            message.success("On hold success!")
            this.setState({
                openModalOnHold: false,
                nestedRowKeysSelected: [],
                rowsSelected: [],
                nestedRowsSelected: [],
                lineItemCurrent: null
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.onHoldError && nextProps.onHoldError !== onHoldError) {
            message.error("On hold error!")
        }
        if (nextProps.exportError && nextProps.exportError !== exportError) {
            message.error("Export error!")
        }
        if (nextProps.resendSuccess && nextProps.resendSuccess !== resendSuccess) {
            message.success({ content: "Resend success!", key });
            this.setState({
                openModalResend: false,
                nestedRowKeysSelected: [],
                rowsSelected: [],
                nestedRowsSelected: [],
                lineItemCurrent: null
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.resendError && nextProps.resendError !== resendError) {
            message.error({ content: "Resend error!", key });
        }
        if (nextProps.cancelSuccess && nextProps.cancelSuccess !== cancelSuccess) {
            message.success("Cancel success!")
            this.setState({
                openModalCancel: false,
                nestedRowKeysSelected: [],
                rowsSelected: [],
                nestedRowsSelected: [],
                lineItemCurrent: null
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.cancelError && nextProps.cancelError !== cancelError) {
            message.error("Cancel error!")
        }
        if (nextProps.assignCarrierSuccess && nextProps.assignCarrierSuccess !== assignCarrierSuccess) {
            message.success("Assign carrier success!")
            this.setState({
                openModalAssignCarrier: false,
                nestedRowKeysSelected: [],
                rowsSelected: [],
                nestedRowsSelected: [],
                lineItemCurrent: null
            }, () => {
                this.refreshTable();
            })
        }
        if (nextProps.assignCarrierError && nextProps.assignCarrierError !== assignCarrierError) {
            message.error("Assign carrier error!")
        }
    }
    checkParam = () => {
        const {
            currentPage,
            pageSize,
            sortedInfo,
            keyword,
            active,
            startDate,
            endDate,
            productTypeId,
            // seller,
            supplier,
            site,
        } = this.state;

        const dataParams = {};

        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order}`
        }
        if (keyword) {
            dataParams.keyword = keyword;
        }
        if (active !== "ALL") {
            dataParams.itemStatus = active;
        }
        if (startDate && endDate) {
            dataParams.startDate = `${startDate.format('YYYY-MM-DDT00:00:00.000')}Z`;
            dataParams.endDate = `${endDate.format('YYYY-MM-DDT23:59:59.000')}Z`;
        }
        if (productTypeId) {
            dataParams.productTypeId = productTypeId;
        }
        // if (seller) {
        //     dataParams.seller = seller;
        // }
        if (supplier) {
            dataParams.supplier = supplier
        }
        if (site) {
            dataParams.siteId = site
        }
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };
    refreshTable = () => {
        // this.setState({
        //     currentPage: 0
        // }, () => this.props.fetchAllOrder(this.checkParam()))
        this.props.fetchAllOrder(this.checkParam());
        this.props.fetchStatistic();
    }
    // import & export
    import = () => {

    }
    export = () => {
        const { nestedRowsSelected } = this.state;
        const dataToPost = nestedRowsSelected.map(item => ({
            orderId: item.orderId,
            itemSku: item.sku
        }))
        if (dataToPost.length === 0) {
            this.props.exportOrder(this.checkParam())
        }
        else {
            this.props.exportOrder(this.checkParam(), dataToPost)
        }

    }
    // search click event
    onSearch = () => {
        this.setState({
            currentPage: 0,
            showBadge: false
        }, this.refreshTable)
    }
    debounceSearch = _.debounce(e => {
        this.setState({
            currentPage: 0,
            keyword: e.trim()
        }, () => {
            if (e.length !== 1) {
                this.refreshTable();
            }
        })
    }, 300);
    // change key word search
    onChangeKeyWord = e => {
        this.debounceSearch(e.target.value);

        if(e.target.value === '' && !this.state.startDate && !this.state.seller && !this.state.productTypeId){
            this.setState({
                showBadge: true
            })
        }else{
            this.setState({
                showBadge: false
            })
        }
    }
    // change tab
    onChangeTabs = (value) => {
        this.setState({
            currentPage: 0,
            active: value,
            nestedRowsSelected: [],
            expandedRowKeys: [],
            nestedRowKeysSelected: [],
            rowsSelected: []
        }, () => this.refreshTable())
    }
    // on chage size table
    onShowSizeChange = (current, pageSize) => {
        this.setState({ pageSize }, this.refreshTable)
    }
    handleTableChange = (pagination, filters, sorter) => {

        this.setState({
            currentPage: pagination.current - 1
        }, () => this.props.fetchAllOrder(this.checkParam()))

    };
    // on select rows
    onSelectRows = (selectedRowKeys, selectedRows) => {
        this.setState({ rowsSelected: selectedRowKeys })
    }
    // open & close more filter
    openMoreFilter = () => {
        this.setState({ openMoreFilterDrawer: true })
    }
    onCloseMoreFilter = () => {
        this.setState({ openMoreFilterDrawer: false })
    }
    // on change action
    // check status
    checkStatus = (status, record) => {
        // const { active } = this.state;
        // const date = new Date();
        // if (active === "COOLING_OFF" && date < new Date(record.coolingOffExp)) {
        //     return <span className={cls.black} children="Cooling off" />
        // }
        switch (status) {
            case "ON_HOLD":
                return (
                    <Tooltip title={record.note}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            children={capitalize(status)}
                            onClick={() => {
                                this.setState({ openModalResolveOnHold: true, lineItemCurrent: record })
                            }}
                        />
                    </Tooltip>
                )
            // case "NEED_PAY":
            //     const date = new Date();
            //     if (date < new Date(record.coolingOffExp)) {
            //         return <span className={cls.black} children="Cooling-off" />
            //     }
            //     return <span className={cls.black} children={capitalize(status)} />
            default:
                return <span className={cls.black} children={capitalize(status)} />
        }
    }
    onChooseMoreAction = (action) => {
        const { nestedRowsSelected } = this.state;
        const { resendLoading, resend } = this.props;
        switch (action) {
            case "ON_HOLD":
                this.setState({ openModalOnHold: true })
                break;
            case "RESEND":
                ResendModal(
                    resendLoading,
                    resend,
                    null,
                    nestedRowsSelected,
                    () => { },
                    key
                )
                break;
            case "CANCEL":
                this.setState({ openModalCancel: true })
                break;
            default:
                break;
        }
    }
    // nested row selected

    onSelectRowNested = (record, selected, selectedRows) => {
        const { nestedRowsSelected, nestedRowKeysSelected } = this.state;
        if (selected) {

            this.setState({
                nestedRowsSelected: [...nestedRowsSelected, record],
                nestedRowKeysSelected: [...nestedRowKeysSelected, record.resendId],
            }, () => {
                const { nestedRowsSelected } = this.state;
                this.setState({ rowsSelected: [...nestedRowsSelected.map(x => x.parentRow)] })
            })
        }
        else {
            const i = nestedRowKeysSelected.indexOf(record.resendId);
            this.setState({
                nestedRowsSelected: [...nestedRowsSelected.slice(0, i), ...nestedRowsSelected.slice(i + 1)],
                nestedRowKeysSelected: [...nestedRowKeysSelected.slice(0, i), ...nestedRowKeysSelected.slice(i + 1)],
                // rowsSelected: selectedRows.length === 0 ? row
            }, () => {
                const { nestedRowsSelected } = this.state;
                this.setState({ rowsSelected: [...nestedRowsSelected.map(x => x.parentRow)] })
            })
        }

    }
    // all nested rows selected
    onSelectAllNested = (selected, selectedRows, changeRows) => {
        const { nestedRowsSelected, nestedRowKeysSelected, rowsSelected } = this.state;

        const changeRowsId = changeRows.map(x => x.resendId);
        if (selected) {
            const arrKeyRemoveDuplicate = [...new Set([...nestedRowKeysSelected, ...changeRowsId])]
            const arrItemRemoveDuplicate = _.uniqWith([...nestedRowsSelected, ...changeRows], _.isEqual);
            const parentRowSelected = [...rowsSelected, changeRows[0].parentRow]
            this.setState({
                nestedRowsSelected: arrItemRemoveDuplicate,
                nestedRowKeysSelected: arrKeyRemoveDuplicate,
                rowsSelected: parentRowSelected
            })
        }
        else {
            const result1 = nestedRowKeysSelected.filter(id => !changeRowsId.includes(id));
            const result2 = nestedRowsSelected.filter(item => !changeRowsId.includes(item.resendId));
            const result3 = rowsSelected.filter(rowKey => !changeRows.map(x => x.parentRow).includes(rowKey))
            this.setState({
                nestedRowKeysSelected: [...result1],
                nestedRowsSelected: [...result2],
                rowsSelected: [...result3]
            })
        }
    }
    onSelectParent = (record, selected, selectedRows, changeRows) => {
        const { nestedRowsSelected, nestedRowKeysSelected } = this.state;
        if (selected) {
            const arrKeyRemoveDuplicate = [...new Set([...nestedRowKeysSelected, ...record.lineItems.map(x => x.resendId)])]
            const arrItemRemoveDuplicate = _.uniqWith([...nestedRowsSelected, ...record.lineItems], _.isEqual);
            this.setState({
                nestedRowsSelected: arrItemRemoveDuplicate,
                nestedRowKeysSelected: arrKeyRemoveDuplicate
            })
        }
        else {
            this.setState({
                nestedRowsSelected: nestedRowsSelected.filter(item => !record.lineItems.map(x => x.resendId).includes(item.resendId)),
                nestedRowKeysSelected: nestedRowKeysSelected.filter(id => !record.lineItems.map(x => x.resendId).includes(id))
            })
        }
    }
    onChangeDate = dates => {
        if (dates) {
            this.setState({
                currentPage: 0,
                startDate: dates[0],
                endDate: dates[1],
                nestedRowKeysSelected: [],
                nestedRowsSelected: [],
                rowsSelected: [],
                showBadge: false
            }, this.refreshTable)

        }
        else {
            this.setState({
                currentPage: 0,
                startDate: null,
                endDate: null,
                nestedRowKeysSelected: [],
                nestedRowsSelected: [],
                rowsSelected: [],
            }, this.refreshTable)

            if(!this.state.startDate && !this.state.keyword && !this.state.seller && !this.state.productTypeId){
                this.setState({
                    showBadge: true,
                })
            }
        }
    }
    onChangeProductType = (value) => {
        this.setState({
            currentPage: 0,
            productTypeId: value,
            nestedRowKeysSelected: [],
            rowsSelected: [],
            nestedRowsSelected: [],
            showBadge: false,
        }, () => this.refreshTable(this.checkParam()))

        if(!value && !this.state.startDate && !this.state.keyword && !this.state.seller && !this.state.site){
            this.setState({
                showBadge: true,
            })
        }
    }
    // onChangeSeller = value => {
    //     this.setState({
    //         seller: value
    //     }, () => this.refreshTable(this.checkParam()))
    // }
    onRemoveTag = tag => {
        switch (tag) {
            case "productType":
                this.onChangeProductType(undefined)
                break;
            // case "seller":
            //     this.onChangeSeller(undefined)
            case "date":
                this.onChangeDate(null)
                break;
            case "site":
                this.onChangeSite(null)
                break;
            default:
                break;
        }
    }
    onClearFilter = () => {
        this.setState({
            currentPage: 0,
            productTypeId: undefined,
            startDate: null,
            endDate: null,
            supplier: undefined,
            active: "ALL",
            site: undefined
        }, () => this.refreshTable())
    }

    setRowClassName = (record) => {
        return this.state.expandedRowKeys.includes(record.id) ? 'rowActive' : '';
    }

    lineItemAction = (action, record) => {
        const { resendLoading, resend } = this.props;
        switch (action) {
            case "RESEND":
                this.setState({ lineItemCurrent: record }, () => {
                    const { lineItemCurrent } = this.state;
                    ResendModal(
                        resendLoading,
                        resend,
                        lineItemCurrent,
                        [],
                        () => this.setState({ lineItemCurrent: null }),
                        key
                    )
                })
                break;
            case "CANCEL":
                this.setState({ openModalCancel: true, lineItemCurrent: record })
                break;
            case "ON_HOLD":
                this.setState({ openModalOnHold: true, lineItemCurrent: record })
                break;
            case "ASSIGN_CARRIER":
                this.setState({ openModalAssignCarrier: true, lineItemCurrent: record }, () => this.props.getAssignCarrier(record.productTypeId))
                break;
            default:
                break;
        }
    }
    onChangeSupplier = value => {
        this.setState({
            currentPage: 0,
            supplier: value,
            nestedRowsSelected: [],
            nestedRowKeysSelected: [],
            rowsSelected: []
        }, this.refreshTable)
    }
    onChangeSite = value => {
        this.setState({
            currentPage: 0,
            site: value,
            nestedRowsSelected: [],
            nestedRowKeysSelected: [],
            rowsSelected: [],
            showBadge: false,
        }, this.refreshTable)
        if(!value && !this.state.startDate && !this.state.keyword && !this.state.seller && !this.state.productTypeId){
            this.setState({
                showBadge: true,
            })
        }
    }
    checkStatusOrder = (text, record) => {
        const date = new Date();
        if (date < new Date(record.coolingOffExp)) {
            return (
                <Tag icon={<ClockCircleOutlined />} color="orange">
                    Cooling-off
                </Tag>
            )
        }
        if (text === "COMPLETED") {
            return (
                <Tag icon={<CheckCircleOutlined />} color="green">
                    {capitalize(text)}
                </Tag>
            )
        }
        if (text === "PROCESSING") {
            return (
                <Tag icon={<SyncOutlined />} color="processing">
                    {capitalize(text)}
                </Tag>
            )
        }
        return (
            <Tag color="default">
                {capitalize(text)}
            </Tag>
        )
    }
    render() {
        const {
            active,
            currentPage,
            pageSize,
            startDate,
            endDate,
            rowsSelected,
            expandedRowKeys,
            nestedRowsSelected,
            nestedRowKeysSelected,
            openMoreFilterDrawer,
            openModalResolveOnHold,
            openModalOnHold,
            openPrintDesignDrawer,
            lineItemCurrent,
            openModalImportOrder,
            productTypeId,
            // seller,
            supplier,
            site,
            openModalCancel,
            openModalAssignCarrier,
            showBadge
        } = this.state;
        const {
            listOrders,
            saveImageDesign,
            saveImageDesignSuccess,
            saveImageDesignError,
            doSaveImageDesign,
            history,
            listProductTypeNoPaging,
            // listSeller,
            doExport,
            listSitesNoPaging,
            onHold,
            onHoldLoading,
            resolveOnHold,
            resolveOnHoldLoading,
            listSuppliers,
            cancel,
            cancelLoading,
            listStatistic,
            assignCarrier,
            assignCarrierLoading,
            carriersAssign,

            exportErrorFileLoading,
            exportErrorFile,
            exportErrorFileSuccess
        } = this.props;

        const { orders, loading, totalElements } = listOrders;
        const { sites } = listSitesNoPaging;
        const { suppliers } = listSuppliers;
        const { statistic } = listStatistic;

        let orders2 = orders.map(order => {
            return {
                ...order,
                lineItems: order.lineItems.map(item => ({
                    ...item,
                    orderId: order.id,
                    parentRow: order.id,
                    currency: order.currency,
                    resendId: order.id + "-" + item.sku,
                    coolingOffExp: order.coolingOffExp,
                    status: (item.status === "CHOOSE_SUPPLIER" || item.status === "PROCESSING" || item.status === "REQUEST_CANCEL") ? "PENDING" : item.status
                })),
            }
        })
        const renderStatusTab = () => {
            return config.ordersProductStatus.map((item, index) => {
                if (item === "PENDING") {
                    return (
                        showBadge ? <Badge
                            count={parseFloat(statistic.statistic["PROCESSING"] + statistic.statistic["CHOOSE_SUPPLIER"] + statistic.statistic["REQUEST_CANCEL"]).toLocaleString('en-GB')}
                            overflowCount={9999}
                            key={item}
                            style={{ backgroundColor: '#00FFFF' }}
                        >
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "COOLING_OFF") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={index} style={{ backgroundColor: '#FF3300' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge> :(
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "PENDING_DESIGN" || item === "NEED_PAY") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={index} style={{ backgroundColor: '#FFCC00' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {item === "NEED_PAY" ? 'Unpaid' : capitalize(item)}
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "SHIPPED") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={index} style={{ backgroundColor: '#00FF00' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "IN_PRODUCTION") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={index} style={{ backgroundColor: '#0033FF' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "ON_HOLD" || item === "ACTION_REQUIRED") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={index} style={{ backgroundColor: '#f50cc6' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "ALL") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={index} style={{ backgroundColor: '#808B96' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                {capitalize(item)}
                            </li>
                        )
                    )
                }
                if (item === "CANCELED") {
                    return (
                        showBadge ? <Badge count={parseFloat(statistic.statistic[item] + statistic.statistic["REFUNDED"]).toLocaleString('en-GB')} overflowCount={9999} key={item} style={{ backgroundColor: '#FF0000' }}>
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                Cancelled/Refunded
                            </li>
                        </Badge> : (
                            <li
                                className={`${active === item ? cls.active : ""}`}
                                onClick={() => this.onChangeTabs(item)}

                            >
                                Cancelled/Refunded
                            </li>
                        )
                    )
                }
                return (
                    showBadge ? <Badge count={parseFloat(statistic.statistic[item]).toLocaleString('en-GB')} overflowCount={9999} key={item}>
                        <li
                            className={`${active === item ? cls.active : ""}`}
                            onClick={() => this.onChangeTabs(item)}

                        >
                            {capitalize(item)}
                        </li>
                    </Badge> : (
                        <li
                            className={`${active === item ? cls.active : ""}`}
                            onClick={() => this.onChangeTabs(item)}

                        >
                            {capitalize(item)}
                        </li>
                    )
                )
            })
        }

        const onSelectAllParent = (selected, selectedRows, changeRows) => {
            if (selected) {
                const allNestedItem = [];
                (orders2 || []).forEach(order => {
                    allNestedItem.push(...order.lineItems)
                })
                const allNestedRowKey = allNestedItem.map(x => x.resendId);
                console.log(allNestedItem)
                this.setState({
                    nestedRowsSelected: [...allNestedItem],
                    nestedRowKeysSelected: [...allNestedRowKey]
                }
                    , () => console.log(this.state.nestedRowKeysSelected)
                )
            }
            else {
                this.setState({
                    nestedRowsSelected: [],
                    nestedRowKeysSelected: []
                })
            }
        }
        const menuLineItem = record => (
            <Menu>
                {config.orderAction.map((item, index) => {
                    // if (index === 0) {
                    //     return null;
                    // }
                    if (item === "ON_HOLD" && (
                        record.status === "PROCESSING" ||
                        record.status === "IN_PRODUCTION" ||
                        record.status === "SHIPPED" ||
                        record.status === "ON_HOLD" ||
                        record.status === "CANCELED" ||
                        record.status === "REFUNDED"
                    )) {
                        return null;
                    }
                    if (item === "CANCEL" && (
                        record.status === "CANCELED" ||
                        record.status === "IN_PRODUCTION" ||
                        record.status === "SHIPPED" ||
                        record.status === "REFUNDED"
                    )) {
                        return null;
                    }
                    if (item === "ASSIGN_CARRIER" && (
                        record.status === "PROCESSING" ||
                        record.status === "CANCELED" ||
                        record.status === "IN_PRODUCTION" ||
                        record.status === "SHIPPED" ||
                        record.status === "REFUNDED"
                    )) {
                        return null;
                    }
                    if (item === "RESEND") {
                        return (
                            <Menu.Item style={{ marginBottom: "4px" }} key={index} children={<> <ExportOutlined className={cls.green} /> {capitalize(item)} </>} onClick={() => this.lineItemAction(item, record)} />
                        )
                    }
                    if (item === "CANCEL") {
                        return (
                            <Menu.Item style={{ marginBottom: "4px" }} key={index} children={<> <CloseCircleOutlined className={cls.red} /> {capitalize(item)} </>} onClick={() => this.lineItemAction(item, record)} />
                        )
                    }
                    if (item === "ON_HOLD") {
                        return (
                            <Menu.Item style={{ marginBottom: "4px" }} key={index} children={<> <PauseCircleOutlined className={cls.orange} /> {capitalize(item)} </>} onClick={() => this.lineItemAction(item, record)} />
                        )
                    }
                    if (item === "ASSIGN_CARRIER") {
                        return (
                            <Menu.Item style={{ marginBottom: "4px" }} key={index} children={<> <FormOutlined className={cls.blue} /> {capitalize(item)} </>} onClick={() => this.lineItemAction(item, record)} />
                        )
                    }
                    return (
                        <Menu.Item style={{ marginBottom: "4px" }} key={index} children={capitalize(item)} onClick={() => this.lineItemAction(item, record)} />
                    )
                })}
            </Menu>
        );
        // const menuAssign = (
        //     <Menu>
        //         <Menu.Item key="1" onClick={() => this.setState({ openModalAssignSupplier: true })}>Assign supplier</Menu.Item>
        //         <Menu.Item key="2">Assign carrier</Menu.Item>
        //     </Menu>
        // );
        const menuMoreAction = (
            <Menu>
                {config.orderAction.map((item, index) => {
                    if (item === "ASSIGN_CARRIER") {
                        return (
                            <Menu.Item
                                key={index}
                                style={{ marginBottom: "4px" }}
                                children={<> <FormOutlined className={cls.blue} /> {capitalize(item)} </>}
                                onClick={() => {
                                    const list = nestedRowsSelected.map(x => x.status)
                                    if (list.includes("CANCELED") || list.includes("IN_PRODUCTION") || list.includes("PROCESSING") || list.includes("SHIPPED")) {
                                        ModalCheckAssign("CANCELED")
                                    }
                                    else {
                                        if (checkAssign(nestedRowsSelected)) {
                                            this.setState({ openModalAssignCarrier: true }, () => {
                                                this.props.getAssignCarrier(nestedRowsSelected[0].productTypeId)
                                            })
                                        }
                                        else {
                                            ModalCheckAssign(nestedRowsSelected)
                                        }
                                    }
                                }}
                            />
                        )
                    }
                    if (item === "ON_HOLD") {
                        return (
                            <Menu.Item
                                key={index}
                                style={{ marginBottom: "4px" }}
                                children={<> <PauseCircleOutlined className={cls.orange} /> {capitalize(item)} </>}
                                onClick={() => {
                                    if (checkMoreAction(item, nestedRowsSelected)) {
                                        this.onChooseMoreAction(item)
                                    }
                                    else {
                                        ModalCheckMoreAction(item)
                                    }
                                }}
                            />
                        )
                    }
                    if (item === "RESEND") {
                        return (
                            <Menu.Item
                                key={index}
                                style={{ marginBottom: "4px" }}
                                children={<> <ExportOutlined className={cls.green} /> {capitalize(item)} </>}
                                onClick={() => {
                                    if (checkMoreAction(item, nestedRowsSelected)) {
                                        this.onChooseMoreAction(item)
                                    }
                                    else {
                                        ModalCheckMoreAction(item)
                                    }
                                }}
                            />
                        )
                    }
                    if (item === "CANCEL") {
                        return (
                            <Menu.Item
                                key={index}
                                style={{ marginBottom: "4px" }}
                                children={<> <CloseCircleOutlined className={cls.red} /> {capitalize(item)} </>}
                                onClick={() => {
                                    if (checkMoreAction(item, nestedRowsSelected)) {
                                        this.onChooseMoreAction(item)
                                    }
                                    else {
                                        ModalCheckMoreAction(item)
                                    }
                                }}
                            />
                        )
                    }
                    return (
                        <Menu.Item
                            key={index}
                            children={capitalize(item)}
                            onClick={() => {
                                if (checkMoreAction(item, nestedRowsSelected)) {
                                    this.onChooseMoreAction(item)
                                }
                                else {
                                    ModalCheckMoreAction(item)
                                }
                            }}
                        />
                    )
                })}
            </Menu>
        );
        // nested table
        const NestedTable = ({ nestedData, indent, expanded, onSelect, onSelectAll, rowsSelected }) => {
            // console.log(rowsSelected)
            // const [selectedRowKeys, setSelectedRowKeys] = useState(rowsSelected);
            const columns = [
                {
                    dataIndex: "imageId",
                    key: "imageId",
                    render: text => {
                        return (
                            <Tooltip placement="right" title={
                                <img
                                    alt={text}
                                    src={getImageUrl(text)}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            }>
                                <img
                                    alt={text}
                                    src={getImageUrl(text)}
                                    style={{ width: "40px", height: "40px" }}
                                />
                            </Tooltip>
                        )
                    },
                    fixed: "left",
                    width: 60
                },
                {
                    title: "Product",
                    dataIndex: "name",
                    key: "name",
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text, record) => {
                        return (
                            <>
                                <p style={{ marginBottom: 0 }}>{text}</p>
                                <p style={{ fontSize: "12px" }}><i>Sku: </i><i>{record.sku}</i></p>
                            </>
                        )
                    },
                    fixed: "left",
                    width: 300
                },
                {
                    title: "Product type",
                    dataIndex: "productTypeTitle",
                    key: "productTypeTitle",
                    width: 150
                },
                {
                    title: "Base cost",
                    dataIndex: "baseCost",
                    key: "baseCost",
                    render: (text, record) => `${parseFloat(text).toLocaleString('en-GB')}${record.currency === 'VND' ? 'đ':'$'}`,
                    width: 150
                },
                {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                    width: 100
                },
                // {
                //     title: "Supplier",
                //     dataIndex: "supplier",
                //     key: "supplier",
                //     width: 150
                // },
                {
                    title: "Carrier",
                    dataIndex: "carrier",
                    key: "carrier",
                    width: 150,
                    render: (text, record) => {
                        if (text) {
                            return text;
                        }
                        if (record.status === "PROCESSING" || record.status === "IN_PRODUCTION" || record.status === "SHIPPED") {
                            return null
                        }
                        return (
                            <Button
                                type="link"
                                children={"Choose carrier"}
                                style={{ padding: 0 }}
                                onClick={() => {
                                    this.setState({ openModalAssignCarrier: true, lineItemCurrent: record })
                                }}
                            />
                        )
                    },
                },
                {
                    title: "Tracking ID",
                    dataIndex: "trackingNumber",
                    key: "trackingNumber",
                    width: 150,
                    render: (text, record) => <a href={record.trackingUrl} target="blank" children={<>{text} <br /> {capitalize(record.trackingStatus)}</>} />
                },
                {
                    title: "Designs",
                    key: "design",
                    render: (text, record) => (
                        <Badge count={record.numberDesignMissing}>
                            <Button onClick={() => this.setState({
                                openPrintDesignDrawer: true,
                                lineItemCurrent: record
                            })}
                            >
                                View
                            </Button>
                        </Badge>
                    ),
                    width: 150,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (text, record) => {
                        if (record.statusNote && ["ACTION_REQUIRED", "CANCELED", "ON_HOLD"].includes(record.status)) {
                            return (
                                <Space>
                                    {this.checkStatus(text, record)}
                                    <Tooltip title={capitalize(record.statusNote)}>
                                        <FileTextOutlined className={record.status === "ON_HOLD" ? cls.blue : ""} />
                                    </Tooltip>
                                </Space>
                            )
                        }
                        return this.checkStatus(text, record)
                    },
                    width: 180,
                },
                {
                    title: "Action",
                    key: "actionRequired",
                    render: (text, record) => {
                        return <Dropdown.Button overlay={menuLineItem(record)} placement="bottomCenter" icon={<SettingOutlined />} type="link" />
                    },
                    width: 100,
                    fixed: "right",
                },
            ]
            return (
                <Table
                    rowKey={record => record.resendId}
                    columns={columns}
                    dataSource={nestedData}
                    pagination={false}
                    rowSelection={{
                        type: "checkbox",
                        // onChange: (selectedRowKeys, selectedRows) => {
                        //     setSelectedRowKeys(selectedRowKeys)
                        // },
                        onSelect,
                        onSelectAll,
                        selectedRowKeys: rowsSelected,
                    }}
                    scroll={{ x: 1500 }}
                />
            )
        }

        return (
            <>
                <Card
                    title={<span><ShoppingCartOutlined style={{ marginRight: '5px' }} /> ORDERS MANAGER</span>}
                    headStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
                    bodyStyle={{ paddingBottom: '12px' }}
                    extra={
                        <>
                            <Button
                                type="link"
                                icon={<UploadOutlined />}
                                onClick={this.export}
                                style={{ marginRight: '16px' }}
                                size={isMobile ? 'small' : 'middle'}
                                disabled={doExport}
                                loading={doExport}
                            >
                                Export orders
                            </Button>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size={isMobile ? 'small' : 'middle'}
                                onClick={() => this.setState({ openModalImportOrder: true })}
                            >
                                Import orders
                            </Button>

                        </>
                    }
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={8} xs={24}>
                                <Search
                                    allowClear
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{ width: '100%' }}
                                    placeholder="Search..."
                                    suffix={
                                        <Tooltip title="Search by order name, product name, product sku">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />
                            </Col>
                            <Col md={4} xs={24}>
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
                                    onChange={this.onChangeDate}
                                    style={{ width: "100%" }}
                                    value={[!startDate ? startDate : moment(startDate), !endDate ? endDate : moment(endDate)]}
                                />
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Site"
                                    onChange={this.onChangeSite}
                                    value={site}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {sites.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={index} children={`${item.title} ${checkSiteStatus(item)}`} />
                                        )
                                    })}
                                </Select>
                            </Col>
                            <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Product types"
                                    onChange={this.onChangeProductType}
                                    value={productTypeId}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {listProductTypeNoPaging.productType.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id} children={item.title} />
                                        )
                                    })}
                                </Select>
                            </Col>
                            {/* <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Seller"
                                    onChange={this.onChangeSeller}
                                    value={seller}
                                >
                                    {listSeller.sellers.map(value => (
                                        <Option key={value.id}
                                            value={value.id}>{`${value.lastName || ''} ${value.firstName || ''}`}</Option>
                                    ))}
                                </Select>
                            </Col> */}
                            {/* <Col md={4} xs={24}>
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Supplier"
                                    onChange={this.onChangeSupplier}
                                    value={supplier}
                                    optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                >
                                    {Array.isArray(suppliers) && suppliers.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id} children={item.firstName + " " + item.lastName} />
                                        )
                                    })}
                                </Select>
                            </Col> */}
                            <Col md={4} xs={24}>
                                <Button
                                    style={{ width: '100%' }}
                                    icon={<FilterOutlined />}
                                    onClick={this.openMoreFilter}
                                >
                                    More filters
                            </Button>
                            </Col>

                        </Row>
                    </Input.Group>
                    <br />
                    <div>
                        {
                            productTypeId && (
                                <Tag closable onClose={() => this.onRemoveTag('productType')} style={tagStyle}>
                                    {`ProductType is: ${listProductTypeNoPaging.productType.find(item => item.id === productTypeId).title}`}
                                </Tag>
                            )
                        }
                        {/* {
                            seller && (
                                <Tag closable onClose={() => this.onRemoveTag('seller')} style={tagStyle}>
                                    {`Seller is: ${listSeller.sellers.find(item => item.id === seller).firstName + "" + listSeller.sellers.find(item => item.id === seller).lastName}`}
                                </Tag>
                            )
                        } */}
                        {
                            startDate && endDate && (
                                <Tag closable onClose={() => this.onRemoveTag('date')} style={tagStyle}>
                                    {`From ${new Date(startDate).toLocaleDateString('en-GB')} to ${new Date(endDate).toLocaleDateString('en-GB')}`}
                                </Tag>
                            )
                        }
                        {
                            supplier && (
                                <Tag closable onClose={() => this.onRemoveTag('supplier')} style={tagStyle}>
                                    {`Supplier is: ${suppliers.find(item => item.id === supplier).firstName || '' + " " + suppliers.find(item => item.id === supplier).lastName || ''}`}
                                </Tag>
                            )
                        }
                        {
                            site && (
                                <Tag closable onClose={() => this.onRemoveTag('site')} style={tagStyle}>
                                    {`Site: ${sites.find(item => item.id === site).title}`}
                                </Tag>
                            )
                        }
                    </div>
                    <br />
                    <div className={cls.tabs}>
                        <ul>
                            {statistic && statistic.statistic && renderStatusTab()}
                        </ul>
                    </div>
                    <br />
                    {nestedRowsSelected.length > 0 && (
                        <div className={cls.action}>
                            <Row gutter={24}>
                                <Col md={4} xs={12}>
                                    <Button
                                        onClick={() => this.setState({ nestedRowsSelected: [], nestedRowKeysSelected: [], rowsSelected: [] })}
                                        style={{ width: '100%' }}
                                    >
                                        <Checkbox indeterminate={nestedRowsSelected.length > 0} className={cls.totalRow}>{`${nestedRowsSelected.length} selected`}</Checkbox>
                                    </Button>
                                </Col>
                                {/* <Col md={4} xs={12}>
                                    <Dropdown overlay={menuAssign} >
                                        <Button style={{ width: "100%" }}>Assign</Button>
                                    </Dropdown>
                                </Col> */}
                                <Col md={4} xs={12}>
                                    <Dropdown overlay={menuMoreAction} >
                                        <Button style={{ width: "100%" }}>More action</Button>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </div>
                    )}
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: "Order Name",
                                dataIndex: "orderName",
                                key: "orderName",
                                ellipsis: !isMobile,
                                render: (text, record) => {
                                    const date = new Date();
                                    return (
                                        <a onClick={() => history.push("/order/" + record.id)}>
                                            <span>{"#" + text} </span>
                                            {date < new Date(record.coolingOffExp) && record.status !== "COMPLETED" && (
                                                <Tooltip title="Cooling-off">
                                                    <Tag color="orange">
                                                        <ClockCircleOutlined />
                                                    </Tag>
                                                </Tooltip>
                                            )}
                                        </a>
                                    )
                                }
                            },
                            {
                                title: "Created Date",
                                dataIndex: "createdDate",
                                key: "createdDate",
                                render: text => new Date(text).toLocaleString('en-GB'),
                                ellipsis: !isMobile
                            },
                            {
                                title: "Customer",
                                dataIndex: "createdBy",
                                key: "createdBy",
                                ellipsis: !isMobile,
                                render: (text, record) => {
                                    if(record.billingAddress){
                                        return `${record.billingAddress.firstName || ''} ${record.billingAddress.lastName || ''}`
                                    }
                                    return '';
                                }
                            },
                            {
                                title: "Base cost",
                                dataIndex: "totalBaseCost",
                                key: "total",
                                render: (text, record) => `${parseFloat(text).toLocaleString('en-GB')}${record.currency === 'VND' ? 'đ':'$'}`,
                                ellipsis: !isMobile,
                            },
                            // {
                            //     title: "Sale cost",
                            //     dataIndex: "total",
                            //     key: "total",
                            //     render: (text, record) => `${parseFloat(text).toLocaleString('en-GB')}${record.currency === 'VND' ? 'đ':'$'}`,
                            //     ellipsis: !isMobile,
                            // },
                            // {
                            //     title: "Status",
                            //     dataIndex: "status",
                            //     key: "status",
                            //     render: this.checkStatusOrder
                            // },
                            // {
                            //     title: "Seller",
                            //     dataIndex: "sellerEmail",
                            //     key: "sellerEmail",
                            //     ellipsis: !isMobile,
                            // },
                            {
                                title: "Site",
                                dataIndex: "site",
                                key: "site",
                                ellipsis: !isMobile,
                                render: text => text && text.virtual ? "Virtual site" :
                                    <a target='blank' href={(text || { url: "" }).url}>{(text || { title: "" }).title}</a>
                            }
                        ]}
                        dataSource={orders2}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} orders`
                        }}
                        loading={loading}
                        showHeader={nestedRowsSelected.length === 0}
                        showSizeChanger
                        onShowSizeChange={this.onShowSizeChange}
                        // expandIconColumnIndex={9}
                        expandRowByClick
                        rowClassName={this.setRowClassName}
                        expandable={{
                            expandedRowRender: (record, index, indent, expanded) => {
                                return (
                                    <NestedTable
                                        nestedData={record.lineItems}
                                        indent={indent}
                                        expanded={expanded}
                                        onSelect={this.onSelectRowNested}
                                        onSelectAll={this.onSelectAllNested}
                                        rowsSelected={nestedRowKeysSelected}
                                    />
                                )
                            },
                            // expandIcon: ({ expanded, onExpand, record }) =>
                            //     expanded ? (<DownOutlined onClick={e => onExpand(record, e)} />) :
                            //         (<UpOutlined onClick={e => onExpand(record, e)} />),
                            onExpandedRowsChange: (expandedRows) => {
                                this.setState({ expandedRowKeys: expandedRows }, () => {
                                    const { expandedRowKeys } = this.state;
                                    localStorage.setItem("expandedRowKeys", JSON.stringify(expandedRowKeys))
                                })
                            },
                            expandedRowKeys,

                        }}
                        rowSelection={{
                            type: "checkbox",
                            onChange: this.onSelectRows,
                            selectedRowKeys: rowsSelected,
                            onSelect: this.onSelectParent,
                            onSelectAll: onSelectAllParent
                        }}
                        onChange={this.handleTableChange}
                    >

                    </Table>
                </Card>
                <ResolveModal
                    visible={openModalResolveOnHold}
                    handleCancel={() => this.setState({ openModalResolveOnHold: false, lineItemCurrent: null })}
                    resolveOnHold={resolveOnHold}
                    resolveOnHoldLoading={resolveOnHoldLoading}
                    lineItem={lineItemCurrent}
                />
                <OnHoldModal
                    visible={openModalOnHold}
                    handleCancel={() => this.setState({ openModalOnHold: false, lineItemCurrent: null })}
                    nestedRowsSelected={nestedRowsSelected}
                    onHoldLoading={onHoldLoading}
                    onHold={onHold}
                    lineItem={lineItemCurrent}
                />
                {/* <NotAcceptOrder
                    visible={openModalNotAccept}
                    handleCancel={() => this.setState({ openModalNotAccept: false })}
                /> */}
                {/* <RefundOrder
                    visible={openModalRefund}
                    handleCancel={() => this.setState({ openModalRefund: false })}
                /> */}
                {/* <AssignSupplier
                    visible={openModalAssignSupplier}
                    handleCancel={() => this.setState({ openModalAssignSupplier: false })}
                    nestedRowsSelected={nestedRowsSelected}
                /> */}
                <FilterOrdersDrawer
                    visible={openMoreFilterDrawer}
                    onClose={this.onCloseMoreFilter}
                    capitalize={capitalize}
                    refreshTable={this.refreshTable}
                    onChangeDate={this.onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    onChangeProductType={this.onChangeProductType}
                    // onChangeSeller={this.onChangeSeller}
                    listProductTypeNoPaging={listProductTypeNoPaging}
                    // listSeller={listSeller}
                    onClearFilter={this.onClearFilter}
                    productTypeId={productTypeId}
                    onChangeTabs={this.onChangeTabs}
                    onChangeSupplier={this.onChangeSupplier}
                    suppliers={suppliers}
                    supplier={supplier}
                    active={active}
                    site={site}
                    sites={sites}
                    onChangeSite={this.onChangeSite}
                // seller={seller}
                />
                <PrintDesignDrawer
                    visible={openPrintDesignDrawer}
                    onClose={() => this.setState({ openPrintDesignDrawer: false, lineItemCurrent: null })}
                    lineItemCurrent={lineItemCurrent}
                    saveImageDesign={saveImageDesign}
                    doSaveImageDesign={doSaveImageDesign}
                    saveImageDesignSuccess={saveImageDesignSuccess}
                    saveImageDesignError={saveImageDesignError}
                />
                <ImportOrderModal
                    visible={openModalImportOrder}
                    handleCancel={() => this.setState({ openModalImportOrder: false })}
                    sites={sites}
                    exportErrorFile={exportErrorFile}
                    exportErrorFileLoading={exportErrorFileLoading}
                    exportErrorFileSuccess={exportErrorFileSuccess}
                    refreshTable={this.refreshTable}
                />
                <AssignCarrierModal
                    visible={openModalAssignCarrier}
                    handleCancel={() => this.setState({ openModalAssignCarrier: false, lineItemCurrent: null })}
                    nestedRowsSelected={nestedRowsSelected}
                    carriersAssign={carriersAssign}
                    assignCarrier={assignCarrier}
                    assignCarrierLoading={assignCarrierLoading}
                    lineItem={lineItemCurrent}
                />
                <CancelModal
                    visible={openModalCancel}
                    handleCancel={() => this.setState({ openModalCancel: false, lineItemCurrent: null })}
                    nestedRowsSelected={nestedRowsSelected}
                    lineItem={lineItemCurrent}
                    cancel={cancel}
                    cancelLoading={cancelLoading}
                />
            </>
        )
    }
}
