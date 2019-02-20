<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>表单填报管理</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Tabs :animated="false" @on-click="getTabsName">
          <TabPane label="已申请"></TabPane>
          <TabPane label="待填报"></TabPane>
          <TabPane label="已填报"></TabPane>
        </Tabs>
        <Form ref="formValidate" inline :label-width="110" :model="serverData">
          <FormItem label="表单名称：">
             <Input type="text" v-model="serverData.formName" style="width:140px" clearable></Input>
          </FormItem>
          <FormItem label="表单类型：">
            <Select class="queryItem" clearable v-model="serverData.formType" style="width:140px">
              <Option v-for="item in formTypeArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
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
            <Button v-if="newBtn" type="primary" @click="newApply">新增申请</Button>
          </FormItem>
        </Form>
        <hy-table ref="selection" :data="columnsData" :columns="columns" :current="pageOption.pageNo" :total="pageOption.total" :page-size="pageOption.pageSize" @on-change="pageChange" @on-page-size-change="changePageSize" show-sizer show-elevator/>
      </Card>
      <Modal v-model="changeForm" title="选择表单" @on-ok="cancel1"  @on-cancel="cancel1" width="60%">
        <div class="layout" style="overflow-y: auto;">
          <Layout>
            <Sider style="width:20%;min-width:20%;max-width:20%;height:500px;overflow-y: auto;" hide-trigger>
              <Input placeholder="输入关键字进行过滤" v-model="filterTree"/>
              <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                @node-click="nodeClick"
                :filter-node-method="filterNode"
                ref="tree">
              </el-tree>
            </Sider>
            <Layout style="background:#fff;padding:0 20px;height:500px;overflow-y: auto;">
              <Tabs value="form">
                <TabPane label="正文" name="form">
                  <!-- <fillDetail ref="fillDetail" v-if="formDetail.form.id" :formDetail="formDetail"></fillDetail> -->
                  <preview v-if="formDetail.form.id" ref="previewChange" previewId='previewChange' :parse_form="formDetail"></preview>
                  <p v-else style="text-align:center;">暂无内容</p>
                </TabPane>
                <TabPane label="流程" name="flow">
                  <img v-if="flowImg" style="width:100%;" :src="flowImg">
                  <p style="text-align:center;" v-else>暂无内容</p>
                  <!-- <FlowDesign :style="{ height: modalH + 'px' }" ref="flowdesign" :params="params" :percentageType="true"></FlowDesign> -->
                </TabPane>
              </Tabs>
            </Layout>
          </Layout>
        </div>
        <div slot="footer">
          <Button class="modalBtn" v-if="useable && (btnType === 1 || btnType === 2)" type="primary" @click="switchModal" size="large" :disabled="!flowImg">下一步</Button>
          <Button class="modalBtn" type="default" @click="cancel1" size="large">关闭</Button>
        </div>
      </Modal>
      <Modal v-model="formModal" title="填写页面" @on-ok="cancel2"  @on-cancel="cancel2" width="60%">
        <!-- <fillDetail ref="fillDetail" v-if="formDetail.form.id" :formDetail="formDetail"></fillDetail> -->
        <preview previewId='previewForm' ref="preview" :parse_form="formDetail"></preview>
        <div slot="footer">
          <Button class="modalBtn" v-if="btnType === 1 || btnType === 2" type="primary" @click="saveFormFill(0)" size="large">提交</Button>
          <Button class="modalBtn" v-if="btnType === 3" type="primary" @click="saveFormFill(2)" size="large">同意</Button>
          <Button class="modalBtn" v-if="btnType === 3" type="primary" @click="saveFormFill(3)" size="large">拒绝</Button>
          <Button class="modalBtn" type="default" @click="cancel2" size="large">关闭</Button>
        </div>
      </Modal>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
import fillDetail from '@/view/formCustom/design/fillDetail' // 填报详情组件
import preview from '@/view/formCustom/design/preview' // 预览组件
import FlowDesign from './design/FlowDesign' // 流程组件
function getTreeData () { // 新建填报申请左侧菜单一级栏目
  return [{id: 1, label: '申请类', children: []}, {id: 2, label: '审批类', children: []}, {id: 3, label: '查询类', children: []}]
}
export default {
  data () {
    return {
      apiName: formApiList.pageProcessInstance, // 根据tabs切换更新不同的请求地址（已申请，待填报，已填报）
      formModal: false,
      changeForm: false,
      newBtn: true,
      flowImg: '', // 流程图
      modalH: window.innerHeight - 250,
      filterTree: '', // 树形图筛选input
      params: {}, // 流程图传递数据
      tdData: {}, // 列表td数据保存
      treeData: getTreeData(),
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      useable: true, // 判断是否具有新建权限
      formDetail: { // 定制表单预览数据初始化
        form: {},
        result: {},
        fieldAuthList: [],
        taskName: ''
      },
      taskName: '', // 节点名称
      serverData: { // 查询参数
        formName: '',
        formType: '',
        orderStatus: ''
      },
      processId: '', // 流程id
      formId: '', // 表单id
      orderId: '', // 当前发起流程实例id
      recordId: '', // 填报结果记录id
      btnType: 0, // 按钮类型（0查看1新建2修改3填报）
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
        title: '申请人',
        key: 'createUsername'
      },
      {
        title: '申请时间',
        key: 'createTime',
        width: 180
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
        title: '下一环节',
        key: 'displayName',
        render: (h, params) => {
          return h('span', (params.row.displayName) ? params.row.displayName : '已完结')
        }
      },
      {
        title: '操作',
        key: 'act',
        width: 150,
        render: (h, params) => {
          const vm = this
          const allocation = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.btnType = 3
                this.formId = params.row.formId
                this.orderId = params.row.orderId
                this.recordId = params.row.recordId
                this.processId = params.row.processId
                this.taskName = params.row.taskName
                this.tdData = params.row
                this.getFormInfoAndResult(params.row.processId, params.row.formId)
              }
            }
          }, '填报')
          const detail = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.btnType = 0
                this.orderId = params.row.orderId
                this.getFormInfoAndResult(params.row.processId, params.row.formId)
              }
            }
          }, '查看')
          const edit = h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.btnType = 2
                this.formId = params.row.formId
                this.orderId = params.row.orderId
                this.recordId = params.row.recordId
                this.processId = params.row.processId
                this.taskName = params.row.taskName
                this.tdData = params.row
                this.getFormInfoAndResult(params.row.processId, params.row.formId)
              }
            }
          }, '修改')
          switch (vm.apiName) {
            case formApiList.pageProcessInstance:
              if (params.row.orderStatus === '0') {
                return h('div', [edit, detail])
              } else {
                return h('div', [detail])
              }
            case formApiList.pageExecutingTask:
              return h('div', [allocation, detail])
            case formApiList.pageExecutedTaskList:
              return h('div', [detail])
          }
        }
      }
      ],
      columnsData: [],
      pageOption: { // 分页参数
        pageNo: 1,
        total: 0,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.pageFormList(this.apiName)
  },
  methods: {
    getTabsName (name) { // 根据tabs切换名称修改请求地址
      let url = formApiList.pageProcessInstance
      switch (name) {
        case 0:
          url = formApiList.pageProcessInstance
          this.newBtn = true
          break
        case 1:
          url = formApiList.pageExecutingTask
          this.newBtn = false
          break
        case 2:
          url = formApiList.pageExecutedTaskList
          this.newBtn = false
          break
      }
      this.apiName = url
      this.pageFormList()
    },
    filterNode (value, data) { // 树状过滤
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    pageFormList () { // 获取表单列表数据并渲染
      let formdata = {
        data: this.serverData,
        pageNo: this.pageOption.pageNo,
        pageSize: this.pageOption.pageSize
      }
      api(this.apiName, formdata).then(res => {
        if (res.data.errcode === 0) {
          this.columnsData = res.data.data.list
          this.pageOption.total = res.data.data.total
        }
      }, error => { this.$Message.error(error) })
    },
    getFormInfoAndResult (processId, id, type) { // 获取定制表单详情及结果
      api(formApiList.getFormInfoAndResult, {formId: id, orderId: this.orderId}).then(res => {
        if (res.data.errcode === 0) {
          this.formId = id
          if (this.btnType === 0) {
            this.formDetail = res.data.data
            this.formDetail.type = this.btnType
            this.formModal = true
            return
          }
          (this.btnType === 1 || this.btnType === 2) ? this.getTheFirstTaskNameOfProcess(processId, id, type, res.data.data) : this.getFieldAuthList(processId, id, this.tdData.taskName, type, res.data.data)
        }
      }, error => { this.$Message.error(error) })
    },
    getUseableFormList () { // 获取新建填报信息左侧表单流程列表数据
      api(formApiList.getUseableFormList).then(res => {
        if (res.data.errcode === 0) {
          this.treeData.forEach(treeItem => {
            res.data.data.forEach(item => {
              if (treeItem.id === parseInt(item.formType)) {
                treeItem.children.push({
                  id: item.formId,
                  processId: item.processId,
                  label: item.formName
                })
              }
            })
          })
          this.changeForm = true
        } else {
          this.$Message.error(res.data.errmsg)
        }
      }, error => { this.$Message.error(error) })
    },
    getFieldAuthList (processId, formId, taskName, type, formData) { // 获取表单字段权限
      api(formApiList.getFieldAuthList, {processId: processId, formId: formId, taskName: taskName}).then(res => {
        if (res.data.errcode === 0) {
          this.formDetail = formData
          this.formDetail.fieldAuthList = res.data.data
          this.formDetail.taskName = taskName
          if (!type) this.formModal = true
        }
      }, error => { this.$Message.error(error) })
    },
    getTheFirstTaskNameOfProcess (processId, formId, type, formData) { // 获取流程定义第一个节点taskName
      api(formApiList.getTheFirstTaskNameOfProcess, {processId: processId}).then(res => {
        if (res.data.errcode === 0 && res.data.data) {
          this.taskName = res.data.data.taskName
          if (res.data.data.useable === 'true') {
            this.useable = true
            this.getFieldAuthList(processId, formId, res.data.data.taskName, type, formData)
          } else {
            this.useable = false
            this.changeFormInit()
            this.$Message.error('您没有权限发起此表单的流程申请！！')
          }
        } else {
          this.useable = false
          this.changeFormInit()
          this.$Message.error(res.data.errmsg)
        }
      }, error => { this.$Message.error(error) })
    },
    nodeClick (data) { // 左侧节点点击触发
      if (data.id === 1 || data.id === 2 || data.id === 3) {
        return
      }
      this.params = data
      this.getFormInfoAndResult(data.processId, data.id, true)
      this.processId = data.processId
      api(formApiList.getProcessFlowChart, {processId: data.processId}).then(res => { // 获取流程数据
        if (res.data.errcode === 0) {
          if (res.data.data) {
            this.flowImg = res.data.data
          }
        }
      }, error => { this.$Message.error(error) })
    },
    saveFormFill (type) { // 保存填报内容
      let url = (this.btnType === 2) ? formApiList.updateFillResult : formApiList.saveOrUpdateForm
      // const arr = ['执行中', '已同意', '已拒绝']
      for (var i in this.$refs.preview.typeData) {
        if (i.indexOf('datepicker') !== -1) {
          if (this.$refs.preview.typeData[i] !== '') {
            this.$refs.preview.typeData[i] = this.dateFtt('yyyy-MM-dd', this.$refs.preview.typeData[i])
          }
        }
        if (typeof this.$refs.preview.typeData[i] === 'object') {
          this.$refs.preview.typeData[i] = this.$refs.preview.typeData[i].join(',')
        }
      }
      this.$refs.preview.typeData.status = '1' // type.toString() 提交状态0保存，1提交
      this.$refs.preview.typeData.id = this.recordId // 提交id
      let data = {
        formId: this.formId,
        orderStatus: type,
        jsonStr: JSON.stringify(this.$refs.preview.typeData),
        flowDTO: {
          method: 0,
          processId: this.processId,
          orderId: this.tdData.orderId,
          taskId: this.tdData.taskId,
          taskName: this.taskName
        }
      }
      api(url, data).then(res => {
        if (res.data.errcode === 0) {
          if (res.data.errmsg === 'ok') {
            this.$Message.success('保存成功')
            this.pageFormList()
          } else {
            this.$Message.error(res.data.errmsg)
          }
        } else {
          this.$Message.error(res.data.errmsg)
        }
        this.formModal = false
      }, error => { this.$Message.error(error) })
    },
    dateFtt (fmt, date) { // 时间格式化
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    pageChange (num) { // 页码改变的回调
      this.pageOption.pageNo = num
      this.pageFormList()
    },
    changePageSize (num) { // 切换每页条数时的回调
      this.pageOption.pageSize = num
      this.pageFormList()
    },
    search () { // 查询
      this.pageOption.pageNo = 1
      this.pageFormList()
    },
    newApply () { // 新增申请
      this.btnType = 1
      this.tdData = {}
      this.orderId = ''
      this.recordId = ''
      this.taskName = ''
      this.processId = ''
      // this.$refs.previewChange.clear()
      this.getUseableFormList()
      this.changeForm = true
    },
    switchModal () {
      this.changeForm = false
      this.formModal = true
      this.treeData = getTreeData()
      this.flowImg = ''
    },
    cancel1 () {
      this.changeForm = false
      this.treeData = getTreeData()
      this.changeFormInit()
      // this.removeStorage()
    },
    changeFormInit () {
      this.formDetail = {
        form: {},
        result: {},
        fieldAuthList: [],
        taskName: ''
      }
      this.flowImg = ''
    },
    cancel2 () {
      this.formModal = false
      this.formDetail = {
        form: {},
        result: {},
        fieldAuthList: [],
        taskName: ''
      }
      this.flowImg = ''
    },
    removeStorage () {
      localStorage.removeItem('processData')
      localStorage.removeItem('xmlObj')
      localStorage.removeItem('fieldAuthList')
    }
  },
  watch: {
    filterTree (val) {
      this.$refs.tree.filter(val)
    }
  },
  components: {
    fillDetail,
    preview,
    FlowDesign
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-layout{
  display: flex;
}
</style>
