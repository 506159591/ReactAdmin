import React, { Component } from 'react'
import { Card, Button } from 'antd'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import {
  BarChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]
);
export default class Bar extends Component {

  state = {
    sales: [25, 15, 36, 39, 17, 30], // 销量的数组
    stores: [40, 35, 20, 20, 35, 20], // 库存的数组
  }

  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.map(store => store - 1)
    }), () => this.getOption())
  }

  getOption = () => {
    const { sales, stores } = this.state
    const chartDom = document.getElementsByClassName('main')[0];
    const myChart = echarts.init(chartDom);
    let option;
    option = {
      title: {
        text: '柱状图'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: sales
      }, {
        name: '库存',
        type: 'bar',
        data: stores
      }]
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
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <div className='main' style={{ width: 600, height: 400, left: 300, top: 80 }}></div>
      </div>
    )
  }
}
