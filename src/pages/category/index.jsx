import React, { Component } from 'react'
import { Table, Card, Button, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
import AddCategory from './addcategory'
import UpdataCategory from './updatacategory'

export default class Category extends Component {

  state = {
    categorys: [],      //一级分类
    subCategorys: [],   //二级分类
    parentId: '0',      //父分类ID
    parentName: '',     //父分类名称
    loading: false,     //是否显示loading的标识
    showStatus: 0       //是否显示对话框标识 0不显示 1显示添加 2显示修改
  }
/* 初始化Table的每列的数组 */
  initColums = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdata(category)}>修改分类</LinkButton>
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
          </span>
        )
      },
    ]
  }
  /* 获取分类列表，若没有传入parentId则按state中的值为参数 */
  getCategorys = async (parentId) => {
    parentId = parentId || this.state.parentId
    //显示loading
    this.setState({ loading: true })
    //发送请求
    const result = await reqCategorys(parentId)
    //隐藏loading
    this.setState({ loading: false })
    //请求成功，获得数据
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        //更新一级分类数据
        this.setState({ categorys })
      } else {
        this.setState({
          //更新二级分类数据
          subCategorys: categorys
        })
      }
    }
  }
  /* 显示对于一级分类的二级列表 */
  showSubCategorys = (category) => {
    //设置对应一级分类的id和name
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      //在状态数据更新后发送请求
      this.getCategorys()
    })
  }
  /* 显示一级分类列表 */
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  /* 显示添加对话框 */
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }
  /* 添加分类 */
  addCategory = () => {
    //表单验证通过后执行
    this.form.validateFields().then(async values => {
      //隐藏对话框
      this.setState({ showStatus: 0 })
      //收集数据
      const { parentId, categoryName } = values
      //发送请求
      const result = await reqAddCategory(parentId, categoryName)
      if (result.status === 0) {
        if (parentId === this.state.parentId) {
          //若添加的是当前显示列表的分类，则获取最新数据并更新视图
          this.getCategorys()
        } else if (parentId === '0') {
          //若添加的是一级分类列表的分类，则获取最新一级分类的数据并更新视图
          this.getCategorys('0')
        }
      }
    })

  }
  /* 显示更新对话框 */
  showUpdata = (category) => {
    //保存当前选中的category
    this.category = category
    this.setState({ showStatus: 2 })
  }
  /* 更新分类 */
  updataCategory = () => {
    //表单验证通过后执行
    this.form.validateFields().then(async values => {
      //隐藏对话框
      this.setState({ showStatus: 0 })
      //获取当前分类的id和name
      const categoryId = this.category._id
      const { categoryName } = values
      //发送请求
      const result = await reqUpdateCategory(categoryId, categoryName)
      if (result.status === 0) {
        //请求成功，更新视图
        this.getCategorys()
      }
    })
  }
  /* 隐藏对话框 */
  handleCancel = () => {
    this.setState({ showStatus: 0 })
  }
  componentWillMount() {
    this.initColums()
  }
  componentDidMount() {
    this.getCategorys()

  }
  render() {
    const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
    const category = this.category || {}
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys} style={{ marginRight: 5 }}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{ marginRight: 10 }} />
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <PlusOutlined />
              添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          loading={loading}
          columns={this.columns}
          dataSource={parentId === '0' ? categorys : subCategorys}
          bordered
          pagination={{ defaultPageSize: 5, showQuickJumper: true, showSizeChanger: false }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <AddCategory
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updataCategory}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <UpdataCategory
            categoryName={category.name ? category.name : ''}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
      </Card>
    )
  }
}
