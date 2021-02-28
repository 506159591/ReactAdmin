import React, { Component } from 'react'
import { Cascader, Button, Card, Form, Input, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdate } from "../../api";
import PictureWall from "./picture-wall";
import EditorConvertToHTML from './rich-text-editor'

const Item = Form.Item
const { TextArea } = Input;

export default class AddUpdate extends Component {
  state = {
    options: []
  }
  constructor(props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.ed = React.createRef()
  }
  /* 发送请求，返回分类数据 */
  getCategorys = async parentId => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        //如果是一级列表，则调用初始化options的函数
        this.initOptions(categorys)
      } else {
        //如果是二级列表，则直接返回categorys
        return categorys
      }
    }
  }
  initOptions = async categorys => {
    //根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))
    const { product, isUpdate } = this
    const { pCategoryId } = product
    //若是二级分类下的商品的更新
    if (isUpdate && pCategoryId !== '0') {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成对应的二级分类列表options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      //找到对应的一级分类将options关联到其上
      const targetOption = options.find(option => option.value === pCategoryId)
      targetOption.children = childOptions
    }
    this.setState({
      options
    })
  }
  /* 验证价格的自定义验证函数 */
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }
  /* 加载下一级列表 */
  loadData = async selectedOptions => {
    //获得当前选择的option对象
    const targetOption = selectedOptions[0]
    //显示loading
    targetOption.loading = true
    //根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    //隐藏loading
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      //二级分类数组有数据，生成options并关联到option上
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
    } else {
      //当前分类没有二级分类
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options]
    })
  }
  onFinish = async values => {
    //收集数据，创建product对象
    const { name, desc, price, categoryIds } = values
    let pCategoryId, categoryId
    //判断是一级分类还是二级分类下商品
    if (categoryIds.length === 1) {
      pCategoryId = 0
      categoryId = categoryIds[0]
    } else if (categoryIds.length === 2) {
      pCategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    }
    //获取商品图片
    const imgs = this.pw.current.getImgs()
    //获取商品详情
    const detail = this.ed.current.getDetail()
    const product = { name, desc, price, pCategoryId, categoryId, imgs, detail }
    //如果是更新则将商品id加入product对象
    if (this.isUpdate) {
      product._id = this.product._id
    }
    //发送请求
    const result = await reqAddOrUpdate(product)
    if (result.status === 0) {
      message.success(`商品${product._id ? '更新' : '添加'}成功`)
      this.props.history.goBack()
    } else {
      message.error(`商品${product._id ? '更新' : '添加'}失败`)
    }
  }
  componentWillMount() {
    const product = this.props.location.state
    this.isUpdate = !!product
    this.product = product || {}

  }
  componentDidMount() {
    this.getCategorys('0')
  }
  render() {
    const { product, isUpdate } = this
    const { categoryId, pCategoryId, imgs, detail } = this.product
    const categoryIds = []
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const title = (
      <span>
        <LinkButton
          style={{ marginRight: 20, fontSize: 20 }}
          onClick={() => this.props.history.goBack()} >
          <ArrowLeftOutlined />
        </LinkButton>
        <span style={{ fontSize: 20 }}>{isUpdate ? '修改' : '添加'}商品</span>
      </span>
    )
    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
    return (
      <Card title={title}>
        <Form
          {...layout}
          onFinish={this.onFinish}
          initialValues={{
            name: product.name,
            desc: product.desc,
            price: product.price,
            categoryIds: categoryIds
          }}
        >
          <Item
            label="商品名称"
            name='name'
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder='请输入商品名称' />
          </Item>
          <Item
            label="商品描述"
            name='desc'
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <TextArea
              placeholder="请输入商品描述"
              autosize={{ minRows: 2, maxRows: 6 }}
            />
          </Item>
          <Item
            label="商品价格"
            name='price'
            rules={[{ required: true, message: '请输入商品价格' },
            { validator: this.validatePrice }
            ]}

          >
            <Input
              type='number'
              addonAfter={'元'}
              placeholder="请输入商品价格"
            />
          </Item>
          <Item
            label="商品分类"
            name='categoryIds'
            rules={[{ required: true, message: '请指定商品分类' }]}
          >
            <Cascader
              options={this.state.options}
              placeholder="请指定商品分类"
              loadData={this.loadData}
            />
          </Item>
          <Item
            label="商品图片"
            name='images'
          >
            <PictureWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item
            label="商品详情"
            name='detail'
            wrapperCol={{ span: 18 }}
          >
            <EditorConvertToHTML ref={this.ed} detail={detail} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
