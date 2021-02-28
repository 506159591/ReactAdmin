import React, { Component } from 'react'
import { Table, Card, Button, Modal, message } from 'antd'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddRole from './addRole'
import UpdateRole from './updateRole'
import { formateDate } from '../../utils/dateUtils'
import { connect } from "react-redux"
import { logout } from '../../redux/actions'

class Role extends Component {

  constructor(props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.ur = React.createRef()
  }
  state = {
    roles: [],      //角色列表数据
    role: {},       //角色数据
    showStatus: 0   //对话框显示标识 0隐藏 1添加 2更新
  }
  /* 初始化Table的每列的数组 */
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
  /* 获取角色列表数据 */
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }
  //获取当前行的对应角色数据
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({ role })
      }
    }
  }
  //隐藏对话框
  handleCancel = () => {
    this.setState({
      showStatus: 0
    })
  }
  /* 添加角色 */
  addRole = () => {
    //表单验证通过后调用
    this.form.validateFields().then(async values => {
      //隐藏对话框
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
  /* 更新角色 */
  updateRole = async () => {
    //隐藏对话框
    this.setState({
      showStatus: 0
    })
    //收集数据
    const role = this.state.role
    const menus = this.ur.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      //若修改的角色与当前用户角色一致，则需重新登陆
      if (role._id === this.props.user.role_id) {
        message.success('当前角色权限改变，需重新登陆')
        this.props.logout()
      } else {
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
export default connect(
  state => ({ user: state.user }),
  { logout }
)(Role)
