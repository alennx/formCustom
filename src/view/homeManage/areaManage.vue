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
      <dealModal ref="dealModal" @on-ok="preSearch" />
    </Card>
  </Content>
</template>

<script>
// import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import homeApiList from '@/api/homeApiList'
import searchCondition from './area/searchCondition.vue'
import dealModal from './area/dealModal.vue'
import { handleTypes, areaList } from './area/constant'

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
            key: 'systemName',
            width: 160
          },
          {
            title: '区域',
            key: 'region',
            width: 160,
            render: (h, params) => {
              return h('span', areaList[params.row.region].label)
            }
          },
          {
            title: '图标',
            key: 'iconImage',
            width: 100,
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.iconImage,
                  width: '60px'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    window.open(params.row.iconImage)
                  }
                }
              })
            }
          },
          {
            title: '名称',
            key: 'iconName'
          },
          {
            title: '地址',
            key: 'iconLinkAddress'
          },
          {
            title: '默认标志',
            key: 'defaultFlag',
            width: 120,
            render: (h, params) => {
              return h('span', params.row.defaultFlag ? '是' : '否')
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 180,
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
              // 删除
              const deleteBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style,
                on: {
                  click () {
                    const id = params.row.id
                    vm.deleteFun(id)
                  }
                }
              }, '删除')
              const btns = []
              // if (status == '1' && recType == '1' && whoHandle) {
              //   btns.push(confirm)
              // } else if (recType == '3' && whoHandle){
              //   btns.push(deal)
              // }
              btns.push(info)
              btns.push(edit)
              btns.push(deleteBtn)
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
      api(homeApiList.regionManagementNmPageList, {
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
    deleteFun (id) {
      const vm = this
      vm.$Modal.confirm({
        title: '删除确认',
        content: '您确定删除选中项吗？',
        onOk: () => {
          api(homeApiList.regionManagementDelete, {
            id
          }).then(res => {
            if (res.data.errcode === 0) {
              vm.search()
              vm.$Message.success('删除成功！')
            } else {
              vm.$Message.error(res.errmsg)
            }
          }, err => { console.log(err) })
        }
      })
    }
  }
}
</script>
