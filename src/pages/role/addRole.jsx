import React, { Component } from 'react'
import { Input, Form } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item
export default class AddRole extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired    //传递Form实体的函数
  }
  /* 创建ref获取Form实体 */
  formRef = React.createRef();
  componentDidMount() {
    //将Form实体传递给父组件
    this.props.setForm(this.formRef.current)
  }
  componentWillReceiveProps() {
    //重置表单内容
    this.formRef.current.resetFields()
  }
  render() {
    return (
      <Form ref={this.formRef}>
        <Item
          label='角色名称'
          name='roleName'
          rules={[{ required: true, message: '角色名称必须填写' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Item>
      </Form>
    )
  }
}
