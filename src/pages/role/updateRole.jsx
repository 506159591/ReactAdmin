import React, { Component } from 'react'
import { Input, Form, Tree } from "antd";
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
export default class UpdateRole extends Component {
    static propTypes = {
        role: PropTypes.object
    }
    
    constructor(props){
        super(props)
        this.state = {
            checkedKeys: props.role.menus
        }
    }
    getMenuList = (menuList) => {
        return menuList.reduce((pre, menu) => {
            pre.push({
                title: menu.title,
                key: menu.key,
            })
            if (menu.children) {
                pre[pre.length-1].children=this.getMenuList(menu.children)
            }
            return pre
        }, [])
    }
    onCheck = checkedKeys => {
        this.setState({
            checkedKeys
        })
    }
    getMenus = () => this.state.checkedKeys
    componentWillMount () {
        this.treeData = this.getMenuList(menuList)
    }
    componentWillReceiveProps(nextProps){
        const checkedKeys = nextProps.role.menus
        this.setState({checkedKeys})
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
