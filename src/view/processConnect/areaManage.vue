<template>
  <Content>
    <Breadcrumb>
      <BreadcrumbItem>首页区域管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <searchCondition ref="condition" @searchClick="preSearch" />
      <hy-table
        highlight-row
        border
        :current="pageInfo.pageNo"
        :columns="tableList.columns"
        :data="tableList.data"
        :total="Number(pageInfo.total)"
        :pageSize="Number(pageInfo.pageSize)"
        pageType="small"
        show-elevator
        show-sizer
        class="refer-apply"
        @on-page-change="pageChange" />
      <dealModal ref="dealModal" />
    </Card>
  </Content>
</template>

<script>
// import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import homeApiList from '@/api/homeApiList'
import searchCondition from './area/searchCondition.vue'
import dealModal from './area/dealModal.vue'
import { handleTypes } from './area/constant'

const data = [{
  level: 'fsalkdfjkasfd',
  typeName: 'fsalkdfjkasfd',
  title: 'fsalkdfjkasfd',
  appName: 'fsalkdfjkasfd',
  dname: 'fsalkdfjkasfd',
  warntime: 'fsalkdfjkasfd',
  address: 'fsalkdfjkasfd',
  id: 'da'
}]

export default {
  components: {
    searchCondition,
    // detail,
    dealModal
  },
  data () {
    const vm = this
    return {
      showModal: false,
      currentInfo: {},
      isDeal: false,
      tableList: {
        columns: [
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            title: '系统名称',
            key: 'level'
          },
          {
            title: '区域',
            key: 'typeName'
          },
          {
            title: '图标',
            key: 'title'
          },
          {
            title: '名称',
            key: 'appName'
          },
          {
            title: '地址',
            key: 'dname'
          },
          {
            title: '默认标志',
            key: 'warntime'
          },
          {
            title: '操作',
            key: 'address',
            align: 'center',
            render: (h, params) => {
              const { id } = params.row
              const style = {
                marginRight: '5px'
              }
              // 详情
              const info = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                on: {
                  click () {
                    vm.currentInfo = params.row
                    vm.$refs.dealModal.open(id, handleTypes.detail)
                  }
                }
              }, '详情')
              // 修改
              const edit = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                on: {
                  click () {
                    vm.currentInfo = params.row
                    vm.$refs.dealModal.open(id, handleTypes.edit)
                  }
                }
              }, '修改')
              const btns = []
              // if (status == '1' && recType == '1' && whoHandle) {
              //   btns.push(confirm)
              // } else if (recType == '3' && whoHandle){
              //   btns.push(deal)
              // }
              btns.push(info)
              btns.push(edit)
              return h('span', btns)
            }
          }
        ],
        data: []
      },
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    // this.search()
    this.tableList.data = data
  },
  methods: {
    preSearch () {
      this.pageInfo.pageNo = 1
      this.search()
    },
    pageChange (pageNo, pageSize) {
      this.pageInfo.pageNo = pageNo
      this.pageInfo.pageSize = pageSize
      this.search()
    },
    search () {
      const vm = this
      const data = vm.$refs.condition.getCondition()
      api(homeApiList.findWarnList, {
        data,
        ...vm.pageInfo
      }).then(res => {
        if (res.data.errcode === 0) {
          const result = res.data.data
          vm.pageInfo.pageNo = result.pageNum
          vm.pageInfo.total = result.total
          vm.tableList.data = result.list
        }
      }, error => { console.log(error) })
    }
  }
}
</script>
