<template>
  <Content>
    <Breadcrumb>
      <BreadcrumbItem>接口管理</BreadcrumbItem>
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
      <dealModal ref="dealModal" @on-ok="preSearch" />
    </Card>
  </Content>
</template>

<script>
// import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
import searchCondition from './interface/searchCondition.vue'
import dealModal from './interface/dealModal.vue'
import { handleTypes } from './interface/constant'

export default {
  components: {
    searchCondition,
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
            title: '接口名称',
            key: 'inteName'
          },
          {
            title: 'API描述',
            key: 'inteDesc'
          },
          {
            title: '所属系统',
            key: 'appName'
          },
          {
            title: '接口地址',
            key: 'inteUrl'
          },
          {
            title: '接口类型',
            key: 'inteType',
            render: (h, params) => {
              const freq = params.row.inteType
              return h('span', freq === 1 ? '输入' : '输出')
            }
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          /* {
            title: '标准格式',
            key: 'inteFormat'
          }, */
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              const { id, connectNum } = params.row
              const style = {
                marginRight: '5px'
              }
              // 删除
              const remove = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                on: {
                  click () {
                    vm.currentInfo = params.row
                    vm.$Modal.confirm({
                      title: '提醒',
                      content: '您确认需要删除吗？',
                      onOk: () => {
                        vm.removeProcess(id)
                      }
                    })
                  }
                }
              }, '删除')
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
                    vm.$refs.dealModal.open(id, handleTypes.edit, params.row)
                  }
                }
              }, '修改')
              const btns = []
              if (connectNum <= 0) {
                btns.push(remove)
              }
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
    this.search()
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
      api(processApiList.getInterfacePage, {
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
    },
    // 删除
    removeProcess (id) {
      const vm = this
      api(processApiList.interfaceDeleteById, {
        id
      }).then(res => {
        if (res.data.errcode === 0) {
          vm.preSearch()
        }
      }, error => { console.log(error) })
    }
  }
}
</script>
