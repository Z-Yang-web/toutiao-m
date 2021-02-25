import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.less'
import Vant from 'vant'
// 加载vant全局样式
import 'vant/lib/index.css'
import 'amfe-flexible'

Vue.config.productionTip = false
// 注册并使用vant
Vue.use(Vant)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
