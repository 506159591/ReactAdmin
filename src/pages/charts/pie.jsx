import React, { Component } from 'react'
import { Card, Button } from 'antd'
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import {
    PieChart
} from 'echarts/charts';
import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
);

/*
后台管理的饼图路由组件
 */
export default class Pie extends Component {
    state={
        sales: [
            { value: 25, name: '衬衫' },
            { value: 20, name: '羊毛衫' },
            { value: 36, name: '雪纺衫' },
            { value: 30, name: '裤子' },
            { value: 20, name: '高跟鞋' },
            { value: 20, name: '袜子' }
        ]
    }
    update = () => {
        
    }
    getOption = () => {
        const {sales} = this.state
        const chartDom = document.getElementsByClassName('main')[0];
        const myChart = echarts.init(chartDom);
        let option;
        option = {
            title: {
                text: '饼图',
                subtext: '销量比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '销量占比',
                    type: 'pie',
                    radius: '60%',
                    data: sales,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }
    componentDidMount() {
        this.getOption()
    }

    render() {
        return (
            <div>
                <Card>
                    <Button type='primary' disabled onClick={this.update}>更新</Button>
                </Card>
                <div className='main' style={{ width: 600, height: 400, left: 300, top: 80 }}></div>
            </div>
        )
    }
}