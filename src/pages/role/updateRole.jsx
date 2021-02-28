import React, { Component } from 'react'
import { Input, Form, Tree } from "antd";
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
export default class UpdateRole extends Component {
  static propTypes = {
    role: PropTypes.object      //角色数据对象
  }

  constructor(props) {
    super(props)
    this.state = {
      //获取初始数据
      checkedKeys: props.role.menus
    }
  }
  /* 获取权限列表 */
  getMenuList = (menuList) => {
    return menuList.reduce((pre, menu) => {
      pre.push({
        title: menu.title,
        key: menu.key,
      })
      if (menu.children) {
        pre[pre.length - 1].children = this.getMenuList(menu.children)
      }
      return pre
    }, [])
  }
  /* 勾选权限并更新状态数据 */
  onCheck = checkedKeys => {
    this.setState({
      checkedKeys
    })
  }
  /* 提供给父组件获取最新menus数据的函数 */
  getMenus = () => this.state.checkedKeys
  componentWillMount() {
    this.treeData = this.getMenuList(menuList)
  }
  componentWillReceiveProps(nextProps) {
    //根据新传入的数据更新状态数据
    const checkedKeys = nextProps.role.menus
    this.setState({ checkedKeys })
  }
  render() {
    const { name } = this.props.role
    const { checkedKeys } = this.state

    return (
      <div>
        <Item label='角色名称'>
          <Input value={name} disabled />
        </Item>

        <Tree
          checkable
          defaultExpandAll
          selectable={false}
          checkedKeys={checkedKeys}
          treeData={this.treeData}
          onCheck={this.onCheck}
        />
      </div>
    )
  }
}
