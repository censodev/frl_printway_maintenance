import React, {Component} from 'react';
import {Card, Tooltip} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Doughnut} from "react-chartjs-2";
import capitalize from "../../core/util/capitalize";

const doughnutOptions = {
    // title: {
    //     display: false,
    //     // text: 'Total Orders',
    //     // fontSize: 23,
    //     // fontFamily: 'Source Sans Pro, Helvetica Neue, Arial, sans-serif',
    // },
    legend: {
        display: true,
        position: 'right',
        labels: {
            boxWidth: 9,
            usePointStyle: true,
            fontFamily: 'Poppins-Medium'
        }
    },
    cutoutPercentage: 70,
    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                let dataset = data.datasets[tooltipItem.datasetIndex];
                let meta = dataset._meta[Object.keys(dataset._meta)[0]];
                let total = meta.total;
                let currentValue = dataset.data[tooltipItem.index];
                let percentage = parseFloat((currentValue/total*100).toFixed(1));
                return currentValue + ' (' + percentage + '%)';
            },
            title: function(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
            }
        }
    }
};


class Status extends Component {


    render() {

        const {listStatus} = this.props;
        const {status, loading} = listStatus;
        const {statistic} = status;

        const filterStatus = statistic ? Object.keys(statistic).filter(key => {
            return key === 'PENDING_DESIGN' || key === 'SHIPPED' || key === 'ON_HOLD' || key === 'COOLING_OFF' || key === 'CANCELED' || key === 'ACTION_REQUIRED'
        }) : [];

        const totalValue = filterStatus.map(item => statistic[item]).reduce((prev, curr) => prev + curr, 0);


        const dataStatus = {
            labels: filterStatus.map(key => `${capitalize(key)}:   ${statistic[key].toLocaleString()} | ${parseFloat(statistic[key] / (totalValue === 0 ? 1 : totalValue) * 100).toFixed(1)}%`),
            datasets: [{
                data: filterStatus.map(key => statistic[key]),
                backgroundColor: [
                    '#1890ff',
                    '#13c2c2',
                    '#2fc25b',
                    '#facc14',
                    '#f04864',
                    '#8543e0',
                    '#984200',
                    '#00ffee',
                    '#1fa9d8',
                    '#ffc107',
                ],
                hoverBackgroundColor: [
                    '#1890ff',
                    '#13c2c2',
                    '#2fc25b',
                    '#facc14',
                    '#f04864',
                    '#8543e0',
                    '#984200',
                    '#00ffee',
                    '#1fa9d8',
                    '#ffc107',
                ]
            }]
        };

        return (
            <Card
                title={'Order Status allocation'}
                headStyle={{fontFamily:'Poppins-Medium'}}
                bodyStyle={{
                    // paddingBottom: '12px',
                }}
                extra={<Tooltip
                    title={'Order Status allocation'}
                >
                    <InfoCircleOutlined/>
                </Tooltip>}
                loading={loading}
            >
                {statistic ?
                    <Doughnut ref={input => this.chart = input} data={dataStatus} height={150}
                              options={doughnutOptions}/> : 'No Data'}
            </Card>
        );
    }
}

Status.propTypes = {};

export default Status;
