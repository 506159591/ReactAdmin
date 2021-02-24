import React, { Component } from 'react'
import MenuList from '../../config/menuConfig'
import { Layout, Menu } from 'antd';
import Logo from '../../assets/images/logo.png'
import './index.less'
import { Link, withRouter } from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils'

const { Sider } = Layout;
const { SubMenu } = Menu;

class LeftNav extends Component {
    hasAuth = (item) => {
        const { key, isPublic } = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
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
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>
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
export default withRouter(LeftNav)
