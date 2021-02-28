import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.css'
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { login } from '../../redux/actions'

class Login extends Component {
    onFinish = async values => {
        const { username, password } = values
        this.props.login(username, password)
    }
    render() {
        const user = this.props.user
        if (user._id) {
            return <Redirect to='/' />
        }
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-section'>
                    <div className={user.errMsg ? 'err-msg show' : 'err-msg'}>用户名或密码不正确</div>
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, whitespace: true, message: '用户名必须输入' },
                            { min: 4, message: '用户名至少4位' },
                            { max: 12, message: '用户名最多12位' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, whitespace: true, message: '密码必须输入' },
                            { min: 4, message: '密码至少4位' },
                            { max: 12, message: '密码最多12位' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成' },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { login }
)(Login)
