import React, { Component } from 'react'
import { Input, Form } from "antd";
import PropTypes from 'prop-types'
const Item = Form.Item
export default class UpdataCategory extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    formRef = React.createRef();
    
    componentDidMount(){
        this.props.setForm(this.formRef.current)
    }
    render() {
        const {categoryName} = this.props
        return (
            <Form
            ref={this.formRef}
            initialValues={{categoryName}}
            >
                <Item
                name='categoryName'
                rules={[{ required: true, message: '分类名称必须填写' }]} 
                >
                    <Input placeholder="请输入分类名称"/>
                </Item>
            </Form>
        )
    }
}
