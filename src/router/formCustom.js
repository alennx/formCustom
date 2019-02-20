import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [{ // 首页
    path: '/home',
    name: 'home',
    component: resolve => require(['@/view/formCustom/home'], resolve)
  }, { // 表单设计管理
    path: '/formDesignMgr',
    name: 'formDesignMgr',
    component: resolve => require(['@/view/formCustom/formDesignMgr'], resolve)
  }, { // 表单设计
    path: '/formDesign',
    name: 'formDesign',
    component: resolve => require(['@/view/formCustom/formDesign'], resolve)
  }, { // 表单填报管理
    path: '/formFillMgr',
    name: 'formFillMgr',
    component: resolve => require(['@/view/formCustom/formFillMgr'], resolve)
  }, { // 填报结果管理
    path: '/fillResultMgr',
    name: 'fillResultMgr',
    component: resolve => require(['@/view/formCustom/fillResultMgr'], resolve)
  }, { // 表单填报统计
    path: '/formFillStatic',
    name: 'formFillStatic',
    component: resolve => require(['@/view/formCustom/formFillStatic'], resolve)
  }, { // 表单预览组件界面
    path: '/preview',
    name: 'preview',
    component: resolve => require(['@/view/formCustom/design/preview'], resolve)
  }, { // 表单流程设计界面
    path: '/designProcess',
    name: 'designProcess',
    component: resolve => require(['@/view/formCustom/designProcess'], resolve)
  }, {
    path: '/',
    redirect: '/home'
  }]
})

router.beforeEach((to, from, next) => {
  // window.hy_auth_login() // 登陆验证
  // store.commit('GETUSERINFO') // 设置用户信息
  next()
})

export default router
