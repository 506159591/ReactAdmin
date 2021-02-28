import React, { Component } from 'react'
import { Table, Card } from 'antd';

export default class Order extends Component {
    initColums = () => {
        this.columns = [
            {
                title: '订单编号',
                dataIndex: '_id',
            },
            {
                title: '购买用户',
                dataIndex: 'name',
            },
            {
                title: '商品',
                dataIndex: 'goods',
            },
            {
                title: '数量',
                dataIndex: 'num',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price
            },
            {
                title: '地址',
                dataIndex: 'address',
            }
        ]
    }
    componentWillMount(){
        this.initColums()
    }
    render() {
        const dataSource = [
            {
              _id: '1',
              name: '胡彦斌',
              goods: '羊毛衫',
              num: '1',
              price: 180,
              address: '西湖区湖底公园1号',
            },
            {
                _id: '2',
                name: '张鹏',
                goods: '袜子',
                num: '5',
                price: 90,
                address: '北京市朝阳区19巷',
              },
              {
                _id: '3',
                name: '赵王',
                goods: '羽绒服',
                num: '1',
                price: 390,
                address: '成华大道二仙桥5号',
              },
              {
                  _id: '4',
                  name: '唐元',
                  goods: '裤子',
                  num: '5',
                  price: 135,
                  address: '普陀区光明大厦7号',
                },
                {
                    _id: '5',
                    name: '胡彦斌',
                    goods: '羊毛衫',
                    num: '1',
                    price: 180,
                    address: '西湖区湖底公园1号',
                  },
                  {
                      _id: '6',
                      name: '张鹏',
                      goods: '袜子',
                      num: '5',
                      price: 90,
                      address: '北京市朝阳区19巷',
                    },
                    {
                      _id: '7',
                      name: '赵王',
                      goods: '羊毛衫',
                      num: '1',
                      price: 180,
                      address: '成华大道二仙桥5号',
                    },
                    {
                        _id: '8',
                        name: '唐元',
                        goods: '袜子',
                        num: '5',
                        price: 90,
                        address: '普陀区光明大厦7号',
                      },
          ];
        return (
            <Card title='订单管理'>
            <Table
                rowKey='_id'
                columns={this.columns}
                dataSource={dataSource}
                bordered
                pagination={{ defaultPageSize: 5, showQuickJumper: true, showSizeChanger: false }}
            />
        </Card>
        )
    }
}
