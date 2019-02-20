<template>
  <Layout>
    <hengyun-header :title="{chinese: '表单定制系统', english: 'Form Custom'}" />
    <Layout class="ivu-layout-has-sider" v-if="menus.length > 0">
      <hengyun-sidebar :menus="menus"/>
      <router-view></router-view>
    </Layout>
  </Layout>
</template>
<script>
import api from '@/api/axiosApi'
import apiList from '@/api/comApiList'
import {mapState} from 'vuex'
// 头部
import header from '@/components/hengyun/header'
// 侧边栏
import siderBar from '@/components/hengyun/sideBar'

const menus = [
  {
    name: '首页',
    link: '/home',
    icon: 'icon-home'
  },
  {
    name: '表单设计管理',
    link: '/formDesignMgr',
    icon: 'icon-home'
  },
  {
    name: '表单填报管理',
    link: '/formFillMgr',
    icon: 'icon-home'
  },
  {
    name: '填报结果管理',
    link: '/fillResultMgr',
    icon: 'icon-home'
  },
  {
    name: '表单填报统计',
    link: '/formFillStatic',
    icon: 'icon-home'
  }
]

export default {
  components: {
    'hengyun-sidebar': siderBar,
    'hengyun-header': header
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isCollapsed: false,
      isRouterAlive: true,
      menus: menus
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    ...mapState(['userInfo'])
  },
  mounted () {
    this.$store.dispatch('getAuthButton')
    // this.getOperateMenu()
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    getOperateMenu () {
      const vm = this
      function buildMenu (data) {
        let arr = []
        data.forEach((item, index) => {
          var obj = {
            name: item.name,
            link: item.url,
            icon: item.icon,
            subMenu: item.children ? buildMenu(item.children) : null
          }
          arr.push(obj)
        })
        return arr
      }
      api(apiList.getOperateMenu, {
        userId: vm.userInfo.userId,
        group: ''
      }).then((res) => {
        if (res.status === 200) {
          vm.menus = buildMenu(res.data.data)
          // if (vm.menus.length > 0) {
          //   var obj = {}
          //   if (vm.menus[0].subMenu && vm.menus[0].subMenu.length) {
          //     obj = vm.menus[0].subMenu[0]
          //   } else {
          //     obj = vm.menus[0]
          //   }
          //   console.log('跳转')
          //   // 自动跳到一级菜单的一级目录
          //   vm.$router.push({
          //     path: obj.link
          //   })
          // }
        }
      })
    },
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    }
  }
}
</script>
