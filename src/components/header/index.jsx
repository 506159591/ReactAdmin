import React, { Component } from 'react'
import './index.less'
import {reqWeather} from '../../api'
import { formateDate } from "../../utils/dateUtils";
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from "../link-button";

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        temperature: '',
        weather: ''
    }
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            
            if (item.key === path) {
                title = item.title
            }else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
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
              storageUtils.removeUser()
              memoryUtils.user={}
              this.props.history.replace('/login')
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
        const username = memoryUtils.user.username
        const title = this.getTitle()
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

export default withRouter(Header)