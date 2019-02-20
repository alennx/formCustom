<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>流程调用统计</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form ref="formValidate" inline :label-width="110" :model="serverData">
          <FormItem label="衔接名称：">
             <Input type="text" v-model="serverData.name" style="width:140px" clearable></Input>
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
        name: '',
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
        title: '更新方式',
        key: 'updataType'
      },
      {
        title: '更新频率',
        key: 'updateScale'
      },
      {
        title: '输出接口名称',
        key: 'outName'
      },
      {
        title: '输入接口名称',
        key: 'inName'
      },
      {
        title: '调用成功总次数',
        key: 'succeedNum'
      },
      {
        title: '成功更新数据总条',
        key: 'succeedDataNum'
      },
      {
        title: '调用失败总次数',
        key: 'failNum'
      }
      ],
      data: [],
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
      this.findUseInfoList()
    },
    pageChange (num) { // 页码改变的回调
      this.pageOption.pageNo = num
      this.findUseInfoList()
    },
    getValidity (data) {
      this.serverData.validity = data
    },
    changePageSize (num) { // 切换每页条数时的回调
      this.pageOption.pageSize = num
      this.findUseInfoList()
    },
    search () { // 查询
      this.pageOption.pageNo = 1
      this.findUseInfoList()
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
    findUseInfoList () {
      const vm = this
      let timeEnd = vm.getNowFormatDate(new Date(vm.serverData.validity[1])) + ' 00:00:00'
      let timeStart = vm.getNowFormatDate(new Date(vm.serverData.validity[0])) + ' 23:59:59'
      if (!vm.serverData.validity[0]) {
        timeStart = ''
        timeEnd = ''
      }
      let dataDto = {
        'data': {
          'connectName': vm.serverData.name,
          'timeEnd': timeEnd,
          'timeStart': timeStart
        },
        'pageNo': vm.pageOption.pageNo,
        'pageSize': vm.pageOption.pageSize
      }
      api(processApiList.findUseInfoList, dataDto)
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
