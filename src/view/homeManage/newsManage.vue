<template>
  <Content>
    <Breadcrumb>
      <BreadcrumbItem>新闻管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <searchCondition ref="condition" @searchClick="preSearch" @create="create" />
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

import searchCondition from './news/searchCondition.vue'
import dealModal from './news/dealModal.vue'
import { handleTypes, newsSources } from './news/constant'

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
            width: 65,
            align: 'center'
          },
          {
            title: '新闻名称',
            key: 'newsTitle'
          },
          {
            title: '显示标志',
            key: 'displaySign',
            align: 'center',
            width: 90,
            render: (h, params) => {
              return h('span', params.row.displaySign === 1 ? '是' : '否')
            }
          },
          {
            title: '新闻类别',
            key: 'newsType',
            align: 'center',
            width: 90
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            width: 180,
            render: (h, params) => {
              if (params.row.createTime) {
                return h('span', params.row.createTime)
              } else {
                return h('span', '—')
              }
            }
          },
          {
            title: '发表日期',
            key: 'publicationTime',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.publicationTime.substring(0, 10))
            }
          },
          {
            title: '获取方式',
            key: 'obtainType',
            align: 'center',
            width: 90,
            render: (h, params) => {
              return h('span', newsSources[params.row.obtainType].label)
            }
          },
          {
            title: '发表人',
            width: 120,
            key: 'postedByName'
          },
          {
            title: '操作',
            align: 'center',
            width: 180,
            render: (h, params) => {
              const { id, obtainType, sourceUrl } = params.row
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
                    // 爬虫
                    if (newsSources[obtainType].value === '1') {
                      window.open(sourceUrl)
                      return
                    }
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
              // 非爬虫
              if (newsSources[obtainType].value !== '1') {
                btns.push(edit)
                btns.push(deleteBtn)
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
    this.search()
  },
  methods: {
    create () {
      this.$refs.dealModal.open(null, handleTypes.create)
    },
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
      api(homeApiList.nmPageList, {
        data,
        ...vm.pageInfo
      }).then(res => {
        if (res.data) {
          const data = res.data.data
          vm.tableList.data = data.list
          vm.pageInfo.pageNo = data.pageNum
          vm.pageInfo.total = data.total
        }
      }, err => { console.log(err) })
    },
    deleteFun (id) {
      const vm = this
      vm.$Modal.confirm({
        title: '删除确认',
        content: '您确定删除选中新闻吗？',
        onOk: () => {
          api(homeApiList.newsDelete, {
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
  },
  beforeRouteLeave (to, from, next) {
    console.log('12121231231321')
    // this.editor.destroy()
    next()
  }
}
</script>
