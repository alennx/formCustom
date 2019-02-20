<template>
  <Content>
    <Breadcrumb>
      <BreadcrumbItem>流程衔接管理</BreadcrumbItem>
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
      <dealModal ref="dealModal" @on-ok="preSearch"/>
    </Card>
  </Content>
</template>

<script>
// import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'

import searchCondition from './process/searchCondition.vue'
import dealModal from './process/dealModal.vue'
import { handleTypes, updateMethods, updateFreq } from './process/constant'
import {mapState} from 'vuex'
export default {
  components: {
    searchCondition,
    // detail,
    dealModal
  },
  computed: {
    ...mapState(['authButton'])
  },
  data () {
    const vm = this
    return {
      hasEditAuthority: false,
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
            title: '衔接名称',
            key: 'connectName'
          },
          {
            title: '输出接口名称',
            key: 'outInteName'
          },
          {
            title: '输入接口名称',
            key: 'inInteName'
          },
          {
            title: '更新方式',
            key: 'updataType',
            render: (h, params) => {
              const method = updateMethods[params.row.updataType]
              return h('span', method ? method.label : '--')
            }
          },
          {
            title: '更新频率',
            key: 'updateScale',
            render: (h, params) => {
              const freq = updateFreq[params.row.updateScale]
              return h('span', freq ? freq.label : '--')
            }
          },
          {
            title: '启用状态',
            key: 'isUse',
            render: (h, params) => {
              return h('span', params.row.isUse === 1 ? '启用' : '禁用')
            }
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              const { id, isUse } = params.row
              const style = {
                marginRight: '5px'
              }
              // 查看
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
              }, '查看')
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
              // 启用
              const open = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                on: {
                  click () {
                    vm.currentInfo = params.row
                    vm.$Modal.confirm({
                      title: '启用提醒',
                      content: '您确认需要启用吗？',
                      onOk: () => {
                        vm.openProcess(id)
                      }
                    })
                  }
                }
              }, '启用')
              // 禁用
              const close = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                on: {
                  click () {
                    vm.currentInfo = params.row
                    vm.$Modal.confirm({
                      title: '禁用提醒',
                      content: '您确认需要禁用吗？',
                      onOk: () => {
                        vm.closeProcess(id)
                      }
                    })
                  }
                }
              }, '禁用')
              const btns = []
              // 已启用
              if (isUse === 1) {
                btns.push(close)
              } else {
                btns.push(open)
              }
              if (vm.hasEditAuthority) {
                btns.push(edit)
              }
              btns.push(info)
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
    const vm = this
    vm.search()
    // this.tableList.data = data
    if (vm.authButton) {
      vm.authButton.map(item => {
        if (item === 'process_connect_edit') {
          vm.hasEditAuthority = true
        }
      })
    }
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
    // 获取所有咨询的列表
    search () {
      const vm = this
      const data = vm.$refs.condition.getCondition()
      api(processApiList.connectPageFind, {
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
    // 启用某个流程
    openProcess (id) {
      const vm = this
      api(processApiList.enableConnect, {
        id,
        isUse: 1
      }).then(res => {
        if (res.data.errcode === 0) {
          vm.$Message.info('启用成功')
          vm.preSearch()
        }
      }, error => { console.log(error) })
    },
    // 禁用某个流程
    closeProcess (id) {
      const vm = this
      api(processApiList.enableConnect, {
        id,
        isUse: 2
      }).then(res => {
        if (res.data.errcode === 0) {
          vm.$Message.info('禁用成功')
          vm.preSearch()
        }
      }, error => { console.log(error) })
    }
  }
}
</script>
