// 封装axios请求模块
import axios from 'axios'
import store from '@/store'
const request = axios.create({
  // create会返回一个新的axios请求对象
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础根路径
})
// 通过请求拦截器统一为权限接口添加请求头
request.interceptors.request.use(function (config) {
  //  在请求正式发起之前do somethings
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里必须返回这个config配置对象,否则请求就停在这里出不去了
  return config
}, function (error) {
  return Promise.reject(error)
})
export default request
