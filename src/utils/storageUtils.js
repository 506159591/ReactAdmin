import store from 'store'

const USER_KEY = 'user_key'
const storageUtils = {
  //将user信息存储到localStorage
  saveUser(user) {
    return store.set(USER_KEY, user)
  },
  //从localStorage中获取user信息
  getUser() {
    return store.get(USER_KEY) || {}
  },
  //将user信息移除出localStorage
  removeUser() {
    return store.remove(USER_KEY)
  }
}
export default storageUtils