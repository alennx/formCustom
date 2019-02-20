<template>
    <Layout>
        <Row class="main-content">
            <Col span="22">
              <Breadcrumb>
                <BreadcrumbItem>流程设计</BreadcrumbItem>
                <BreadcrumbItem>{{ title }}</BreadcrumbItem>
              </Breadcrumb>
              <Card>
                <Form style="margin:0;" ref="formValidate" inline :label-width="110">
                  <FormItem :label-width="20">
                    <Button type="primary" @click="goback(-1)">上一步</Button>
                    <Button type="primary" @click="save">保存</Button>
                    <Button type="primary" @click="goback">取消</Button>
                  </FormItem>
                </Form>
                <FlowDesign v-if="params.id" :style="{ height: modalH + 'px' }" ref="flowdesign" :params="params"></FlowDesign>
              </Card>
            </Col>
        </Row>
    </Layout>
</template>

<script>
import FlowDesign from './design/FlowDesign'
// import api from '@/api/axiosApi'
// import formApiList from '@/api/formApiList'
export default {
  data () {
    return {
      title: '表单name',
      modalH: window.innerHeight - 250, // 流程画板高度定义
      params: this.$route.params,
      getData: []
    }
  },
  beforeRouteLeave (to, from, next) { // 清空本地数据
    if (from.name === 'designProcess') {
      this.removeStorage()
    }
    next()
  },
  mounted () {
    if (JSON.stringify(this.params) === '{}') {
      this.params = JSON.parse(localStorage.getItem('params'))
      this.title = this.params.formName
    }
    if (this.$route.params.id) {
      this.title = this.$route.params.formName
      localStorage.setItem('params', JSON.stringify(this.$route.params)) // 因为刷新原因，传递的数据暂时保存localStorage
      // location.reload()
    }
  },
  methods: {
    goback (n) {
      this.removeStorage()
      if (n === -1) {
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'formDesignMgr'
        })
      }
    },
    save () { // 保存流程事件
      const vm = this
      vm.getData = vm.$refs.flowdesign.getForm()
      let processJson = vm.xmlData(vm.getData.list)
      let data = {
        'fieldAuthList': vm.getData.fieldAuthList,
        'formId': vm.params.id,
        'flowchart': '',
        'processId': vm.params.processId,
        'processJson': JSON.stringify(vm.getData.list),
        'processXML': processJson
      }
      if (this.validation(data)) vm.$refs.flowdesign.toImg(data)
    },
    validation (data) { // 数据校验
      if (data.processXML.indexOf('</start>') === -1) {
        this.$Message.error('流程必须有一个开始节点')
        return false
      }
      if (data.processXML.indexOf('</end>') === -1) {
        this.$Message.error('流程必须有一个结束节点')
        return false
      }
      for (var i = 0; i < JSON.parse(data.processJson).length; i++) {
        let item = JSON.parse(data.processJson)[i]
        if (item.type === 'start') {
          if (item.process_to.indexOf(',') > -1) {
            this.$Message.error('开始节点后不允许有两个流程节点，请重新设计后提交！')
            return false
          }
        }
      }
      return true
    },
    xmlData (data) { // XML数据顶部和底部封装
      let string = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><process name="leave" displayName="LeaveFlow">'
      data.forEach(item => {
        string += item.xmlString
      })
      string += '</process>'
      return string
    },
    removeStorage () { // 清空数据
      localStorage.removeItem('processData')
      localStorage.removeItem('xmlObj')
      localStorage.removeItem('fieldAuthList')
      localStorage.removeItem('params')
    }
  },
  components: {
    FlowDesign
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-layout{
  background: #fff
}
.spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
