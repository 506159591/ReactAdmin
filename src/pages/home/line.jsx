import React, { Component } from 'react'
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import {
    LineChart
} from 'echarts/charts';
import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]
);
export default class Line extends Component {

    state = {
        goods: [
            {
                name: '销量',
                type: 'line',
                data: [25, 15, 36, 39, 17, 30]
            },
            {
                name: '库存',
                type: 'line',
                data: [40, 35, 20, 20, 35, 20]
            }
        ]
    }

    update = () => {

    }
    getOption = () => {
        const { goods } = this.state
        const chartDom = document.getElementsByClassName('line')[0];
        const myChart = echarts.init(chartDom);
        let option;
        option = {
            title: {
                text: '销量-库存'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {
                type: 'value'
            },
            series: goods,
        };
        option && myChart.setOption(option);
    }
    componentDidMount() {
        this.getOption()
    }
    render() {
        return (
                <div className='line' style={{ float: 'right', width: 600, height: 240, right: 100, top: 10 }}></div>
         
        )
    }
}