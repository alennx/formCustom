<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>表单设计管理</BreadcrumbItem>
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
          <FormItem label="提交状态：">
            <Select class="queryItem" clearable v-model="serverData.status" style="width:140px">
              <Option :value="0">未提交</Option>
              <Option :value="1">已提交</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="search">查询</Button>
            <Button type="primary" @click="addNew">新增</Button>
          </FormItem>
        </Form>
        <hy-table ref="selection" :data="data" :columns="columns" :current="pageOption.pageNo" :total="pageOption.total" :page-size="pageOption.pageSize" @on-change="pageChange" @on-page-size-change="changePageSize" show-sizer show-elevator/>
      </Card>
      <Modal v-model="createModal" title="表单基本信息" width="40%" :mask-closable="false">
        <Form ref="createForm" :model="createForm" :rules="createRule" :label-width="90">
          <FormItem label="表单名称" prop="formName">
            <Input type="text" v-model="createForm.formName"/>
          </FormItem>
          <FormItem label="表单类别" prop="formType">
            <Select class="queryItem" clearable v-model="createForm.formType">
              <Option v-for="item in formTypeArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="有效期" prop="ValidityTime">
            <DatePicker @on-change="getValidity" type="daterange" v-model="createForm.ValidityTime" placement="bottom-end" placeholder="选择有效期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="表单描述" prop="fromDescribe">
            <Input type="textarea" v-model="createForm.fromDescribe"/>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button class="modalBtn" type="primary" @click="saveHostRoom" size="large">下一步</Button>
          <Button class="modalBtn" type="default" @click="createModal = false" size="large">取消</Button>
        </div>
      </Modal>
      <Modal v-model="formModal" title="预览页面" width="60%">
        <preview ref="preview" :parse_form="formDetail"></preview>
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
import preview from '@/view/formCustom/design/preview' // 预览组件
export default {
  data () {
    return {
      serverData: { // 查询参数
        formName: '',
        formType: '',
        status: -1
      },
      createModal: false, // 表单基本信息显隐控制器
      formModal: false, // 表单预览模块显隐控制器
      formDetail: { // 定制表单详情数据
        type: 1
      },
      formItemType: 0, // 0新增和复制，1修改
      leftData: [],
      rightData: {},
      listStyle: {
        width: '42%'
      },
      createForm: { // 表单参数
        formName: '',
        formType: '',
        ValidityTime: '',
        fromDescribe: ''
      },
      formId: '',
      createRule: {
        formName: [{required: true, message: '表单名称不可为空', trigger: 'blur'}],
        ValidityTime: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, cb) => {
            if (this.createForm.ValidityTime.length === 0 || !this.createForm.ValidityTime || !this.createForm.ValidityTime[0]) {
              cb(new Error('有效期不可为空'))
              return
            }
            cb()
          }
        }],
        formType: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, cb) => {
            if (this.createForm.formType === '' || !this.createForm.formType) {
              cb(new Error('表单类别不可为空'))
              return
            }
            cb()
          }
        }]
      },
      formTypeArr: [{name: '申请类', id: '1'}, {name: '审批类', id: '2'}, {name: '查询类', id: '3'}],
      formTypeArr2: ['申请类', '审批类', '查询类'],
      roleColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '角色ID',
          key: 'id'
        },
        {
          title: '角色名称',
          key: 'name'
        }
      ],
      roleData: [
        {
          name: '测试',
          id: 1
        }
      ],
      allocatedColumns: [
        {
          title: '已分配清单',
          align: 'center',
          children: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '角色ID',
              key: 'name'
            },
            {
              title: '角色名称',
              key: 'name'
            }
          ]
        }
      ],
      allocatedData: [
        {
          name: '测试',
          id: 1
        }
      ],
      columns: [{
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
        title: '表单名称',
        key: 'formName'
      },
      {
        title: '表单类型',
        key: 'formType',
        render: (h, params) => {
          return h('span', this.formTypeArr2[parseInt(params.row.formType) - 1])
        }
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
        title: '起始日期',
        key: 'startValidityTime'
      },
      {
        title: '截止日期',
        key: 'endValidityTime'
      },
      // {
      //   title: '授权范围',
      //   key: 'lawDesc'
      // },
      {
        title: '提交状态',
        key: 'status',
        render: (h, params) => {
          return h('span', (params.row.status === '0') ? '未提交' : '已提交')
        }
      },
      {
        title: '创建人',
        key: 'userName'
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
                this.getByFormId(params.row.id, 1)
              }
            }
          }, '预览')
          const edit = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.createForm.resetFields()
                this.getByFormId(params.row.id, 2)
              }
            }
          }, '修改')
          const del = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.deleteForm(params.row.id)
              }
            }
          }, '删除')
          const copy = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.createForm.resetFields()
                this.getByFormId(params.row.id, 3)
              }
            }
          }, '复制')
          const desProcess = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.$router.push({
                  name: 'designProcess',
                  params: params.row
                })
                console.log('设计流程入口')
              }
            }
          }, '设计流程')
          switch (params.row.status) {
            case '0':
              return h('div', [detail, edit, del, copy, desProcess])
            default:
              return h('div', [detail, copy, desProcess])
          }
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
    this.init()
  },
  methods: {
    init () { // 初始化
      this.pageFormMgr()
    },
    pageChange (num) { // 页码改变的回调
      this.pageOption.pageNo = num
      this.pageFormMgr()
    },
    changePageSize (num) { // 切换每页条数时的回调
      this.pageOption.pageSize = num
      this.pageFormMgr()
    },
    search () { // 查询
      this.pageOption.pageNo = 1
      this.pageFormMgr()
    },
    pageFormMgr () { // 列表
      let formdata = {
        data: this.serverData,
        pageNo: this.pageOption.pageNo,
        pageSize: this.pageOption.pageSize
      }
      api(formApiList.pageFormMgr, formdata).then(res => {
        if (res.data.errcode === 0) {
          this.pageOption.total = res.data.data.total
          this.data = res.data.data.list
          this.data.forEach(item => {
            item.startValidityTime = item.startValidityTime.substring(0, 10)
            item.endValidityTime = item.endValidityTime.substring(0, 10)
          })
        }
      }, error => { console.log(error) })
    },
    getByFormId (id, type) { // 1:预览，2：修改，3：复制
      api(formApiList.getByFormId, {id: id}).then(res => {
        if (res.data.errcode === 0) {
          switch (type) {
            case 1:
              this.formDetail = {...this.formDetail, ...res.data.data}
              this.formModal = true
              break
            case 2:
              this.formItemType = 1
              this.createForm = res.data.data
              this.$store.state.parse = res.data.data.originalHtml
              this.createForm.ValidityTime = []
              this.createForm.ValidityTime.push(res.data.data.startValidityTime.substring(0, 10))
              this.createForm.ValidityTime.push(res.data.data.endValidityTime.substring(0, 10))
              this.createModal = true
              break
            case 3:
              this.formItemType = 0
              this.createForm = res.data.data
              this.createForm.ValidityTime = []
              this.createForm.formName = ''
              this.createForm.formType = ''
              this.createForm.fromDescribe = ''
              this.createForm.type = 'copy'
              delete this.createForm.id
              this.createModal = true
              break
          }
        }
      }, error => { console.log(error) })
    },
    deleteForm (id) { // 删除功能
      this.$Modal.confirm({
        title: '提醒',
        content: '您确定删除吗？',
        onOk: () => {
          api(formApiList.deleteForm, {id: id}).then(res => {
            if (res.data.errcode === 0) {
              if (res.data.errmsg === 'ok') {
                this.$Message.success('删除成功！！')
                this.pageFormMgr()
              } else {
                this.$Message.error(res.data.errmsg)
              }
            }
          }, error => { console.log(error) })
        }
      })
    },
    roleSearch () { // 权限查询
      console.log('查询2')
    },
    addNew () { // 新增
      this.createModal = true
      this.$refs.createForm.resetFields()
    },
    getValidity (data) {
      this.createForm.ValidityTime = data
    },
    saveHostRoom () { // 下一步
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          this.createModal = false
          this.$router.push({
            name: 'formDesign',
            params: {formData: this.createForm, type: this.formItemType}
          })
        }
      })
    }
  },
  components: {
    preview
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-table{
  width:auto
}
</style>
