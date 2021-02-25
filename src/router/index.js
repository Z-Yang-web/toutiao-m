import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'layout',
  component: () => {
    return import('@/views/layout')
  },
  children: [{
    path: '', // 默认子路由,只能有一个,当访问/的时候,显示home组件
    name: 'home',
    component: () => {
      return import('@/views/home')
    }
  }, {
    path: '/qa',
    name: 'qa',
    component: () => {
      return import('@/views/qa')
    }
  }, {
    path: '/video',
    name: 'video',
    component: () => {
      return import('@/views/video')
    }
  }, {
    path: '/my',
    name: 'my',
    component: () => {
      return import('@/views/my')
    }
  }]
},
{
  path: '/login',
  name: 'login',
  component: () => {
    return import('@/views/login')
  }

}
]

const router = new VueRouter({
  routes
})

export default router
