// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './../router/processConnect'
import store from './../store'
import iview from 'iview'
import 'iview/dist/styles/iview.css' // 使用iview样式
import echarts from 'echarts'
import hyTable from '@/components/hengyun/table'
import '@/assets/css/com.less' // 使用全局样式
import ProcessConnect from './ProcessConnect.vue'

Vue.use(iview)
Vue.use(hyTable)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#processConnect',
  router,
  store,
  components: { ProcessConnect },
  template: '<ProcessConnect/>'
})
