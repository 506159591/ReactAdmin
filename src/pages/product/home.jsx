import React, { Component } from 'react'
import { Table, Card, Button, Input, Select, message } from 'antd';
import { reqProduct, reqSearchProduct, reqUpdataStatus } from "../../api/index";
import LinkButton from '../../components/link-button'
import { PlusOutlined } from '@ant-design/icons';
import { PAGESIZE } from "../../utils/constants";

const { Option } = Select;
export default class Home extends Component {
  state = {
    loading: false,               //是否显示loading的标识
    products: [],                 //商品数据
    total: 0,                     //总条数
    searchType: 'productName',    //搜索类型
    searchContent: ''             //搜索内容
  }
  /* 初始化Table的每列的数组 */
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price
      },
      {
        width: 100,
        title: '状态',
        render: (product) => {
          const { _id, status } = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button type='primary' onClick={() => this.updataStatus(_id, newStatus)}>{status === 1 ? '下架' : '上架'}</Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 120,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ]
  }
  /* 发送请求获取商品数据 */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    const { searchContent, searchType } = this.state
    //显示loading
    this.setState({ loading: true })
    let result
    //搜索框有内容则按需搜索
    if (searchContent) {
      result = await reqSearchProduct(pageNum, PAGESIZE, searchContent, searchType)
    } else {
      result = await reqProduct(pageNum, PAGESIZE)
    }
    //隐藏loading
    this.setState({ loading: false })
    if (result.status === 0) {
      const { total, list } = result.data
      this.setState({ total, products: list })
    }
  }
  /* 切换商品上下架 */
  updataStatus = async (productId, status) => {
    //发送请求，返回数据
    const result = await reqUpdataStatus(productId, status)
    if (result.status === 0) {
      //消息提示，更新状态与视图
      message.success('更新成功')
      this.getProducts(this.pageNum)
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  render() {
    const { loading, products, total, searchContent, searchType } = this.state
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 200 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>

        <Input
          placeholder='关键字'
          style={{ width: 150, margin: '0 15px' }}
          value={searchContent}
          onChange={event => this.setState({ searchContent: event.target.value })}
        />

        <Button
          type='primary'
          onClick={() => this.getProducts(1)}
        >
          搜索
                </Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <PlusOutlined />
              添加商品
      </Button>
    )
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            rowKey='_id'
            loading={loading}
            columns={this.columns}
            dataSource={products}
            bordered
            pagination={{
              total,
              defaultPageSize: PAGESIZE,
              showSizeChanger: false,
              showQuickJumper: true,
              onChange: this.getProducts
            }}
          />
        </Card>
      </div>
    )
  }
}
