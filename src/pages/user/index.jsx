import React, { Component } from 'react'
import { Table, Card, Button, Modal, message } from 'antd'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtils'

const { confirm } = Modal
export default class User extends Component {
    state = {
        isShow: false,
        users: [],
        roles: []
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                width: 200,
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({ users, roles })
        }
    }
    showAdd = () => {
        this.user = null
        this.setState({ isShow: true })
    }
    showUpdate = (user) => {
        this.setState({ isShow: true })
        this.user = user
    }
    addOrUpdateUser = () => {
        this.form.validateFields().then(async values => {
            this.setState({ isShow: false })
            const user = values
            if (this.user) {
                user._id = this.user._id
            }
            const result = await reqAddOrUpdateUser(user)
            if (result.status === 0) {
                message.success(`${user._id ? '修改' : '添加'}用户成功`)
                this.getUsers()
            }

        })
    }
    deleteUser = (user) => {
        confirm({
            title: `确定删除${user.username}吗`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        });
    }

    handleCancel = () => {
        this.setState({ isShow: false })
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { isShow, users, roles } = this.state
        const user = this.user || {}
        const title = (
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={users}
                    bordered
                    pagination={{ defaultPageSize: 5, showQuickJumper: true, showSizeChanger: false }}
                />
                <Modal
                    title={user._id?'修改用户':'添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                    destroyOnClose
                >
                    <UserForm
                        setForm={(form) => { this.form = form }}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
