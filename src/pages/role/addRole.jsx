import React, { Component } from 'react'
import { Input, Form } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item
export default class AddRole extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }
    formRef = React.createRef();
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }
    componentWillReceiveProps() {
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
