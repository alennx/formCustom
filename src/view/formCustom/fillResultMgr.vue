<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>填报结果管理</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form ref="formValidate" inline :label-width="110" :model="serverData">
          <FormItem label="表单类别：">
            <Select class="queryItem" clearable v-model="serverData.formType" style="width:140px">
              <Option v-for="item in formTypeArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="发起人：">
            <Input type="text" v-model="serverData.originator" style="width:140px" clearable></Input>
          </FormItem>
          <FormItem label="流程状态：">
            <Select class="queryItem" clearable v-model="serverData.orderStatus" style="width:140px">
              <Option :value="0">申请中</Option>
              <Option :value="1">处理中</Option>
              <Option :value="2">已同意</Option>
              <Option :value="3">已拒绝</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="search">查询</Button>
          </FormItem>
        </Form>
        <hy-table ref="selection" :data="data" :columns="columns" :current="pageOption.pageNo" :total="pageOption.total" :page-size="pageOption.pageSize" @on-change="pageChange" @on-page-size-change="changePageSize" show-sizer show-elevator/>
      </Card>
      <Modal v-model="formModal" title="填报结果" @on-ok="cancel"  @on-cancel="cancel" width="60%">
        <!-- <fillDetail ref="fillDetail" v-if="formDetail.form.id" :formDetail="formDetail.form"></fillDetail> -->
        <preview previewId='previewForm' ref="preview" :parse_form="formDetail"></preview>
        <div slot="footer">
          <Button class="modalBtn" type="default" @click="formModal = false" size="large">关闭</Button>
        </div>
      </Modal>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
import fillDetail from '@/view/formCustom/design/fillDetail'
import preview from '@/view/formCustom/design/preview'
export default {
  data () {
    return {
      formModal: false, // 填报结果模块控制
      formDetail: { // 定制表单数据初始化
        form: {},
        result: {},
        fieldAuthList: [],
        taskName: ''
      },
      serverData: { // 查询参数
        formId: '',
        formName: '',
        formType: '',
        originator: '',
        processId: '',
        orderStatus: ''
      },
      formId: '', // 定制表单id
      formTypeArr: [{name: '申请类', id: '1'}, {name: '审批类', id: '2'}, {name: '查询类', id: '3'}], // 表单类型名称和id的字典
      formTypeArr2: ['申请类', '审批类', '查询类'],
      columns: [{ // 表格表头内容
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
        title: '发起人',
        key: 'createUsername'
      },
      {
        title: '填写时间',
        key: 'createTime'
      },
      {
        title: '流程状态',
        key: 'orderStatus',
        render: (h, params) => {
          let arr = ['申请中', '处理中', '已同意', '已拒绝']
          return h('span', arr[parseInt(params.row.orderStatus)])
        }
      },
      {
        title: '操作',
        key: 'act',
        width: 300,
        render: (h, params) => {
          const detail = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                console.log(params.row)
                this.getFormInfoAndResult(params.row)
              }
            }
          }, '查看')
          return h('div', [detail])
        }
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
    this.findPage()
  },
  methods: {
    findPage () { // 列表查询及渲染
      let formdata = {
        data: this.serverData,
        pageNo: this.pageOption.pageNo,
        pageSize: this.pageOption.pageSize
      }
      api(formApiList.findPage, formdata).then(res => {
        if (res.data.errcode === 0) {
          this.data = res.data.data.list
          this.pageOption.total = res.data.data.total
        } else {
          this.$Message.error(res.data.errmsg)
        }
      }, error => { console.log(error) })
    },
    getFormInfoAndResult (params) { // 获取定制表单详情及结果返回
      api(formApiList.getFormInfoAndResult, {formId: params.formId, orderId: params.orderId}).then(res => {
        if (res.data.errcode === 0) {
          this.formId = params.formId
          this.getFieldAuthList(params, res.data.data)
        }
      }, error => { this.$Message.error(error) })
    },
    getFieldAuthList (params, formData) { // 获取表单字段权限
      api(formApiList.getFieldAuthList, {processId: params.processId, formId: params.formId, taskName: params.taskName}).then(res => {
        if (res.data.errcode === 0) {
          this.formDetail = formData
          this.formDetail.fieldAuthList = res.data.data
          this.formDetail.taskName = params.taskName
          this.formModal = true
        }
      }, error => { this.$Message.error(error) })
    },
    pageChange (num) { // 页码改变的回调
      this.pageOption.pageNo = num
      this.findPage()
    },
    changePageSize (num) { // 切换每页条数时的回调
      this.pageOption.pageSize = num
      this.findPage()
    },
    search () { // 查询
      this.pageOption.pageNo = 1
      this.findPage()
    },
    cancel () { // 关闭
      this.formModal = false
    }
  },
  components: {
    fillDetail,
    preview
  }
}
</script>

<style>

</style>
