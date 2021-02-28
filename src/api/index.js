import ajax from './ajax'
import jsonp from 'jsonp'

const BASE = ''
//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
//获取分类列表
export const reqCategorys = parentId => ajax(BASE + 'http://120.55.193.14:5000/manage/category/list', { parentId })
//更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + 'http://120.55.193.14:5000/manage/category/update', { categoryId, categoryName }, 'POST')
//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + 'http://120.55.193.14:5000/manage/category/add', { parentId, categoryName }, 'POST')
//获取商品列表
export const reqProduct = (pageNum, pageSize) => ajax(BASE + 'http://120.55.193.14:5000/manage/product/list', { pageNum, pageSize })
//搜索商品
export const reqSearchProduct = (pageNum, pageSize, searchContent, searchType) => ajax(BASE + 'http://120.55.193.14:5000/manage/product/search', { pageNum, pageSize, [searchType]: searchContent })
//更新商品上下架信息
export const reqUpdataStatus = (productId, status) => ajax(BASE + 'http://120.55.193.14:5000/manage/product/updateStatus', { productId, status }, 'POST')
//获取一个分类
export const reqCategory = categoryId => ajax(BASE + 'http://120.55.193.14:5000/manage/category/info', { categoryId })
//删除图片
export const reqDeletImage = name => ajax(BASE + 'http://120.55.193.14:5000/manage/img/delete', { name }, 'POST')
//更新和添加商品
export const reqAddOrUpdate = product => ajax(BASE + 'http://120.55.193.14:5000/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
//获取角色列表
export const reqRoles = () => ajax(BASE + 'http://120.55.193.14:5000/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE + 'http://120.55.193.14:5000/manage/role/add', { roleName }, 'POST')
//更新角色权限
export const reqUpdateRole = (role) => ajax(BASE + 'http://120.55.193.14:5000/manage/role/update', role, 'POST')
//获取用户列表
export const reqUsers = () => ajax(BASE + 'http://120.55.193.14:5000/manage/user/list')
//删除用户
export const reqDeleteUser = (userId) => ajax(BASE + 'http://120.55.193.14:5000/manage/user/delete', { userId }, 'POST')
//添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + `http://120.55.193.14:5000/manage/user/${user._id ? 'update' : 'add'}`, user, 'POST')
//获取天气信息
export const reqWeather = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://restapi.amap.com/v3/weather/weatherInfo?parameters&key=17fefc98db17d274ac13eed2ff063baa&city=110000'
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === '1') {
        const { temperature, weather } = data.lives[0]
        resolve({ temperature, weather })
      } else {
        console.log(err)
      }
    })
  })
}
