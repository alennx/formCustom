<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>流程调用记录</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form ref="formValidate" inline :label-width="110" :model="serverData">
          <FormItem label="衔接名称：">
            <Select v-model="serverData.connectId" class="connecSel">
              <Option value="-1">所有</Option>
              <Option v-for="item in connectList" :value="item.id" :key="item.id">{{ item.connectName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="只看失败：">
            <Checkbox v-model="serverData.failure"></Checkbox>
          </FormItem>
          <FormItem label="调用日期：">
            <DatePicker @on-change="getValidity" type="daterange" v-model="serverData.validity" placement="bottom-end" placeholder="选择有效期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="search">查询</Button>
          </FormItem>
        </Form>
        <hy-table ref="selection" highlight-row border :data="data" :columns="columns" :current="pageOption.pageNo" :total="pageOption.total" :page-size="pageOption.pageSize" @on-change="pageChange" @on-page-size-change="changePageSize" show-sizer show-elevator/>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
export default {
  data () {
    return {
      failure: false, // 只看失败
      serverData: { // 查询参数
        connectId: '-1',
        failure: false, // 只看失败
        validity: []
      },
      columns: [{
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
        key: 'outputInterfaceName'
      },
      {
        title: '输入接口名称',
        key: 'inputInterfaceName'
      },
      {
        title: '调用时间',
        key: 'startTime'
      },
      {
        title: '执行数据条数',
        key: 'userDataNum'
      },
      {
        title: '调用结果',
        key: 'useResult',
        render: (h, params) => {
          return h('span', (params.row.useResult === '1') ? '成功' : '失败')
        }
      },
      {
        title: '失败原因',
        key: 'failReason'
      }
      ],
      data: [],
      connectList: [],
      pageOption: { // 分页参数
        pageNo: 1,
        total: 0,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let date = new Date()
      let today = this.getNowFormatDate(date)
      let thiryDay = this.getNowFormatDate(new Date(date - 1000 * 60 * 60 * 24 * 30))
      this.serverData.validity = [thiryDay, today]
      this.findConnectName()
      this.useRecordPage()
    },
    pageChange (num) { // 页码改变的回调
      this.pageOption.pageNo = num
      this.useRecordPage()
    },
    getValidity (data) {
      this.serverData.validity = data
    },
    changePageSize (num) { // 切换每页条数时的回调
      this.pageOption.pageSize = num
      this.useRecordPage()
    },
    search () { // 查询
      this.pageOption.pageNo = 1
      this.useRecordPage()
    },
    getNowFormatDate (date) {
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    findConnectName () { // 查询衔接名称列表
      const vm = this
      api(processApiList.findConnectName)
        .then(res => {
          if (res.data.errmsg === 'ok') {
            vm.connectList = res.data.data
          }
        }, err => { console.log(err) })
    },
    useRecordPage () { // 流程调用记录分页
      const vm = this
      let timeEnd = vm.getNowFormatDate(new Date(vm.serverData.validity[1])) + ' 00:00:00'
      let timeStart = vm.getNowFormatDate(new Date(vm.serverData.validity[0])) + ' 23:59:59'
      if (!vm.serverData.validity[0]) {
        timeStart = ''
        timeEnd = ''
      }
      let dataDto = {
        'data': {
          'connectId': vm.serverData.connectId !== '-1' ? vm.serverData.connectId : '-1',
          'endTime': timeEnd,
          'startTime': timeStart,
          'useResult': vm.serverData.failure ? 2 : '-1'
        },
        'pageNo': vm.pageOption.pageNo,
        'pageSize': vm.pageOption.pageSize
      }
      api(processApiList.useRecordPage, dataDto)
        .then(res => {
          if (res.data.errmsg === 'ok') {
            vm.data = res.data.data.list
            if (vm.data.length > 0) {
              vm.pageOption.pageSize = res.data.data.pageSize
              vm.pageOption.total = Number(res.data.data.total)
              vm.pageOption.pageNo = res.data.data.pageNum
            };
          } else {
            this.$Message.error({
              content: res.data.errmsg,
              duration: 3
            })
          }
        }, err => { console.log(err) })
    }
  }
}
</script>

<style>

</style>
