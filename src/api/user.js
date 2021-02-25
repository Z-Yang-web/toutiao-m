// 用户相关的请求模块
import request from '@/utils/request' // 导入request中的request
// import store from '@/store'
// 用户登录
export const login = data => {
  // data是形参 调用login时需要将这次请求的数据传递过来
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //     // 此接口的访问是有权限的
    //     Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
