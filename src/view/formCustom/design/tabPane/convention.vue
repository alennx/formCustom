<template>
  <Card :bordered="false" dis-hover>
    <div>
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120" class="clearfix">
        <Row :gutter="40">
          <Col span="22" v-if="formData.type === 'decision'">
            <FormItem label="判断条件：" prop="expr">
              <Input v-model="formData.exprList.text">
                <Select v-model="formData.exprList.field" slot="prepend" style="width: 80px">
                  <Option v-for="item in tableList" :key="item.value" :value="item.value">{{ item.name }}</Option>
                </Select>
                <Select v-model="formData.exprList.symbol" slot="prepend" style="width: 80px">
                  <Option v-for="item in symbolList" :key="item.value" :value="item.value">{{ item.name }}</Option>
                </Select>
                <Select v-model="formData.exprList.destination" slot="append" style="width: 80px" @on-change="getOther">
                  <Option v-for="item in destinationList" :key="item.value" :value="item.value">{{ item.name }}</Option>
                </Select>
              </Input>
            </FormItem>
          </Col>
          <Col span="22">
            <FormItem label="步骤名称：" prop="name">
              <Input v-model="formData.name"/>
            </FormItem>
          </Col>
          <Col span="22">
            <FormItem label="显示名称：" prop="displayName">
              <Input v-model="formData.displayName"/>
            </FormItem>
          </Col>
          <Col span="22">
            <FormItem label="步骤类别：" prop="type">
              <RadioGroup :value="formData.type" @on-change='changeType'>
                <Radio label="start" v-show='!formData.startShow || types === "start"'>起点步骤</Radio>
                <Radio label="task">正常步骤</Radio>
                <Radio label="decision">判断步骤</Radio>
                <Radio label="end" v-show='!formData.endShow || types === "end"'>终点步骤</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  </Card>
</template>

<script>
const fieldTypeList = {'text': '文本框', 'textarea': '多行文本框', 'radios': '单选框', 'select': '下拉框', 'checkboxs': '多选框', 'datePicker': '时间选择器', 'Unit': '单位组件', 'User': '用户组件'}
const initForm = {
  name: '',
  displayName: '',
  type: '',
  expr: '',
  exprList: {
    text: '',
    field: '',
    symbol: '',
    destination: '',
    other: ''
  },
  startShow: false,
  endShow: false
}
export default {
  props: {
    formDetail: {
      type: Object,
      default () {
        return initForm
      }
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    types: {
      type: String,
      default: ''
    },
    disab: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const rep = /^[a-zA-Z][a-zA-Z0-9]*$/
    return {
      xmlObj: JSON.parse(localStorage.getItem('xmlObj')) || {},
      formData: {},
      symbolList: [
        {name: '大于', value: '> '},
        {name: '大于等于', value: '>= '},
        {name: '等于', value: '== '},
        {name: '小于等于', value: '<= '},
        {name: '小于', value: '< '}
      ],
      tableList: [],
      destinationList: [],
      ruleValidate: {
        name: [
          { required: true, message: '步骤名称不能为空！', trigger: 'blur' },
          {validator: (rule, value, cb) => {
            if (!rep.test(this.formData.name)) {
              cb(new Error('步骤名称格式错误！只能输入首字母为英文字母的英文数字组合！'))
              return
            }
            if (this.getNameList(this.formData.name)) {
              cb(new Error('步骤名称不能重复，请重新填写！'))
              return
            }
            cb()
          }}
        ],
        displayName: [
          { required: true, message: '显示名称不能为空！', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空！', trigger: 'change' }
        ],
        expr: [
          { required: true, message: '判断条件不能为空！', trigger: 'blur' },
          {validator: (rule, value, cb) => {
            if (!this.formData.exprList.field) {
              cb(new Error('请选择需要判断的字段名！！'))
              return
            }
            if (!this.formData.exprList.text) {
              cb(new Error('请填写判断公式！！'))
              return
            }
            if (!this.formData.exprList.destination) {
              cb(new Error('请在流程设计图上对判断节点进行连线选择！！'))
              return
            }
            cb()
          }}
        ]
      }
    }
  },
  mounted () {
    this.formData = JSON.parse(JSON.stringify(this.formDetail))
  },
  methods: {
    clear () {
      console.log(this.$refs.formData)
      this.$refs.formData.resetFields()
      console.log(this.formData)
    },
    getOther (val) {
      this.destinationList.forEach(item => {
        if (item.value !== val) {
          this.formData.exprList.other = item.value
        }
      })
    },
    changeType (val) {
      this.destinationList = []
      this.xmlObj = JSON.parse(localStorage.getItem('xmlObj')) || {}
      this.formData.type = val
      this.$emit('getFlowType', val)
      if (val === 'decision') {
        let arr = this.formData.process_to.split(',')
        if (arr.length !== 2) {
          this.$Message.error('判断节点的连接点必须为2条，请在流程设计图上重画后再设定判断条件！！')
        } else {
          arr.forEach(item => {
            this.destinationList.push({name: this.xmlObj[item].process_name, value: this.xmlObj[item].name})
          })
        }
      }
    },
    getForm () {
      return this.formData
    },
    getNameList (name) {
      let xmlObj = JSON.parse(localStorage.getItem('xmlObj')) || null
      if (xmlObj && xmlObj[this.formData.id] && xmlObj[this.formData.id].name !== name) { // 验证名字和id是否对应
        for (var i in xmlObj) {
          if (xmlObj[i].name === name) { // 判断是否name重复
            return true
          }
        }
      }
      return false
    }
  },
  components: {},
  watch: {
    tableData: { // 监听表单类型为判断情况下的表单字段列表内容
      handler (newValue, oldValue) {
        if (oldValue !== newValue) {
          this.tableList = []
          newValue.forEach(item => {
            this.tableList.push({name: fieldTypeList[item.fieldPlugins] + '(' + item.fieldName + ')', value: item.fieldName})
          })
        }
      },
      deep: true
    },
    formDetail: { // 监听表单内部数据
      handler (newValue, oldValue) {
        if (oldValue !== newValue) {
          this.xmlObj = JSON.parse(localStorage.getItem('xmlObj')) || {}
          this.formData = JSON.parse(JSON.stringify(this.formDetail))
          if (newValue.type === 'decision') {
            this.destinationList = []
            let arr = newValue.process_to.split(',')
            arr.forEach(item => {
              this.destinationList.push({name: this.xmlObj[item].process_name, value: this.xmlObj[item].name})
            })
          }
        }
      },
      deep: false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ input[type="text"]{
  height:32px;
}
</style>
