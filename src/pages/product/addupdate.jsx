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
        this.pw = React.createRef()
        this.ed = React.createRef()
    }

    getCategorys = async parentId => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                return categorys
            }
        }
    }
    initOptions = async categorys => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        const { product, isUpdate } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }
        this.setState({
            options
        })
    }
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })
    }
    onFinish = async values => {
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = 0
            categoryId = categoryIds[0]
        } else if (categoryIds.length === 2) {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.ed.current.getDetail()
        const product = { name, desc, price, pCategoryId, categoryId, imgs, detail }
        if (this.isUpdate) {
            product._id = this.product._id
        }
        const result = await reqAddOrUpdate(product)
        if (result.status === 0) {
            message.success(`商品${product._id ? '更新' : '添加'}成功`)
            this.props.history.goBack()
        } else {
            message.error(`商品${product._id ? '更新' : '添加'}失败`)
        }
    }
    UNSAFE_componentWillMount() {
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
