<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>表单填报统计</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form ref="formValidate" inline :label-width="110" :model="serverData">
          <FormItem label="表单名称：">
             <Input type="text" v-model="serverData.formName" style="width:140px" clearable></Input>
          </FormItem>
          <FormItem label="表单类型：">
            <Select class="queryItem" clearable v-model="serverData.formType" style="width:140px">
              <Option v-for="item in formTypeArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="search">查询</Button>
          </FormItem>
        </Form>
        <hy-table ref="selection" :data="data" :columns="columns" :current="pageOption.pageNo" :total="pageOption.total" :page-size="pageOption.pageSize" @on-change="pageChange" @on-page-size-change="changePageSize" show-sizer show-elevator/>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
export default {
  data () {
    return {
      serverData: { // 查询参数
        formName: '',
        formType: ''
      },
      formTypeArr: [{name: '申请类', id: '1'}, {name: '审批类', id: '2'}, {name: '查询类', id: '3'}],
      formTypeArr2: ['申请类', '审批类', '查询类'],
      columns: [{
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
        title: '表单类别',
        key: 'formType',
        render: (h, params) => {
          return h('span', this.formTypeArr2[parseInt(params.row.formType) - 1])
        }
      },
      {
        title: '表单名称',
        key: 'formName'
      },
      {
        title: '所属单位',
        key: 'unitName'
      },
      {
        title: '字段数',
        key: 'fieldSum'
      },
      {
        title: '本月填报次数',
        key: 'monThNum'
      },
      {
        title: '填报总次数',
        key: 'totalNum'
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
    this.formStaticsInfo()
  },
  methods: {
    formStaticsInfo () {
      let formdata = {
        data: this.serverData,
        pageNo: this.pageOption.pageNo,
        pageSize: this.pageOption.pageSize
      }
      api(formApiList.formStaticsInfo, formdata).then(res => {
        if (res.data.errcode === 0) {
          this.data = res.data.data.list
          this.pageOption.total = res.data.data.total
        }
      }, error => { console.log(error) })
    },
    pageChange (num) { // 页码改变的回调
      this.pageOption.pageNo = num
      this.formStaticsInfo()
    },
    changePageSize (num) { // 切换每页条数时的回调
      this.pageOption.pageSize = num
      this.formStaticsInfo()
    },
    search () { // 查询
      this.pageOption.pageNo = 1
      this.formStaticsInfo()
    }
  }
}
</script>

<style>

</style>
