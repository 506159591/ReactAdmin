import { SET_HEAD_TITLE, RECEIVE_USER, ERROR_MESSAGE, REMOVE_USER } from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

/* 设置头部标题的action */
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })
/* 接受用户信息的同步action */
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
/* 接收错误信息的action */
const errMsg = (errMsg) => ({ type: ERROR_MESSAGE, data: errMsg })
/* 退出登录清除信息的action */
export function logout() {
  storageUtils.removeUser()
  return { type: REMOVE_USER }
}
/* 接收用户信息的异步action */
export function login(username, password) {
  return async dispatch => {
    const result = await reqLogin(username, password)
    if (result.status === 0) {
      const user = result.data
      //将用户信息保存到localStorage中
      storageUtils.saveUser(user)
      dispatch(receiveUser(user))
    } else {
      const msg = result.msg
      dispatch(errMsg(msg))
    }
  }
}
