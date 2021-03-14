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
  //判断当前用户的item权限
  hasAuth = (item) => {
    const { key, isPublic } = item
    const menus = this.props.user.role.menus
    const username = this.props.user.username
    //1.是否是admin 2.权限中有没有当前item 3.item中是否有isPublic
    if (username === 'admin' || menus.indexOf(key) !== -1 || isPublic) {
      return true
    } else if (item.children) {
      //当item有子item时，判断当前用户是否有子item权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }
  //获取导航栏标签数组
  getMenuNodes = MenuList => {
    const path = this.props.location.pathname
    return MenuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          //判断当前item的key是否与当前路径匹配
          if (item.key === path || path.indexOf(item.key)===0) {
            //获取标题
            this.props.setHeadTitle(item.title)
          }
          //向pre添加<Menu.Item>
          pre.push((
            <Menu.Item
              key={item.key}
              icon={item.icon}
            >
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)/* 点击item时获取相应标题 */}>
                {item.title}
              </Link>
            </Menu.Item>
          ))
        } else {
          //查找与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          if (cItem) {
            //如果存在,当前item的子列表需要打开
            this.openKey = item.key
          }
          //通过递归，向pre添加<SubMenu>
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
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(MenuList)
  }
  render() {
    let path = this.props.location.pathname
    if(path.indexOf('/product')===0) { // 当前请求的是商品或其子路由界面
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
