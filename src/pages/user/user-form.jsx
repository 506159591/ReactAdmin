import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

export default class UserForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,   //传递Form实体的函数
    roles: PropTypes.array.isRequired,    //角色列表数据
    user: PropTypes.object                //用户数据
  }
  /* 创建ref获取Form实体 */
  formRef = React.createRef();
  componentDidMount() {
    //将Form实体传递给父组件
    this.props.setForm(this.formRef.current)
  }
  render() {
    const { roles, user } = this.props
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    }
    return (
      <Form
        {...formItemLayout}
        ref={this.formRef}
        initialValues={{
          username: user.username,
          password: user.password,
          phone: user.phone,
          email: user.email,
          role_id: user.role_id
        }}
      >
        <Form.Item
          label="用户名"
          name='username'
          rules={[{ required: true, whitespace: true, message: '用户名必须输入' },
          { min: 4, message: '用户名至少4位' },
          { max: 12, message: '用户名最多12位' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
          ]}
        >
          <Input />
        </Form.Item>
        {user._id ? null : (<Form.Item
          label="密码"
          name='password'
          rules={[{ required: true, whitespace: true, message: '密码必须输入' },
          { min: 4, message: '密码至少4位' },
          { max: 12, message: '密码最多12位' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成' },
          ]}
        >
          <Input />
        </Form.Item>)}
        <Form.Item
          label="手机"
          name='phone'
          rules={[{ required: true, whitespace: true, message: '手机号必须输入' },
          { len: 11, message: '手机号长度为11位' },
          { pattern: /^[0-9_]+$/, message: '手机号必须是数字组成' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name='email'
          rules={[{ required: true, whitespace: true, message: '邮箱必须输入' },
          { type: 'email', message: '请输入正确的邮箱地址' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="角色"
          name='role_id'
          rules={[{ required: true, message: '角色必须选择' }]}
        >
          <Select>
            {roles.map(role => <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>)}
          </Select>
        </Form.Item>
      </Form>
    )
  }
}
