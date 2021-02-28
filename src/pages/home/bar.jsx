import React, {Component} from 'react'
import * as echarts from 'echarts/core';
import {
    GridComponent
} from 'echarts/components';
import {
    BarChart
} from 'echarts/charts';
import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [GridComponent, BarChart, CanvasRenderer]
);

export default class Bar extends Component {

  state = {
      data: [25, 45, 36, 39, 37, 30, 45, 35, 50, 34, 29, 42], //
  }

  getOption = () => {
      const {data} = this.state
      const chartDom = document.getElementsByClassName('bar')[0];
      const myChart = echarts.init(chartDom);
      let option;
      option = {
          title: {
              text: '柱状图'
          },
          tooltip: {},
          legend: {
              data:['销量']
          },
          xAxis: {
              data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
          },
          yAxis: {},
          series: [{
              name: '访问量',
              type: 'bar',
              data: data
          }]
      };
      option && myChart.setOption(option);
  }
  componentDidMount() {
      this.getOption()
  }
  render() {
      return (
              <div className='bar' style={{ width: 600, height: 300, top: 10, left: 40 }}></div>
      )
  }
}