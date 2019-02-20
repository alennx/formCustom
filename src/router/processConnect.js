import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import home from '@/view/processConnect/home'
import processManage from '@/view/processConnect/processManage'
import interfaceManage from '@/view/processConnect/interfaceManage'

Vue.use(Router)

const router = new Router({
  routes: [{ // 首页
    path: '/home',
    name: 'home',
    component: home
  }, { // 流程衔接管理
    path: '/processManage',
    name: 'processManage',
    component: processManage
  }, { // 接口管理
    path: '/interfaceManage',
    name: 'interfaceManage',
    component: interfaceManage
  }, { // 流程调用记录
    path: '/processLogs',
    name: 'processLogs',
    component: resolve => require(['@/view/processConnect/processLogs'], resolve)
  }, { // 流程调用统计
    path: '/processStatics',
    name: 'processStatics',
    component: resolve => require(['@/view/processConnect/processStatics'], resolve)
  }]
})

router.beforeEach((to, from, next) => {
  window.hy_auth_login() // 登陆验证
  store.commit('GETUSERINFO') // 设置用户信息
  next()
})

export default router
