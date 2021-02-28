import React, { Component } from 'react'
import './index.less'
import {reqWeather} from '../../api'
import { formateDate } from "../../utils/dateUtils";
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from "../link-button";
import { connect } from "react-redux";
import { logout } from "../../redux/actions";

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        temperature: '',
        weather: ''
    }
    getWeather = async () => {
        const {temperature, weather} = await reqWeather()
        this.setState({temperature, weather})
    }
    getTime = () => {
        this.timer = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    logOut = () => {
        Modal.confirm({
            title: '确认退出吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=> {
              this.props.logout()
            },
          });
    }
    componentDidMount() {
        this.getWeather()
        this.getTime()
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        const username = this.props.user.username
        const title = this.props.title
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logOut} children={'退出'}/>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span className='time'>{this.state.currentTime}</span>
                        <span className='temperature'>{this.state.weather}</span>
                        <span className='weather'>{this.state.temperature}℃</span>
                    </div>
                </div>
            </div>
        )
    
    }
}

export default connect(
    state => ({title: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header))