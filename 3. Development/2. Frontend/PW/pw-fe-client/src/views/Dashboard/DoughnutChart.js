import React, {Component} from 'react';
import {Card, Tooltip} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Doughnut} from "react-chartjs-2";

const doughnutOptions = {
    // title: {
    //     display: false,
    //     // text: 'Total Orders',
    //     // fontSize: 23,
    //     // fontFamily: 'Source Sans Pro, Helvetica Neue, Arial, sans-serif',
    // },
    legend: {
        display: true,
        position: 'bottom',
        align: 'start',
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

class DoughnutChart extends Component {
    render() {

        const { topProduct} = this.props;

        const totalProduct = topProduct && topProduct.products && topProduct.products.map(item => item.value).reduce((prev, curr) => prev + curr, 0);

        const dataTopProduct = {
            labels: topProduct && topProduct.products && topProduct.products.map(data => `${data.title} | ${parseFloat(data.value / (totalProduct === 0 ? 1 : totalProduct) * 100).toFixed(1)}%`),
            datasets: [{
                data: topProduct && topProduct.products && topProduct.products.map(data => data.value.toLocaleString()),
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
                title={'Top 10 Best Selling Products'}
                headStyle={{fontFamily:'Poppins-Medium'}}
                bodyStyle={{
                    // paddingBottom: '12px',
                }}
                extra={<Tooltip
                    title={'Top 10 Best Selling Products'}
                >
                    <InfoCircleOutlined/>
                </Tooltip>}
                loading={topProduct.loading}
            >
                {topProduct && topProduct.products && topProduct.products.length > 0 ? <Doughnut data={dataTopProduct} height={150} options={doughnutOptions}/> : 'No Data'}
            </Card>
        );
    }
}

DoughnutChart.propTypes = {};

export default DoughnutChart;
