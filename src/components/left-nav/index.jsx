import React, { Component } from 'react'
import MenuList from '../../config/menuConfig'
import { Layout, Menu } from 'antd';
import Logo from '../../assets/images/logo.png'
import './index.less'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { setHeadTitle } from '../../redux/actions'

const { Sider } = Layout;
const { SubMenu } = Menu;

class LeftNav extends Component {
  hasAuth = (item) => {
    const { key, isPublic } = item
    const menus = this.props.user.role.menus
    const username = this.props.user.username
    if (username === 'admin' || menus.indexOf(key) !== -1 || isPublic) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }
  getMenuNodes = MenuList => {
    const path = this.props.location.pathname
    return MenuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          if (item.key === path || path.indexOf(item.key)===0) {
            this.props.setHeadTitle(item.title)
          }
          pre.push((
            <Menu.Item
              key={item.key}
              icon={item.icon}
            >
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                {item.title}
              </Link>
            </Menu.Item>
          ))
        } else {
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          if (cItem) {
            this.openKey = item.key
          }
          pre.push((
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return pre
    }, [])
  }
  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(MenuList)
  }
  render() {
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }
    const openKey = this.openKey
    return (
      <div className='left-nav'>
        <div className='left-nav-header'>
          <img src={Logo} alt="" />
          <h2>硅谷后台</h2>
        </div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider>
            <Menu theme="dark" mode="inline" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
              {this.menuNodes}
            </Menu>
          </Sider>
        </Layout>
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  { setHeadTitle }
)(withRouter(LeftNav))
