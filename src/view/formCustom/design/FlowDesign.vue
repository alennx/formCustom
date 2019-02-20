<template>
  <div>
    <!-- <Button class="modalBtn" type="primary" @click="saveFlowForm" size="large">保存</Button> -->
    <div ref='flowdesign_canvas' class="container mini-layout" id="flowdesign_canvas"></div> <!-- 流程设计主体 -->
    <!-- 右键选中流程显示菜单 -->
    <div id="processMenu" style="display:none;">
      <ul>
        <li id="pmAttribute"><i class="icon-cog"></i>&nbsp;<span class="_label">属性</span></li>
        <li id="pmForm"><i class="icon-th"></i>&nbsp;<span class="_label">表单字段</span></li>
        <!-- <li id="pmJudge"><i class="icon-share-alt"></i>&nbsp;<span class="_label">转出条件</span></li>
        <li id="pmSetting"><i class=" icon-wrench"></i>&nbsp;<span class="_label">样式</span></li> -->
        <li id="pmDelete"><i class="icon-trash"></i>&nbsp;<span class="_label">删除</span></li>
      </ul>
    </div>
    <!-- 右键空白处菜单 -->
    <div id="canvasMenu" style="display:none;">
      <ul>
        <li id="cmSave"><i class="icon-ok"></i>&nbsp;<span class="_label">保存设计</span></li>
        <li id="cmAdd"><i class="icon-plus"></i>&nbsp;<span class="_label">添加步骤</span></li>
        <li id="cmRefresh"><i class="icon-refresh"></i>&nbsp;<span class="_label">刷新</span></li>
      </ul>
    </div>
    <Modal v-model="formModal" width='60%' @on-cancel='close'>
      <Tabs v-model="tabsList">
        <TabPane label="常规" name='convention'>
          <convention ref='convention' :formDetail='conventionForm' :tableData='tableData' :types='types' @getFlowType="getFlowType"></convention>
        </TabPane>
        <TabPane v-if="types === 'task'" label="表单" name='form'>
          <formModal ref='formModal' :tableData='tableData'></formModal>
        </TabPane>
        <TabPane v-if="types === 'task'" label="权限" name='permissions'>
          <permissions ref='permissions' :permissionsData='permissionsData' :defaultCheckedKeys='defaultCheckedKeys'  @getData="getData"></permissions>
        </TabPane>
        <!-- <TabPane label="转出条件" name='conditions'>转出条件</TabPane>
        <TabPane label="样式" name='style'>样式</TabPane> -->
      </Tabs>
      <div slot="footer">
        <Button class="modalBtn" type="primary" @click="saveFlowForm" size="large">确定</Button>
        <Button class="modalBtn" type="default" @click="close" size="large">取消</Button>
      </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
      <div>流程工具初始化中</div>
    </Spin>
  </div>
</template>

<script>
/* eslint-disable */
// import '@static/ueditor/formdesign/bootstrap/css/bootstrap.min.css'
import '@static/ueditor/formdesign/jquery-1.7.2.min.js'
import '@static/ueditor/flowdesign/js/jquery-ui-1.9.2-min.js'
import '@static/ueditor/flowdesign/js/jquery.jsPlumb-1.3.16-all-min.js'
// import '@static/ueditor/flowdesign/js/jquery.jsPlumb-1.3.16-all.js'
import '@static/ueditor/flowdesign/js/jquery.contextmenu.r2.js'
import '@static/ueditor/flowdesign/js/flowdesign.v3.js'
import convention from './tabPane/convention'
import formModal from './tabPane/formModal'
import permissions from './tabPane/permissions'
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
import html2canvas from 'html2canvas'
import canvg from 'canvg'

function objModal () {
  return {
    id: '', // 流程节点id
    flow_id: '', // 流程或表单id
    process_name: '新建步骤', // 显示名称
    name: '', // 步骤名称
    permissions: [], // 权限列表
    process_to: '', // 下一个节点
    icon: '', //图标
    style: '', // 样式
    xmlString: '', // xml格式装配
    expr: '', // 判断条件1字符串
    defaultWH: { // 设定的画板宽高
      width: 0,
      height: 0,
      left: 0,
      top: 0
    },
    exprList: { // 判断条件1对象内容
      text: '',
      field: '',
      destination: ''
    },
    type: 'task' // 流程节点类型,默认task正常流程，start开始，end结束，decision判断
  }
}
var canvas
export default {
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    percentageType: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      formModal: false, // 节点参数配置modal
      tabsList: 'convention', // tab标签类型
      activeId: '', // 节点id
      spinShow: false, // 是否显示加载图片
      domId: this.$refs.flowdesign_canvas, // 流程canvas获取
      conventionForm:{ // 常规form
        name: '',
        displayName: '',
        type: 'task',
        expr: '', // 判断条件字符串
        exprList: { // 判断条件对象内容
          text: '',
          field: '',
          destination: ''
        }
      },
      canvasDiv: {
        width: '',
        height: ''
      },
      dataURL: '', // 图片base64
      tableData: [], // 表单参数列表
      permissionsData: [], // 权限名单
      defaultCheckedKeys: [], // 默认权限选择键值
      defaultTableData: [], // 默认表单参数列表
      types: '', // 节点类型判断固定值
      startShow: false, // 是否有开始节点
      endShow: false, // 是否有结束节点
      nodeObj: objModal(), // 节点默认参数配置
      xmlObj: JSON.parse(localStorage.getItem('xmlObj')) || {},
      xmlData: [],
      // params: JSON.parse(localStorage.getItem('params')),
      // processData: this.$store.state.processData // 流程默认显示内容
      processData: {}, // 流程默认显示内容
      fieldAuthList: [], // 表单字段权限
    }
  },
  mounted () {
    this.canvasDiv.width = this.$refs.flowdesign_canvas.offsetWidth
    this.canvasDiv.height = this.$refs.flowdesign_canvas.offsetHeight
    this.spinShow = true
    this.init()
  },
  methods: {
    init () {
      // this.params = JSON.parse(localStorage.getItem('params')) || this.paramsAll 
      if (this.params) {
        let processData = localStorage.getItem('processData')
        let fieldAuthList = localStorage.getItem('fieldAuthList')
        if (!processData) {
          this.getProcessJson() // 获取流程节点及关系信息
        } else {
          this.processData = JSON.parse(processData)
          this.permissionsData = this.processData.permissions
          this.refesh()
          this.spinShow = false
        }
        if (!fieldAuthList) {
          this.getFieldAuthList() // 获取表单字段权限
        } else {
          this.fieldAuthList = JSON.parse(fieldAuthList)
        }
        this.getFormFieldListByFormId() // 获取表单字段列表
      } else {
        this.spinShow = false
      }
    },
    getFieldAuthList () {  // 获取表单字段权限
      api(formApiList.getFieldAuthList, {processId: this.params.processId, formId: this.params.id}).then(res => {
        if (res.data.errcode === 0) {
          if (res.data.data && res.data.data.length !== 0) {
            this.fieldAuthList = res.data.data
            localStorage.setItem('fieldAuthList', JSON.stringify(res.data.data))
          }
        }
      }, error => { this.$Message.error(error) })
    },
    getProcessJson () { // 获取流程定制的JSON文件
      api(formApiList.getProcessJson, {processId: this.params.processId}).then(res => {
        if (res.data.errcode === 0) {
          if (res.data.data) {
            this.processData.list = JSON.parse(res.data.data)
            this.processData.total = JSON.parse(res.data.data).length
            this.xmlData = [] // 初始化
            if (this.processData.list) {
              this.processData.list.forEach(item => {
                this.xmlObj[item.id] = item
              })
            }
            this.permissionsData = this.processData.permissions
            localStorage.setItem('processData', JSON.stringify(this.processData))
            localStorage.setItem('xmlObj', JSON.stringify(this.xmlObj))
          }
          this.refesh()
          this.spinShow = false
        }
      }, error => { this.$Message.error(error) })
    },
    getFormFieldListByFormId () { // 获取默认表单参数列表
      api(formApiList.getFormFieldListByFormId, {formId: this.params.id}).then(res => {
        if (res.data.errcode === 0) {
          if (res.data.data) {
            this.defaultTableData = res.data.data
            // this.tableData.forEach(item => { // 表单权限配置默认值生成
            //   item.checkItem = 'w'
            // })
          }
        }
      }, error => { this.$Message.error(error) })
    },
    getData (data) { // 获取权限数据
      this.permissionsData = data
    },
    getFlowType (type) { // 获取流程类型
      this.types = type
    },
    refesh () { // 界面刷新
      if (canvas && canvas.refresh) {
        canvas.refresh()
      }
      this.refCanvas() // 重定义
    },
    saveFlowForm () { // 保存表单内容
      let conventionData = this.$refs.convention.getForm() // 基础信息及判断条件输入
      let validate = this.formValidate(conventionData)
      // return
      if (validate) { // 常规表单验证
        let processInfo = JSON.parse(canvas.getProcessInfo()) // 获取流程图当前节点信息
        if (!this.xmlObj[this.activeId]) {
          this.xmlObj[this.activeId] = objModal()
        }
        if (this.types === 'task') { // 当节点类型为正常节点时，判断是否输入权限信息
          let permissions = this.$refs.permissions.getForm()
          if (permissions.length === 0) {
            this.$Message.error('权限不能为空！！')
            return
          }
          this.xmlObj[this.activeId].permissions = permissions
        }
        // 深拷贝，避免数据穿插
        this.xmlObj[this.activeId].id = this.activeId
        this.xmlObj[this.activeId].name = conventionData.name
        this.xmlObj[this.activeId].process_name = conventionData.displayName
        this.xmlObj[this.activeId].type = conventionData.type
        this.xmlObj[this.activeId].expr = conventionData.expr
        this.xmlObj[this.activeId].exprList = conventionData.exprList
        this.saveAllFlow() // 流程图信息整理及本地保存
        if (this.types === 'task') this.saveTable() // 正常类型的节点进行表单字段权限数据整理
        this.tableData = []
        this.formModal = false
        // this.$store.state.processData = this.processData
        this.refesh()
      }
    },
    formValidate (data) { // 同步表单验证
      if (!data.name && !data.displayName && !data.type) {
        this.$Message.error('表单验证失败！！')
        return false
      } else {
        if (data.type === 'decision') {
          data.expr = this.judge(data.exprList)
          if (!data.expr) {
            this.$Message.error('判断条件不能为空！！')
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      }
    },
    judge (exprList) { // 判断节点的xml标签和transtion生成
      if (exprList.field && exprList.text && exprList.symbol && exprList.destination) {
        let expr = '#' + exprList.field + ' ' + exprList.symbol + ' \'' + exprList.text + '\' ? \'' + exprList.destination + 'Transition\' : \'' + exprList.other + 'Transition\''
        return expr.replace(/[<>]/g,function(c){return {'<': '&lt;', '>': '&gt;'}[c];}); 
      } else {
        return false
      }
    },
    saveTable () { // 表单字段权限数据整理
      let formDesignData = this.$refs.formModal.getForm() // 表单字段权限设置
      let conventionData = this.$refs.convention.getForm() // 基础信息及判断条件输入
      let arr = []
      let obj = {
        'r': {
          name: [],
          id: []
        },
        'n': {
          name: [],
          id: []
        },
      }
      let numList = this.delFieldArr(this.fieldAuthList, conventionData.name)
      let num = 0
      numList.forEach(item => {
        this.fieldAuthList.splice([item + num], 1)
        num --
      })
      this.tableData.forEach(item => { // 获取本次选择
        switch (formDesignData[item.id]) {
          case 'r':
            obj['r'].name.push(item.fieldName)
            obj['r'].id.push(item.id)
            break;
          case 'n':
            obj['n'].name.push(item.fieldName)
            obj['n'].id.push(item.id)
            break;
        }
      })
      for (var i in obj) {
        if (obj[i].id.length !== 0) {
          let fieldObj = {
            'fieldIdList': obj[i].id.join(','),
            'fieldNameList': obj[i].name.join(','),
            'operationType': i,
            'taskName': conventionData.name
          }
          arr.push(fieldObj)
        }
      }
      this.fieldAuthList = [...this.fieldAuthList, ...arr]
      localStorage.setItem('fieldAuthList', JSON.stringify(this.fieldAuthList))
    },
    delFieldArr (arr, name) { // 信息处理
      let num = []
      arr.forEach((item, index) => {
        if (item.taskName === name) {
          num.push(index)
        }
      })
      return num
    },
    saveAllFlow () { // 流程点保存
      let processInfo = JSON.parse(canvas.getProcessInfo()) //连接信息
      console.log(processInfo)
      for (var i in processInfo) { // 更新全部的position数据值
        if (!this.xmlObj[i]) { // 新增
          this.xmlObj[i] = objModal()
          this.xmlObj[i].id = i
        }
        let xmlNameArr = Object.keys(this.xmlObj)
        xmlNameArr.forEach(item => { // 删除
          if (!processInfo[item]) {
            delete this.xmlObj[item]
          }
        })
        this.xmlObj[i].defaultWH = {
          width: this.canvasDiv.width,
          height: this.canvasDiv.height,
          left: processInfo[i].left,
          top: processInfo[i].top
        }
        this.xmlObj[i].style = 'left:' + processInfo[i].left + 'px;top:' +  processInfo[i].top + 'px'
        if (processInfo[i].process_to.length !== 0) {
          this.xmlObj[i].process_to = Array.from(new Set(processInfo[i].process_to)).join(',')
        }
        this.xmlObj[i].xmlString = this.xmlDeal(this.xmlObj[i])
      }
      this.processData.list = [] // 清空数据
      for (var i in this.xmlObj) {
        this.processData.list.push(this.xmlObj[i])
      }
      this.processData.total = this.processData.list.length
      localStorage.setItem('processData', JSON.stringify(this.processData))
      localStorage.setItem('xmlObj', JSON.stringify(this.xmlObj))
    },
    xmlDeal (basic) { // XML标签封装
      let labelAll = '<' + basic.type // 标签头
      let name = ' name="' + basic.name + '"'
      labelAll += name
      if (basic.type === 'task') {
        let assigneeArr = []
        basic.permissions.forEach(item => {
          assigneeArr.push(item.gxqptEmpId)
        })
        let assignee = ' assignee="' + assigneeArr.join(',') + '"' // 权限字符串标签
        labelAll += assignee
      }
      if (basic.type === 'decision') { // 判断节点标签
        let expr = ' expr="' + basic.expr + '"'
        labelAll += expr
      }
      let displayName = ''
      if (basic.type === 'task') { // 显示名称标签
        displayName = ' displayName="' + basic.process_name + '" taskType="Major" performType="ANY"' 
      } else {
        displayName = ' displayName="' + basic.process_name + '"'
      }
      labelAll += displayName + '>'
      if (basic.process_to) { // 连接线标签
        basic.process_to.split(',').forEach((item, index) => {
          if (this.xmlObj[item]) {
            let transition = ''
            if (basic.type === 'decision') {
              transition = '<transition to="' + this.xmlObj[item].name + '" name="' + this.xmlObj[item].name + 'Transition" />'
            } else {
              transition = '<transition to="' + this.xmlObj[item].name + '" name="' + basic.name + 'Transition' + index + '" />'
            }
            labelAll += transition
          }
        })
      }
      labelAll += '</' + basic.type + '>' // 结束
      return labelAll
    },
    getForm () { // 子组件获取xmlData数据
      this.saveAllFlow()
      this.xmlData.list = this.processData.list
      this.xmlData.fieldAuthList = this.fieldAuthList
      return this.xmlData
    },
    refCanvas () { // 初始化jsPlumb
      const vm = this
      canvas = $("#flowdesign_canvas").Flowdesign({
        "processData": this.processData, // get到的数据或历史记录
        /*画面右键*/
        canvasMenus: {
          cmAdd (t) { // 添加
            var parent = $("#jqContextMenu").parent();
            var mLeft = $("#jqContextMenu").css("left"), mTop = $("#jqContextMenu").css("top");
            var processInfo = JSON.parse(canvas.getProcessInfo());//连接信息
            let arr = []
            for (var i in processInfo) {
              arr.push(i)
            }
            if (parseInt(mLeft) > (parent[0].clientWidth - 100)) {
              mLeft = parseInt(mLeft) - 100 // 减去节点样式宽度
            }
            if (parseInt(mTop) > (parent[0].clientHeight - 100)) {
              mTop = parseInt(mTop) - 30 // 减去节点样式高度
            }
            let data = { // 新建模板
              info: {
                'id': arr.length + 1, // 流程节点id
                'flow_id': vm.params.processId, // 流程或表单id
                'process_name': '新建步骤', // 步骤名称
                'process_to': '', // 下一个节点
                'icon': '', //图标
                'defaultWH': { // 设定的画板宽高
                  'width': vm.canvasDiv.width,
                  'height': vm.canvasDiv.height,
                  'left': parseInt(mLeft),
                  'top': parseInt(mTop)
                },
                'style': 'left:' + parseInt(mLeft) + 'px;top:' + parseInt(mTop) + 'px;color:#0e76a8;' // 样式
              }
            }
            canvas.addProcess(data.info)
          },
          cmSave (t) { // 保存
            vm.saveAllFlow()
          },
          cmRefresh (t) { // 刷新
            location.reload();
          }
        },
        /*步骤右键*/
        processMenus: {
          pmDelete (t) { // 删除
            vm.$Modal.confirm({
              title: '提醒',
              content: '您确定删除步骤吗？',
              onOk: () => {
                var activeId = canvas.getActiveId();//右键当前的ID
                //清除步骤
                canvas.delProcess(activeId);
                //清除连接   暂时先保存设计 + 刷新 完成
                vm.saveAllFlow()
                vm.xmlData.list = vm.processData.list
                vm.xmlData.fieldAuthList = vm.fieldAuthList
                // var processInfo = canvas.getProcessInfo();//连接信息
                // location.reload(); // 页面刷新
              }
            })
          },
          pmAttribute (t) { // 属性
            vm.activeId = canvas.getActiveId();//右键当前的ID
            vm.tabsList = 'convention'
            vm.formModal = true
          },
          pmForm (t) { // 表单
            vm.activeId = canvas.getActiveId();//右键当前的ID
            vm.tabsList = 'form'
            vm.formModal = true
          },
          pmJudge (t) { // 转出条件
            vm.activeId = canvas.getActiveId();//右键当前的ID
          },
          pmSetting (t) { // 设置
            vm.activeId = canvas.getActiveId();//右键当前的ID
          }
        },
        fnRepeat () {
          vm.$Message.warning("步骤连接重复了，请重新连接")
        },
        fnClick () { // 结点触发
          vm.saveAllFlow()
          vm.$refs.convention.clear()
          vm.startShow = false
          vm.endShow = false
          var activeId = canvas.getActiveId(); //当前的ID
          var pmNode = Array.from(new Set(JSON.parse(canvas.getProcessInfo())[activeId].process_to)) // 根据id获取连接节点数据
          if (vm.processData.list) {
            vm.processData.list.forEach(item => { // 每次点击都循环判断数组type中是否包含start或者end
              if (item.type == 'start') vm.startShow = true
              if (item.type == 'end') vm.endShow = true
              vm.xmlObj[item.id] = item
            })
          }
          vm.nodeObj = vm.xmlObj[activeId] || objModal()  // 初始化
          vm.activeId = activeId
          vm.nodeObj.process_to = pmNode.join(','); // 后续决定字符串
          (vm.startShow) ? vm.nodeObj.startShow = true : vm.nodeObj.startShow = false;
          (vm.endShow) ? vm.nodeObj.endShow = true : vm.nodeObj.endShow = false
          vm.tableCopy(vm.defaultTableData)
          vm.conventionCopy(vm.nodeObj)
          vm.permissionsData = vm.nodeObj.permissions
          console.log(vm.conventionForm)
          vm.formModal = true
        },
        fnDbClick () {
          //和 pmAttribute 一样
          var activeId = canvas.getActiveId();//右键当前的ID
          vm.formModal = true
        }
      })
    },
    conventionCopy (nodeObj) { // 流程点基本数据深拷贝
      console.log(nodeObj)
      this.tabsList = 'convention'
      this.conventionForm = JSON.parse(JSON.stringify(nodeObj)) // 这里执行深拷贝，放置数据回显错误
      this.conventionForm.id = this.activeId
      this.conventionForm.displayName = nodeObj.process_name // 表单赋值
      console.log(this.conventionForm)
      this.types = nodeObj.type
    },
    tableCopy (defaultTableData) { // 表单列表深拷贝
      defaultTableData.forEach(item => { // 表单权限配置默认值生成
        item.checkItem = 'w'
        this.fieldAuthList.forEach(ele => {
          if (ele.taskName === this.nodeObj.name) { // 匹配相关流程节点的表单字段配置
            if (ele.fieldNameList.indexOf(item.fieldName) > -1) {
              item.checkItem = ele.operationType
            }
          }
        })
      })
      this.tableData = defaultTableData
    },
    close () { // 关闭
      this.tableData = []
      this.formModal = false
    },
    toImg(data) { // 流程canvas+svg转图片
      const vm = this
      if (typeof html2canvas !== 'undefined') {
        //以下是对svg的处理
        var nodesToRecover = [];
        var nodesToRemove = [];
        var svgElem = $("#flowdesign_canvas").find('svg');//divReport为需要截取成图片的dom的id
        svgElem.each(function (index, node) {
            var parentNode = node.parentNode;
            var svg = node.outerHTML.trim();
            var canvas = document.createElement('canvas');
            canvg(canvas, svg); 
            if (node.style.position) {
                canvas.style.position += node.style.position;
                canvas.style.left += node.style.left;
                canvas.style.top += node.style.top;
            }
            nodesToRecover.push({
                parent: parentNode,
                child: node
            });
            parentNode.removeChild(node);
            nodesToRemove.push({
                parent: parentNode,
                child: canvas
            });
            parentNode.appendChild(canvas);
        });
        html2canvas(vm.$refs.flowdesign_canvas, { scale: 2, logging: false, useCORS: true }).then((canvas) => {
          //返回图片URL，参数：图片格式和清晰度(0-1)
          let dataUrl = canvas.toDataURL("image/png",1)
          this.compress(dataUrl, 2, data)
        });
      }
    },
    compress (base64, bili, data) { // 图片压缩
      //处理缩放，转格式
      let _img = new Image()
      let vm = this
      _img.src = base64
      _img.onload = function() {
        let _canvas = document.createElement("canvas")
        let w = this.width / bili
        let h = this.height / bili
        _canvas.setAttribute("width", w)
        _canvas.setAttribute("height", h)
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h)
        data.flowchart = _canvas.toDataURL("image/png");
        vm.saveFlow(data)
      }
    },
    saveFlow (data) { // 保存流程
      let vm = this
      api(formApiList.saveOrUpdateProcess, data).then(res => {
        if (res.data.errcode === 0) {
          if (res.data.errmsg === 'ok' && res.data.data) {
            vm.$Message.success('保存成功')
            vm.removeStorage()
            vm.$router.go(-1)
          } else {
            vm.$Message.error(res.data.errmsg)
          }
        } else {
          vm.$Message.error(res.data.errmsg)
        }
      }, error => { vm.$Message.error(error) })
    },
    removeStorage () { // 清空本地数据
      localStorage.removeItem('processData')
      localStorage.removeItem('xmlObj')
      localStorage.removeItem('fieldAuthList')
      localStorage.removeItem('params')
    }
  },
  components: {
    convention,
    formModal,
    permissions
  }
}
</script>

<style lang="less">
.mini-layout{
  width:100%;
  height:100%;
  position: relative;
  background: rgb(58, 65, 68) url(../../../assets/img/grid.png) repeat;
}
.process-step{
  position: absolute;
  cursor: move;
  min-width: 100px;
  line-height: 28px;
}
.btn{
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  text-align: center;
  text-shadow: 0 1px 1px rgba(255,255,255,0.75);
  vertical-align: middle;
  cursor: pointer;
  background-color: #f5f5f5;
  background-image: -webkit-gradient(linear,left top, left bottom,from(#fff),to(#e6e6e6));
  background-image: linear-gradient(to bottom,#fff,#e6e6e6);
  background-repeat: repeat-x;
  border: 1px solid #ccc;
  border-color: #e6e6e6 #e6e6e6 #bfbfbf;
  border-color: rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.25);
  border-bottom-color: #b3b3b3;
  border-radius: 4px;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff',endColorstr='#ffe6e6e6',GradientType=0);
  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
  -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05);
}
.btn-small{
  padding: 2px 10px;
  font-size: 11.9px;
  border-radius: 3px;
}
.btn .label{
  position: relative;
  top: -1px;
}
.process-step span{
  cursor: all-scroll;
  position: absolute;
  width: 30%;
  height: 100%;
  left: 0;
}

.badge{
  padding-right: 9px;
  padding-left: 9px;
  border-radius: 9px;
}
.label, .badge{
  display: inline-block;
  padding: 2px 4px;
  font-size: 11.844px;
  font-weight: bold;
  line-height: 14px;
  color: #fff;
  text-shadow: 0 -1px 0 rgba(0,0,0,0.25);
  white-space: nowrap;
  vertical-align: baseline;
  // background-color: #999;
}
// .label-info, .badge-info{
//   background-color: #3a87ad;
// }
// .label-inverse, .badge-inverse{
//   background-color: #333;
// }
</style>
