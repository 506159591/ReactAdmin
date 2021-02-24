import React, { Component } from 'react'
import { Table, Card, Button, Modal, message } from 'antd';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddRole from './addRole'
import UpdateRole from './updateRole'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'


export default class Role extends Component {

    constructor(props) {
        super(props);
        this.ur = React.createRef()
    }
    state = {
        roles: [],
        role: {},
        showStatus: 0
    }
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({ role })
            }
        }
    }
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }
    addRole = () => {
        this.form.validateFields().then(async values => {
            this.setState({
                showStatus: 0
            })
            const { roleName } = values
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                message.success('添加角色成功')
                const role = result.data
                const roles = [...this.state.roles, role]
                this.setState({ roles })
            } else {
                message.error('添加角色失败')
            }
        })
    }
    updateRole = async () => {
        this.setState({
            showStatus: 0
        })
        const role = this.state.role
        const menus = this.ur.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            if (role._id === memoryUtils.user.role_id) {
                message.success('当前角色权限改变，需重新登录')
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }else{
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                  })
            }
        }
    }
    componentWillMount() {
        this.initColumns()
        this.getRoles()
    }
    render() {
        const { roles, role, showStatus } = this.state
        const title = (
            <div>
                <Button type='primary' onClick={() => this.setState({ showStatus: 1 })}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({ showStatus: 2 })}>设置角色权限</Button>
            </div>
        )
        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={roles}
                    bordered
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => this.setState({ role })
                    }}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true, showSizeChanger: false }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={showStatus === 1}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddRole
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="权限管理"
                    visible={showStatus === 2}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel}
                >
                    <UpdateRole
                        role={role}
                        ref={this.ur}
                    />
                </Modal>
            </Card>
        )
    }
}
