import React, { Component } from 'react'
import { Table, Card, Button, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
import AddCategory from './addcategory'
import UpdataCategory from './updatacategory'

export default class Category extends Component {

    state = {
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        loading: false,
        showStatus: 0
    }

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
    getCategorys = async (parentId) => {
        parentId = parentId || this.state.parentId
        this.setState({ loading: true })
        const result = await reqCategorys(parentId)
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.setState({ categorys })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }

            console.log(this.state.categorys)
        }
    }
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys()
        })
    }
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }
    addCategory = () => {
        this.form.validateFields().then(async values => {
            this.setState({ showStatus: 0 })
            const {parentId, categoryName} = values
            const result = await reqAddCategory(parentId, categoryName)
            if (result.status === 0) {
                if (parentId === this.state.parentId) {
                    this.getCategorys()
                }else if (parentId === '0') {
                    this.getCategorys('0')
                }
            }
        })

    }
    showUpdata = (category) => {
        this.category = category
        this.setState({ showStatus: 2 })
    }
    updataCategory = () => {
        this.form.validateFields().then(async values => {
            this.setState({ showStatus: 0 })
            const categoryId = this.category._id
            const {categoryName} = values
            const result = await reqUpdateCategory(categoryId, categoryName)
            if (result.status === 0) {
                this.getCategorys()
            }
        })
    }

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
                        categoryName={category.name?category.name:''}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}
