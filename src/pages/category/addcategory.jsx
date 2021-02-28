import React, { Component } from 'react'
import { Input, Form, Select } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
export default class AddCategory extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,       //传递Form实体的函数
    categorys: PropTypes.array.isRequired,    //分类列表数据
    parentId: PropTypes.string.isRequired     //父分类id
  }
  /* 创建ref获取Form实体 */
  formRef = React.createRef();
  componentDidMount() {
    //将Form实体传递给父组件
    this.props.setForm(this.formRef.current)
  }
  render() {
    const { parentId, categorys } = this.props
    return (
      <Form
        ref={this.formRef}
        initialValues={{ parentId }}
      >
        <Item name='parentId'>
          <Select>
            <Option value='0'>一级分类</Option>
            {categorys.map(item => <Option value={item._id}>{item.name}</Option>)}
          </Select>
        </Item>
        <Item name='categoryName' rules={[{ required: true, message: '分类名称必须填写' }]}>
          <Input placeholder="请输入分类名称" />
        </Item>
      </Form>
    )
  }
}
