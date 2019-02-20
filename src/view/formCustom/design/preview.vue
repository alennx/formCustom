<template>
  <content>
    <Breadcrumb v-if="this.$route.params.parse_form" style="padding:10px">
      <BreadcrumbItem>预览表单</BreadcrumbItem>
      <BreadcrumbItem>如无问题请保存你的设计</BreadcrumbItem>
      <Button style="position: absolute;right: 10px;" @click="goback">返回</Button>
    </Breadcrumb>
    <div :ref="previewId" :id='previewId'></div>
  </content>
</template>

<script>
import Vue from 'vue'
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
var nameReg = /title=['"]?([^'"]*)['"]?/i
var valueReg = /value=['"]?([^'"]*)['"]?/i
export default {
  props: {
    parse_form: {
      type: Object
    },
    previewId: {
      type: String,
      default: 'ces'
    }
  },
  data () {
    return {
      getContent: '',
      getDatePicker: '',
      colgroup: '',
      read: false,
      typeData: {},
      userData: [],
      unitData: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 初始化
      this.getUnit()
      if (this.parse_form.type === 1) {
        this.formView(this.parse_form, 1)
      } else {
        this.formView(JSON.stringify(this.parse_form), 2)
      }
    },
    goback () {
      this.$router.go(-1)
    },
    fieldAuthDeal (fieldAuthList, taskName) { // 表单权限筛选
      let obj = {}
      fieldAuthList.forEach(item => {
        if (item.taskName === taskName) {
          let arr = item.fieldNameList.split(',')
          arr.forEach(element => {
            obj[element] = item.operationType
          })
        }
      })
      return obj
    },
    clear () { // 清空
      this.$refs.previewId.html('')
    },
    formView (forms, types) { // 表单内容处理
      var fieldAuthList = {} // 表单字段权限
      var parseForm = {}
      var temps = '';
      (types === 0) ? this.read = true : this.read = false // 根据类型（0查看）全局只读
      if (types === 1) {
        parseForm = forms
      } else {
        let formData = {};
        (typeof forms === 'string') ? formData = JSON.parse(forms) : formData = forms
        if (formData.taskName) fieldAuthList = this.fieldAuthDeal(formData.fieldAuthList, formData.taskName)
        parseForm = formData.form
        if (formData.result) {
          for (var j in formData.result) {
            if (j.indexOf('f_') !== -1) {
              this.typeData[j] = formData.result[j]
            }
          }
        }
      }
      let data = {} // 变量统计
      parseForm.parse = parseForm.parseHtml // 避免重复调用时候造成的bug
      if (parseForm.parse) {
        let vm = this
        if (parseForm.parse.indexOf('datePicker') !== -1) { // 判断是日期组
          let n = (parseForm.parse.split('datePicker')).length - 1
          for (let i = 0; i < n; i++) {
            if (fieldAuthList['f_datepicker' + (i + 1)] !== 'n') {
              let read = this.read
              if (fieldAuthList['f_datepicker' + (i + 1)] === 'r') {
                read = true
              }
              if (!vm.typeData['f_date' + (i + 1) + 'show']) {
                vm.typeData['f_date' + (i + 1) + 'show'] = true
              }
              if (fieldAuthList['f_date' + (i + 1)] === 'n') {
                vm.typeData['f_date' + (i + 1) + 'show'] = false
              }
              if (!vm.typeData['f_datepicker' + (i + 1)]) {
                vm.typeData['f_datepicker' + (i + 1)] = ''
              }
              parseForm.parse = parseForm.parse.replace(/{- datePicker -}/, '<DatePicker v-if="f_date' + (i + 1) + 'show" v-model="f_datepicker' + (i + 1) + '" format="yyyy-MM-dd" type="date" placeholder="请选择日期" style="width:100%;display:' + ((fieldAuthList['f_datepicker' + (i + 1)] === 'n') ? 'none' : 'block') + '" :disabled="' + (read) + '"></DatePicker>')
            }
          }
        }
        if (parseForm.parse.indexOf('User') !== -1) { // 判断是用户
          vm.typeData['userData'] = vm.userData
          let n = (parseForm.parse.split('User')).length - 1
          // let reg = new RegExp( 'datePicker' , "g" )
          for (let i = 0; i < n; i++) {
            let read = this.read
            if (!vm.typeData['f_user' + (i + 1) + 'show']) {
              vm.typeData['f_user' + (i + 1) + 'show'] = true
            }
            if (!vm.typeData['f_user' + (i + 1)]) {
              vm.typeData['f_user' + (i + 1)] = []
            } else {
              vm.typeData['f_user' + (i + 1)] = vm.typeData['f_user' + (i + 1)].split(',')
            }
            if (fieldAuthList['f_user' + (i + 1)] === 'r') {
              read = true
            }
            if (fieldAuthList['f_user' + (i + 1)] === 'n') {
              vm.typeData['f_user' + (i + 1) + 'show'] = false
            }
            parseForm.parse = parseForm.parse.replace(/{- User -}/, '<Select v-if="f_user' + (i + 1) + 'show" v-model="f_user' + (i + 1) + '" multiple filterable style="width:100%;display:' + ((fieldAuthList['f_user' + (i + 1)] === 'n') ? 'none' : 'block') + '" :disabled="' + (read) + '"> <Option v-for="(item, idx) in userData" :key="idx" :value="item.name" :label="item.name"><span>{{ item.name }}</span><span style="float:right;color:#ccc">{{ item.unit }}</span></Option></Select>')
          }
        }
        if (parseForm.parse.indexOf('Unit') !== -1) { // 判断是单位
          vm.typeData['unitData'] = vm.unitData
          let n = (parseForm.parse.split('Unit')).length - 1
          // let reg = new RegExp( 'datePicker' , "g" )
          for (let i = 0; i < n; i++) {
            let read = this.read
            if (!vm.typeData['f_unit' + (i + 1) + 'show']) {
              vm.typeData['f_unit' + (i + 1) + 'show'] = true
            }
            if (fieldAuthList['f_unit' + (i + 1)] === 'r') {
              read = true
            }
            if (fieldAuthList['f_unit' + (i + 1)] === 'n') {
              vm.typeData['f_unit' + (i + 1) + 'show'] = false
            }
            if (!vm.typeData['f_unit' + (i + 1)]) {
              vm.typeData['f_unit' + (i + 1)] = []
            }
            parseForm.parse = parseForm.parse.replace(/{- Unit -}/, '<Select v-if="f_unit' + (i + 1) + 'show" v-model="f_unit' + (i + 1) + '" multiple filterable style="width:100%;display:' + ((fieldAuthList['f_unit' + (i + 1)] === 'n') ? 'none' : 'block') + '" :disabled="' + (read) + '"><Option v-for="(item, idx) in unitData" :key="idx" :value="item.unit" :label="item.unit"></Option></Select>')
          }
        }
        let allWidth = '100%'
        parseForm.parse = parseForm.parse.replace(/rgba?\(\s?\d+\s?, \s?\d+\s?, \s?\d+\s?\)/g, function () { // 颜色转换
          return vm.fixColor('color', arguments[0])
        })
        // 表单样式处理
        parseForm.parse = parseForm.parse.replace(/click/, '@click') // 预留修改click的准备
        parseForm.parse = parseForm.parse.replace(/<tbody/, '' + vm.colgroup + '<tbody class="ivu-table-tbody"') // 新增colgroup列表显示width
        parseForm.parse = parseForm.parse.replace(/<table/, '<div class="ivu-table-wrapper"><div class="ivu-table ivu-table-default ivu-table-border"><div class="ivu-table-body"><table cellspacing="0" cellpadding="0" border="0" style="width:' + allWidth + ';table-layout: auto;"') // 配置表格前缀样式使之匹配iviewUI库
        parseForm.parse = parseForm.parse.replace(/<\/table>/, '</table></div></div></div>')
        parseForm.parse = parseForm.parse.replace(/firstRow/, 'ivu-table-row')
        // 表单组件iview化替换并根据权限控制
        parseForm.parse = vm.tdAlign(parseForm.parse) // td的居中替换
        parseForm.parse = vm.tdHeight(parseForm.parse) // td的高度替换
        parseForm.parse = vm.inputReplace(parseForm.parse, fieldAuthList) // 输入框替换
        parseForm.parse = vm.textareaReplace(parseForm.parse, fieldAuthList) // 输入框替换
        parseForm.parse = vm.radiosReplace(parseForm.parse, fieldAuthList) // 单选框替换
        parseForm.parse = vm.selectReplace(parseForm.parse, fieldAuthList) // 下拉框替换
        parseForm.parse = vm.checkboxsReplace(parseForm.parse, fieldAuthList) // 多选框替换
        data = vm.typeData
        temps = '<div id="' + vm.previewId + '" style="width:' + allWidth + ';margin: 0 auto;">' + parseForm.parse + '</div>'
        console.log(data)
        console.log(temps)
        var MyComponent = Vue.extend({ // 自定义的内容
          template: temps,
          data () {
            return data
          },
          updated () { // 强制赋值于select
            let selecText = document.getElementsByClassName('ivu-select-selected-value')
            for (let i = 0; i < selecText.length; i++) {
              let test = selecText[i].parentNode.parentNode.firstChild.value
              if (selecText[i].innerHTML.indexOf(test) === -1) {
                selecText[i].innerHTML = test
              }
            }
          },
          methods: {
            getChange (idx, val, name) {
              if (data[name][idx] === val) { // 判断数组里是否有该参数
                data[name].splice(data[name].findIndex(item => item.idx === 8), 1)
              } else {
                data[name].push(val)
              }
            }
          }
        })
        new MyComponent().$mount('#' + vm.previewId)
      }
    },
    getUnit (type) { // 获取单位和用户详情
      api(formApiList.getUnit).then(res => {
        if (res.data.errcode === 0) {
          this.unitCount(res.data.data)
          this.userCount(res.data.data)
        }
      }, error => { console.log(error) })
    },
    userCount (data) { // 用户数组计算
      data.forEach(item => {
        item.emps.forEach(items => {
          let obj = {}
          obj.name = items.name
          obj.unit = item.name
          this.userData.push(obj)
        })
      })
    },
    unitCount (data) { // 单位数组计算
      data.forEach(item => {
        let obj = {}
        obj.unit = item.name
        this.unitData.push(obj)
      })
    },
    tdHeight (parse) { // 高度显示height不起作用
      let tdReg = /<td.*?(?:>|\/>)/gi
      let arr = parse.match(tdReg)
      let styleReg = /style=['"]?([^'"]*)['"]?/i
      let heightReg = /\bheight=['"]?([^'"]*)['"]?\b/i
      if (arr) {
        arr.forEach(item => {
          let heightItem = item.match(heightReg)
          let heightItemStyle = ''
          let newTd = ''
          if (heightItem) {
            if (heightItem.input.indexOf('style') !== -1) {
              heightItemStyle = heightItem.input.match(styleReg)
              this.borderColor = heightItemStyle[1] // 边框颜色
              newTd = heightItem.input.replace(new RegExp(heightItemStyle[1], 'g'), heightItemStyle[1] + ';height:' + heightItem[1] + 'px')
            } else {
              newTd = heightItem.input.replace(/>/, 'style="height:' + heightItem[1] + 'px"')
            }
            parse = parse.replace(new RegExp(heightItem.input, 'g'), newTd)
          }
        })
      }
      return parse
    },
    tdAlign (parse) { // 居中替换显示align不起作用
      let tdReg = /<td.*?(?:>|\/>)/gi
      let arr = parse.match(tdReg)
      let alignReg = /\balign=['"]?([^'"]*)['"]?\b/i
      let styleReg = /style=['"]?([^'"]*)['"]?/i
      if (arr) {
        arr.forEach(item => {
          let alignItem = item.match(alignReg)
          let alignItemStyle = ''
          let newTd = ''
          if (alignItem) {
            if (alignItem.input.indexOf('style') !== -1) {
              alignItemStyle = alignItem.input.match(styleReg)
              this.borderColor = alignItemStyle[1] // 边框颜色
              newTd = alignItem.input.replace(new RegExp(alignItemStyle[1], 'g'), alignItemStyle[1] + ';text-align:' + alignItem[1])
            } else {
              newTd = alignItem.input.replace(/>/, 'style="text-align:' + alignItem[1] + '">')
            }
            parse = parse.replace(new RegExp(alignItem.input, 'g'), newTd)
          }
        })
      }
      return parse
    },
    fixColor (name, value) { // 颜色转换rgba转换16进制
      if (/color/i.test(name) && /rgba?/.test(value)) {
        var array = value.split(',')
        if (array.length > 3) {
          return ''
        }
        value = '#'
        // for (var i = 0, color; color = array[i++];) { // ES6不支持的写法，保留下来后面研究20181016
        for (var i = 0; i < array.length; i++) {
          var color = array[i]
          color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16)
          value += color.length === 1 ? '0' + color : color
        }
        value = value.toUpperCase()
      }
      return value
    },
    conutWidth (parse) {
      let trText = parse.split('</tr>') // 筛选tr列表
      let trReg = /<td.*?(?:>|\/>)/gi
      let num = 0
      let arr = []
      trText.forEach(trs => { // 筛选最多td,排除没有width的tr
        let trsItem = trs.match(trReg)
        if (trsItem) {
          if (num < trsItem.length && JSON.stringify(trsItem).indexOf('colspan') === -1) {
            num = trsItem.length
            arr = trsItem
          }
        }
      })
      let widthReg = /width=['"]?([^'"]*)['"]?/i
      let count = 0
      let colgroup = ''
      if (arr) {
        arr.forEach(item => {
          if (item.indexOf('width') !== -1) {
            colgroup += '<col width="' + parseInt(item.match(widthReg)[1]) + '">'
            count += parseInt(item.match(widthReg)[1])
          }
        })
        this.colgroup = '<colgroup>' + colgroup + '</colgroup>'
        return count
      }
    },
    inputReplace (parse, fieldAuthList) { // 输入框iview组件替换
      let inputReg = /<input.*?(?:>|\/>)/gi
      let arr = parse.match(inputReg)
      if (arr) {
        arr.forEach(item => {
          if (item.indexOf('text') !== -1) {
            let names = item.match(nameReg)
            let read = this.read
            if (!this.typeData['f_' + names[1] + 'show']) {
              this.typeData['f_' + names[1] + 'show'] = true
            }
            if (!this.typeData['f_' + names[1]]) {
              this.typeData['f_' + names[1]] = ''
            }
            if (fieldAuthList['f_' + names[1]] === 'r') {
              read = true
            }
            if (fieldAuthList['f_' + names[1]] === 'n') {
              this.typeData['f_' + names[1] + 'show'] = false
            }
            parse = parse.replace(new RegExp(names.input, 'g'), '<Input v-if="f_' + names[1] + 'show" v-model="f_' + names[1] + '" style="width:100%;" :disabled="' + (read) + '"/>')
          }
        })
      }
      return parse
    },
    textareaReplace (parse, fieldAuthList) { // 文本框iview组件替换
      let inputReg = /<textarea.*?(?:>|\/>)/gi
      let arr = parse.match(inputReg)
      if (arr) {
        arr.forEach(item => {
          if (item.indexOf('textarea') !== -1) {
            let names = item.match(nameReg)
            let read = this.read
            if (!this.typeData['f_' + names[1] + 'show']) {
              this.typeData['f_' + names[1] + 'show'] = true
            }
            if (!this.typeData['f_' + names[1]]) {
              this.typeData['f_' + names[1]] = ''
            }
            if (fieldAuthList['f_' + names[1]] === 'r') {
              read = true
            }
            if (fieldAuthList['f_' + names[1]] === 'n') {
              this.typeData['f_' + names[1] + 'show'] = false
            }
            parse = parse.replace(new RegExp(names.input, 'g'), '<Input type="textarea" v-if="f_' + names[1] + 'show" v-model="f_' + names[1] + '" style="width:100%;" :disabled="' + (read) + '"/>')
          }
        })
      }
      return parse
    },
    radiosReplace (parse, fieldAuthList) { // 单选框iview组件替换
      let radiosReg = /<span plugins="radios".*?(?:>|\/>).*?<\/span>/gi
      let inputReg = /<input.*?(?:>|\/>)/gi
      let arr = parse.match(radiosReg)
      if (arr) {
        arr.forEach((item, idx) => {
          if (item.indexOf('radios') !== -1) {
            let names = item.match(nameReg)
            let read = this.read
            if (!this.typeData['f_' + names[1] + 'show']) {
              this.typeData['f_' + names[1] + 'show'] = true // 显示权限控制
            }
            if (!this.typeData['f_' + names[1]]) {
              this.typeData['f_' + names[1]] = ''
            }
            if (fieldAuthList['f_' + names[1]] === 'r') {
              read = true
            }
            if (fieldAuthList['f_' + names[1]] === 'n') {
              this.typeData['f_' + names[1] + 'show'] = false
            }
            this.typeData[names[1] + 'RadiosItem' + idx] = []
            let arr2 = item.match(inputReg)
            arr2.forEach(items => { // radios列表
              let value = items.match(valueReg)
              this.typeData[names[1] + 'RadiosItem' + idx].push(value[1])
            })
            parse = parse.replace(new RegExp(names.input, 'g'), '<RadioGroup v-if="f_' + names[1] + 'show" v-model="f_' + names[1] + '" style="width:100%;"><Radio v-for="(item, idx) in ' + names[1] + 'RadiosItem' + idx + '" :key="idx" :label="item" :disabled="' + (read) + '"></Radio></RadioGroup>')
          }
        })
      }
      return parse
    },
    selectReplace (parse, fieldAuthList) { // 下拉框iview组件替换
      let selectReg = /<span plugins="select".*?(?:>|\/>).*?<\/span>/gi
      let inputReg = /<option.*?(?:>|\/>)/gi
      let arr = parse.match(selectReg)
      if (arr) {
        arr.forEach((item, idx) => {
          if (item.indexOf('select') !== -1) {
            let names = item.match(nameReg)
            let read = this.read
            if (!this.typeData['f_' + names[1] + 'show']) {
              this.typeData['f_' + names[1] + 'show'] = true // 显示权限控制
            }
            if (!this.typeData['f_' + names[1]]) {
              this.typeData['f_' + names[1]] = ''
            } else {
              this.typeData['f_' + names[1]] = this.typeData['f_' + names[1]].split(',')
            }
            if (fieldAuthList['f_' + names[1]] === 'r') {
              read = true
            }
            if (fieldAuthList['f_' + names[1]] === 'n') {
              this.typeData['f_' + names[1] + 'show'] = false
            }
            this.typeData[names[1] + 'OptionItem' + idx] = []
            let arr2 = item.match(inputReg)
            arr2.forEach((items, idxs) => { // select列表
              let value = items.match(valueReg)
              this.typeData[names[1] + 'OptionItem' + idx].push(value[1])
            })
            parse = parse.replace(new RegExp(names.input, 'g'), '<Select v-if="f_' + names[1] + 'show" v-model="f_' + names[1] + '" style="width:100%;" :disabled="' + (read) + '"><Option v-for="(item, idx) in ' + names[1] + 'OptionItem' + idx + '" :key="idx" :value="item" :lable="item"></Option></Select>')
          }
        })
      }
      return parse
    },
    checkboxsReplace (parse, fieldAuthList) { // 复选框iview组件替换
      let checkboxsReg = /<span plugins="checkboxs".*?(?:>|\/>).*?<\/span>/gi
      let inputReg = /<input.*?(?:>|\/>)/gi
      let arr = parse.match(checkboxsReg)
      if (arr) {
        arr.forEach((item, idx) => {
          if (item.indexOf('checkboxs') !== -1) {
            let names = item.match(nameReg)
            let read = this.read
            if (!this.typeData['f_' + names[1] + 'show']) {
              this.typeData['f_' + names[1] + 'show'] = true
            }
            if (fieldAuthList['f_' + names[1]] === 'r') {
              read = true
            }
            if (fieldAuthList['f_' + names[1]] === 'n') {
              this.typeData['f_' + names[1] + 'show'] = false
            }
            if (!this.typeData['f_' + names[1]]) {
              this.typeData['f_' + names[1]] = []
            } else {
              this.typeData['f_' + names[1]] = this.typeData['f_' + names[1]].split(',')
            }
            this.typeData[names[1] + 'CheckboxItem' + idx] = []
            let arr2 = item.match(inputReg)
            arr2.forEach((items, idxs) => { // select列表
              let value = items.match(valueReg)
              let obj = {}
              obj.name = value[1]
              if (this.typeData['f_' + names[1]].length !== 0) {
                this.typeData['f_' + names[1]].forEach(def => {
                  if (def === value[1]) {
                    this.typeData['f_' + names[1] + 'CheckboxItem' + idxs] = true
                    obj.val = true
                  }
                })
              } else {
                obj.val = false
              }
              this.typeData[names[1] + 'CheckboxItem' + idx].push(obj) // 总数
            })
            parse = parse.replace(new RegExp(names.input, 'g'), '<div style="width:100%;" v-if="f_' + names[1] + 'show"><Checkbox :disabled="' + (read) + '" :value="item.val" v-for="(item, idx) in ' + names[1] + 'CheckboxItem' + idx + '" :key="idx" :label="item.name" @on-change="getChange(idx, item.name, `f_' + names[1] + '`)"><span>{{ item.name }}</span></Checkbox></div>')
            // parse = parse.replace(new RegExp(names.input, 'g'), '<CheckboxGroup v-model=f_' + names[1] + ' style="width:100%" @on-change="getChange"><Checkbox v-for="(item, idx) in ' + names[1] + 'CheckboxItem' + idx + '" :key="idx" :label="idx"><span>{{ item }}</span></Checkbox></CheckboxGroup>')
          }
        })
      }
      return parse
    }
  },
  watch: {
    parse_form (curVal, oldVal) {
      console.log(curVal)
      if (curVal) {
        this.typeData = {} // 清空组建中的data值
        this.formView(curVal, curVal.type) // 清空表单内容并执行渲染新表单
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-table td{
  background-color: #fff;
  transition: background-color .2s ease-in-out;
  padding-left: 10px;
}
/deep/ .ivu-table table{
  border-collapse: collapse;
}
/deep/ .ivu-table td, .ivu-table th{
  min-width: 0;
  height: 48px;
  box-sizing: border-box;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
}
/deep/ .ivu-table-wrapper{
  border:none;
}
/deep/ .ivu-table:after, /deep/.ivu-table:before {
  background:none;
}
/deep/ .ivu-table-border {
  border-right:1px solid #e8eaec;
}
/deep/ .ivu-table-border td {
  padding: 0 10px;
  border:1px solid #e8eaec;
}
/deep/.ivu-select-multiple .ivu-select-input{
  border: none;
  background-color: transparent;
}
</style>
