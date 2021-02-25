import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '../utils/storage'
Vue.use(Vuex)
// token中的key
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 用户的登录信息(读取出来的是字符串,通过parse转换为对象)
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 为了防止页面刷新数据丢失,我们需要把数据加载到本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(user))
      setItem(TOKEN_KEY, state.user)
      // localStorage只能存储字符串, 所以通过stringify将user对象转换为json形式的字符串, 再存储到localStorage
    }
  },
  actions: {},
  modules: {}
})
