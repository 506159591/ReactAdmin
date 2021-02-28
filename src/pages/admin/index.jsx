import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import { Layout } from 'antd';
import { connect } from "react-redux";

import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Order from '../order'

const { Footer, Sider, Content } = Layout;
class Admin extends Component {
  render() {
    const user = this.props.user
    /* 判断如果没有user信息，则重定向到登录界面 */
    if (!user || !user._id) {
      return <Redirect to='/login' />
    }
    return (
      <div>
        <Layout>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header />
            <Content style={{ backgroundColor: '#fff', margin: '30px' }}>
              <Switch>
                <Route path='/home' component={Home} />
                <Route path='/category' component={Category} />
                <Route path='/product' component={Product} />
                <Route path='/order' component={Order} />
                <Route path='/user' component={User} />
                <Route path='/role' component={Role} />
                <Route path='/charts/bar' component={Bar} />
                <Route path='/charts/line' component={Line} />
                <Route path='/charts/pie' component={Pie} />
                <Redirect to='/home' />
              </Switch>
            </Content>
            <Footer style={{ color: 'rgb(204,204,204)', backgroundColor: '#f0f2f5', textAlign: 'center' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}
export default connect(
  state => ({ user: state.user }),
  {}
)(Admin)
