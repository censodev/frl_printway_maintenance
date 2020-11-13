import React, {Component} from 'react';
import {Tooltip, Card, Table, Modal, message, Input, Row, Col, Button} from 'antd';
import {
    FileTextOutlined,
} from "@ant-design/icons";
import ReactHtmlParser from 'react-html-parser';
import CatchError from '../../core/util/CatchError';
import * as _ from "lodash";


const key = 'deleteTransaction';
const {Search} = Input;

class News extends Component {

    state = {
        visible: false,
        content: '',
        title: '',
        newsData: null,
        openEditNewDrawer: false,
        pageSize: 10,
        currentPage: 0,
        keyword: '',
        sortedInfo: {
            order: 'descend',
            columnKey: 'createdDate',
        },
    };

    componentDidMount() {
        this.props.fetchAllNews(this.checkParam());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const {
            deleteSuccess,
            deleteError
        } = this.props;

        if (
            nextProps.deleteSuccess === true
            && nextProps.deleteSuccess !== deleteSuccess
        ) {
            message.success({
                content: 'Success!', key, duration: 1.5, onClose: () => {
                    window.location.reload()
                }
            });
        }

        if (
            nextProps.deleteError && nextProps.deleteError !== deleteError
        ) {
            message.error({content: CatchError[nextProps.deleteError] || nextProps.deleteError, key, duration: 2});
        }

    }


    showEditNewDrawer = (data) => {
        this.setState({
            openEditNewDrawer: true,
            newsData: data
        });
    };

    onCloseDrawer = () => {
        this.setState({
            newsData: null,
            openEditNewDrawer: false,
        });
    };

    handleDelete = (id) => {
        if (id) {
            message.loading({content: 'Loading...', key});
            this.props.deleteNew(id);
        }
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    debounceSearch = _.debounce(e => {
        this.setState({
            keyword: e.trim()
        }, () => {
            if (e.length !== 1) {
                this.onSubmit();
            }
        })
    }, 500);

    onChangeKeyWord = (e) => {
        this.debounceSearch(e.target.value);
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    };

    onSearch = (value) => {
        if (value) {
            this.onSubmit();
        }
    };

    checkParam = () => {
        const {
            currentPage,
            pageSize,
            sortedInfo,
            keyword
        } = this.state;

        const dataParams = {};

        // if (status) {
        //     dataParams.activated = status === 'active';
        // }


        if (sortedInfo && sortedInfo.order && sortedInfo.columnKey) {
            dataParams.sort = `${sortedInfo.columnKey},${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
        }

        dataParams.keyword = keyword;
        dataParams.page = currentPage;
        dataParams.size = pageSize;

        return dataParams;
    };

    handleTableChange = (pagination, filters, sorter) => {

        if (sorter.order === undefined && sorter.column === undefined) {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {columnKey: 'createdDate', order: 'descend'}
                }, () => {
                    this.props.fetchAllNews(this.checkParam());
                }
            );
        } else {
            this.setState({
                    currentPage: pagination.current - 1,
                    sortedInfo: {...this.state.sortedInfo, columnKey: sorter.columnKey, order: sorter.order}
                }, () =>
                    this.props.fetchAllNews(this.checkParam())
            );
        }
    };

    onSubmit = () => {

        this.setState({
            currentPage: 0
        }, () => {
            this.props.fetchAllNews(this.checkParam());
        });

    };


    // handleToggle = (data) => {
    //     if (data.id) {
    //         message.loading({content: 'Loading...', key});
    //         // this.props.deleteNew(id);
    //     }
    // };

    render() {

        const {
            currentPage,
            pageSize,
            visible
        } = this.state;

        const {
            listNews,
        } = this.props;

        const {news, loading, totalElements} = listNews;

        return (

            <>
                <Card
                    title={<span><FileTextOutlined style={{marginRight: '5px'}}/> NEWS</span>}
                    headStyle={{color: 'rgba(0, 0, 0, 0.45)'}}
                >
                    <Input.Group>
                        <Row gutter={24}>
                            <Col md={6} xs={24}>
                                <Search
                                    allowClear
                                    placeholder="Search by title..."
                                    onSearch={this.onSearch}
                                    onChange={this.onChangeKeyWord}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            {/*<Col md={3} xs={24}>*/}
                            {/*    <Button onClick={this.onSortByDate} style={{width: '100%'}}*/}
                            {/*            icon={sortedInfo.order === 'desc' ? <SortAscendingOutlined/> :*/}
                            {/*                <SortDescendingOutlined/>}>Sort Date</Button>*/}
                            {/*</Col>*/}
                            {/*<Col md={4} xs={24}>*/}
                            {/*    <Select*/}
                            {/*        showSearch*/}
                            {/*        allowClear*/}
                            {/*        style={{width: '100%'}}*/}
                            {/*        placeholder="Filter by status"*/}
                            {/*        onChange={this.onChangeStatus}*/}
                            {/*        value={status}*/}
                            {/*    >*/}
                            {/*        <Option value="active">Active</Option>*/}
                            {/*        <Option value="deactivate">Deactivate</Option>*/}
                            {/*    </Select>*/}
                            {/*</Col>*/}
                        </Row>
                    </Input.Group>
                    <br/>
                    <Table
                        rowKey={record => record.id}
                        columns={[
                            {
                                title: 'Title',
                                dataIndex: 'title',
                                key: 'title',
                                render: (text, record) => {
                                    return (
                                        <Tooltip overlay='See full content'>
                                            <a onClick={() => {
                                                this.setState({
                                                    visible: true,
                                                    content: record.content,
                                                    title: record.title
                                                })
                                            }}
                                               style={record.type && record.type === 'URGENT_NOTE' ? {color: 'orange'} : {}}

                                            >
                                                {text}
                                            </a>
                                        </Tooltip>
                                    )
                                }
                            },
                            {
                                title: 'Type',
                                dataIndex: 'type',
                                key: 'type',
                                render: text => text === 'URGENT_NOTE' ? 'Urgent note' : 'News'
                            },
                            {
                                title: 'Content',
                                dataIndex: 'shortDescription',
                                key: 'shortDescription',
                                render: text => {
                                    return ReactHtmlParser(text || '')
                                }
                            },
                            {
                                title: 'Created date',
                                dataIndex: 'createdDate',
                                sorter: true,
                                key: 'createdDate',
                                render: text => new Date(text).toLocaleString('en-GB'),
                            },
                        ]}
                        dataSource={news}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalElements,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            showLessItems: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} items`
                        }}
                        loading={loading}
                        onChange={this.handleTableChange}
                    />
                </Card>
                <Modal
                    title={this.state.title}
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={
                        <Button onClick={this.handleCancel}>
                            Close
                        </Button>
                    }
                >
                    {ReactHtmlParser(this.state.content)}
                </Modal>
            </>
        );
    }
}

export default News;
