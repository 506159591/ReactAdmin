import { message } from 'antd'
import axios from 'axios'

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    if (type === 'GET') {
      //发送GET请求
      promise = axios.get(url, {
        params: data     //配置参数
      })
    } else {
      //发送POST请求
      promise = axios.post(url, data)
    }
    promise.then(response => {
      //请求成功，调用resolve
      resolve(response.data)
    }).catch(error => {
      //请求失败，提示信息
      message.error("请求出错了", error.message)
    })
  })
}
