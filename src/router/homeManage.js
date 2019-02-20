import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import home from '@/view/homeManage/home'
import newsManage from '@/view/homeManage/newsManage'
import areaManage from '@/view/homeManage/areaManage'

Vue.use(Router)

const router = new Router({
  routes: [{ // 首页
    path: '/home',
    name: 'home',
    component: home
  }, { // 新闻管理
    path: '/newsManage',
    name: 'newsManage',
    component: newsManage
  }, { // 首页区域管理
    path: '/areaManage',
    name: 'areaManage',
    component: areaManage
  }]
})

router.beforeEach((to, from, next) => {
  window.hy_auth_login() // 登陆验证
  store.commit('GETUSERINFO') // 设置用户信息
  next()
})

export default router
