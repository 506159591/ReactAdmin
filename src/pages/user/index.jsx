import React, { Component } from 'react'
import { Table, Card, Button, Modal, message } from 'antd'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtils'

const { confirm } = Modal
export default class User extends Component {
  state = {
    isShow: false,    //对话框显示的标识
    users: [],        //用户列表数据
    roles: []         //角色列表数据
  }
  /* 初始化Table的每列的数组 */
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
  /* 初始化角色列表数据对象 */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }
  /* 发送请求，返回用户列表数据 */
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      //传入roles初始化角色列表数据
      this.initRoleNames(roles)
      this.setState({ users, roles })
    }
  }
  /* 显示添加对话框 */
  showAdd = () => {
    //清除user
    this.user = null
    this.setState({ isShow: true })
  }
  /* 显示更新对话框 */
  showUpdate = (user) => {
    this.setState({ isShow: true })
    //保存user数据
    this.user = user
  }
  addOrUpdateUser = () => {
    //表单验证通过
    this.form.validateFields().then(async values => {
      //隐藏对话框
      this.setState({ isShow: false })
      //收集数据
      const user = values
      //如果是更新，将id添加进user对象中
      if (this.user) {
        user._id = this.user._id
      }
      const result = await reqAddOrUpdateUser(user)
      if (result.status === 0) {
        message.success(`${user._id ? '修改' : '添加'}用户成功`)
        //更新数据与视图
        this.getUsers()
      }

    })
  }
  /* 删除用户 */
  deleteUser = (user) => {
    confirm({
      title: `确定删除${user.username}吗`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          //更新数据与视图
          this.getUsers()
        }
      }
    });
  }
  /* 隐藏对话框 */
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
          title={user._id ? '修改用户' : '添加用户'}
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
