import ajax from './ajax'
import jsonp from 'jsonp'

const BASE = ''
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
export const reqAddUser = user => ajax(BASE + '/login', user, 'POST')
export const reqCategorys = parentId => ajax(BASE + 'http://120.55.193.14:5000/manage/category/list', {parentId})
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + 'http://120.55.193.14:5000/manage/category/update', {categoryId, categoryName}, 'POST')
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + 'http://120.55.193.14:5000/manage/category/add', {parentId, categoryName}, 'POST')
export const reqProduct = (pageNum, pageSize) => ajax(BASE + 'http://120.55.193.14:5000/manage/product/list', {pageNum, pageSize})
export const reqSearchProduct = (pageNum, pageSize, searchContent, searchType) => ajax(BASE+'http://120.55.193.14:5000/manage/product/search', {pageNum ,pageSize, [searchType]:searchContent})
export const reqUpdataStatus = (productId, status) => ajax(BASE+'http://120.55.193.14:5000/manage/product/updateStatus', {productId, status}, 'POST')
export const reqCategory = categoryId => ajax(BASE + 'http://120.55.193.14:5000/manage/category/info', {categoryId})
export const reqDeletImage = name => ajax(BASE + 'http://120.55.193.14:5000/manage/img/delete', {name}, 'POST')
export const reqAddOrUpdate = product => ajax(BASE + 'http://120.55.193.14:5000/manage/product/'+(product._id?'update':'add'), product, 'POST')
export const reqRoles = () => ajax(BASE + 'http://120.55.193.14:5000/manage/role/list')
export const reqAddRole = (roleName) => ajax(BASE+'http://120.55.193.14:5000/manage/role/add', {roleName}, 'POST')
export const reqUpdateRole = (role) => ajax(BASE+'http://120.55.193.14:5000/manage/role/update', role, 'POST')
export const reqUsers = () => ajax(BASE+'http://120.55.193.14:5000/manage/user/list')
export const reqDeleteUser = (userId) => ajax(BASE+'http://120.55.193.14:5000/manage/user/delete', {userId}, 'POST')
export const reqAddOrUpdateUser = (user) => ajax(BASE+`http://120.55.193.14:5000/manage/user/${user._id?'update':'add'}`, user, 'POST')
export const reqWeather = () => {
    return new Promise((resolve, reject)=> {
        const url = 'https://restapi.amap.com/v3/weather/weatherInfo?parameters&key=17fefc98db17d274ac13eed2ff063baa&city=110000'
        jsonp(url, {}, (err, data)=> {
            if (!err && data.status === '1') {
                const {temperature, weather} = data.lives[0]
                resolve({temperature, weather})
            }else {
                console.log(err)
            }
        })
    })
}
