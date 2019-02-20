<!-- 新增详情等的弹窗 -->
<template>
  <div>
    <Modal
      v-model="showModal"
      :title="modalTitle"
      width="600px"
      :mask-closable="false">
      <template v-if="currentStep === 1 || currentStep === 3">
        <Form ref="form1" :model="form1" :rules="validate1" :label-width="90" key="form1">
          <FormItem label="衔接名称" prop="connectName" required>
            <Input
              v-model="form1.connectName"
              type="text"
              :disabled="currentStep === 3"/>
          </FormItem>
          <FormItem label="衔接编号" prop="connectCode" required>
            <Input
              v-model="form1.connectCode"
              type="text"
              disabled/>
          </FormItem>
          <FormItem label="输入方式" prop="inType" required>
            <Select v-model="form1.inType" :disabled="currentStep === 3">
              <Option
                :value="item.value"
                v-for="item in inputMode"
                :key="item.value"
                v-if="item.value != ''">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="输入接口" prop="inInte" required>
            <div class="ivu-form-item-content" @click="showTreeModal('1')">
              <div class="ivu-input-wrapper ivu-input-type">
                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                <div class="ivu-input" :class="{'div-disabled': currentStep === 3}" style="line-height: 22px;">{{form1.inInteName}}</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="输出方式" prop="outType" required>
            <Select v-model="form1.outType" :disabled="currentStep === 3">
              <Option
                :value="item.value"
                v-for="item in outputMode"
                :key="item.value"
                v-if="item.value != ''">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="输出接口" prop="outInte" required>
            <div class="ivu-form-item-content" @click="showTreeModal('2')">
              <div class="ivu-input-wrapper ivu-input-type">
                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                <div class="ivu-input" :class="{'div-disabled': currentStep === 3}" style="line-height: 22px;">{{form1.outInteName}}</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="更新方式" prop="updataType" required>
            <Select v-model="form1.updataType" :disabled="currentStep === 3">
              <Option
                :value="item.value"
                v-for="item in updateMode"
                :key="item.value"
                v-if="item.value != '-1'">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="更新频率" prop="updateScale" required>
            <Select v-model="form1.updateScale" :disabled="currentStep === 3">
              <Option
                :value="item.value"
                v-for="item in updateFrequence"
                :key="item.value"
                v-if="item.value != '-1'">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注">
            <Input
              v-model="form1.connectDesc"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 4}"
              placeholder="请输入确认信息..."
              :disabled="currentStep === 3"/>
            </Input>
          </FormItem>
        </Form>
      </template>
      <template v-if="currentStep === 2">
        <Table
          border
          ref="fieldTable"
          :columns="tableData.columns"
          :data="tableData.data"
          @on-selection-change="tableSelect"></Table>
      </template>
      <template v-if="currentStep === 3">
        <Table
          border
          :columns="tableData.columns1"
          :data="tableData.data1"></Table>
      </template>
      <div slot="footer">
        <Button class="modalBtn" type="primary" @click="pre" size="large" v-show="currentStep > 1 && handleType != handleTypes.detail">上一步</Button>
        <Button class="modalBtn" type="primary" @click="next" size="large" v-show="currentStep < 3">下一步</Button>
        <Button class="modalBtn" type="primary" @click="submit" size="large" v-show="currentStep === 3 && handleType != handleTypes.detail">确认</Button>
        <Button class="modalBtn" type="default" @click="showModal = false" size="large">取消</Button>
      </div>
    </Modal>
    <selectInterfaceModal ref="selectInterfaceModal" @on-ok="setTreeData" />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
import selectInterfaceModal from './selectInterfaceModal'
import { handleTypes, inputMode, outputMode, updateMode, updateFrequence } from './constant'

function getForm1 () {
  return {
    connectName: '',
    inType: '',
    inInte: '',
    inInteName: '',
    outType: '',
    outInte: '',
    outInteName: '',
    updataType: '',
    updateScale: '',
    connectDesc: '',
    connectCode: ''
  }
}

function notEmpty (rule, value, cb) {
  if (!value) {
    cb(new Error('不能为空'))
    return
  }
  cb()
}

const modalTitles = {}
modalTitles[handleTypes.create] = '新增'
modalTitles[handleTypes.detail] = '详情'
modalTitles[handleTypes.edit] = '修改'
export default {
  components: {
    selectInterfaceModal
  },
  data () {
    const vm = this
    return {
      handleTypes,
      inputMode,
      outputMode,
      updateMode,
      updateFrequence,
      isRequesting: false, // 防止重复提交
      // 当前操作的是输入还是输出，‘1’是输入
      currentInteType: '1',
      currentStep: 1,
      showModal: false,
      handleType: '',
      form1: getForm1(),
      // 被操作后的字段数据
      fieldData: [],
      // 被选择的行信息
      selections: [],
      validate1: {
        connectName: [{validator: notEmpty, trigger: 'blur'}],
        inType: [{validator: notEmpty, trigger: 'change'}],
        inInte: [{validator: notEmpty, trigger: 'blur'}],
        outType: [{validator: (rule, value, cb) => {
          if (!vm.form1.outType) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        outInte: [{validator: (rule, value, cb) => {
          if (!vm.form1.outInte) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        updataType: [{validator: (rule, value, cb) => {
          if (!vm.form1.updataType) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        updateScale: [{validator: (rule, value, cb) => {
          if (!vm.form1.updateScale) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        connectCode: [{validator: (rule, value, cb) => {
          if (!vm.form1.connectCode) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}]
      },
      tableData: {
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          title: '选择'
        }, {
          title: '输入字段',
          key: 'inputs',
          render: (h, params) => {
            const { inputs = [], _index } = params.row
            const options = []
            inputs.map(option => {
              options.push(h('Option', {
                props: {
                  value: option.id
                }
              }, option.name))
            })
            const html = h('Select', {
              props: {
                value: vm.fieldData[_index].inFieldId || ''
              },
              on: {
                input: (val) => {
                  vm.fieldData[_index].inFieldId = val
                }
              }
            }, options)
            return html
          }
        }, {
          title: '输出字段',
          key: 'outputs',
          render: (h, params) => {
            const { outputs = [], _index } = params.row
            const options = []
            outputs.map(option => {
              options.push(h('Option', {
                props: {
                  value: option.id
                }
              }, option.name))
            })
            const html = h('Select', {
              props: {
                value: vm.fieldData[_index].outFieldId || ''
              },
              on: {
                input: (val) => {
                  vm.fieldData[_index].outFieldId = val
                }
              }
            }, options)
            return html
          }
        }, {
          title: '备注',
          key: 'mapDesc',
          render: (h, params) => {
            const { _index } = params.row
            const html = h('Input', {
              props: {
                value: vm.fieldData[_index].mapDesc || ''
              },
              on: {
                input: (val) => {
                  vm.fieldData[_index].mapDesc = val
                }
              }
            }, vm.fieldData[_index].mapDesc)
            return html
          }
        }],
        data: [],
        columns1: [{
          title: '输入字段',
          key: 'inFieldName'
        }, {
          title: '输出字段',
          key: 'outFieldName'
        }, {
          title: '备注',
          key: 'mapDesc'
        }],
        data1: []
      }
    }
  },
  computed: {
    modalTitle () {
      return modalTitles[this.handleType] || ''
    },
    ...mapState(['userInfo'])
  },
  methods: {
    // 获取从树弹窗返回的数据
    setTreeData (data) {
      if (this.currentInteType === '1') {
        this.form1.inInteName = data[0].title
        this.form1.inInte = data[0].id
        // this.form1.inInteFieldType = data[0].inteType
      } else {
        this.form1.outInteName = data[0].title
        this.form1.outInte = data[0].id
        // this.form1.outInteFieldType = data[0].inteType
      }
      this.tableData.data = []
      this.selections = []
      this.fieldData = []
    },
    // 更新流程衔接的编码
    refreshConnectCode () {
      const vm = this
      api(processApiList.getConnectCode)
        .then(res => {
          if (res.data.errcode === 0) {
            vm.form1.connectCode = res.data.data
          } else {
            vm.$Message.info(res.data.errmsg)
          }
        }, err => { console.log(err) })
    },
    open (id, type) {
      const vm = this
      if (type === vm.handleTypes.detail) {
        vm.currentStep = 3
      } else {
        vm.currentStep = 1
      }
      vm.form1 = getForm1()
      vm.handleType = type
      vm.$nextTick(() => {
        // vm.$refs.form1.resetFields()
        vm.form1.id = id
        // // 非新增
        if (type !== vm.handleTypes.create) {
          vm.tableData.data = []
          vm.selections = []
          vm.fieldData = []
          vm.getDetail()
        } else {
          vm.refreshConnectCode()
        }
        vm.showModal = true
      })
    },
    getDetail () {
      const vm = this
      api(processApiList.getFlowConnectInfo, {
        id: vm.form1.id
      }).then(res => {
        if (res.data.errcode === 0) {
          const data = res.data.data
          const field2Fileds = data.field2Fileds || []
          vm.form1 = res.data.data
          if (vm.handleType === vm.handleTypes.detail) {
            vm.tableData.data1 = field2Fileds
          } else {
            const selections = []
            const fieldData = []
            field2Fileds.map((item, idx) => {
              selections.push({
                idx
              })
              fieldData.push({
                inFieldId: item.inFieldId,
                outFieldId: item.outFieldId,
                mapDesc: item.mapDesc || ''
              })
            })
            vm.fieldData = fieldData
            vm.selections = selections
          }
        } else {
          vm.$Message.info(res.data.errmsg)
        }
      }, err => { console.log(err) })
    },
    submit () {
      const vm = this
      // 防止重复提交
      if (vm.isRequesting) {
        return
      }
      vm.isRequesting = true
      const data = {
        ...vm.form1,
        field2Fileds: vm.tableData.data1
      }
      api(processApiList.createFlowConnect, data)
        .then(res => {
          if (res.data.errcode === 0) {
            vm.$emit('on-ok')
            vm.$Message.info('保存成功')
            vm.showModal = false
          } else {
            vm.$Message.info(res.data.errmsg)
          }
          vm.$nextTick(() => {
            vm.isRequesting = false
          })
        }, err => {
          console.log(err)
          vm.$nextTick(() => {
            vm.isRequesting = false
          })
        })
    },
    // 下一步
    next () {
      const vm = this
      if (vm.currentStep === 1) {
        vm.$refs.form1.validate(valid => {
          if (valid) {
            vm.jumpStep2()
          } else {
            vm.$Message.info('表单验证失败')
          }
        })
      } else if (vm.currentStep === 2) {
        if (vm.selections.length === 0) {
          vm.$Message.info('请至少选择一个字段')
        } else {
          vm.jumpStep3()
        }
      } else {
        vm.currentStep++
      }
    },
    jumpStep2 () {
      const vm = this
      if (vm.tableData.data.length === 0) {
        Promise.all([api(processApiList.getFieldDetailById, {
          fieldType: 1,
          interId: vm.form1.inInte
        }), api(processApiList.getFieldDetailById, {
          fieldType: 2,
          interId: vm.form1.outInte
        })]).then((res) => {
          const inputs = res[0].data.data || []
          const outputs = res[1].data.data || []
          const length = Math.max(inputs.length, outputs.length)
          const data = []
          const fieldData = []
          const fieldDataLength = vm.fieldData.length
          for (var i = 0; i < length; i++) {
            data.push({
              inputs: inputs,
              outputs: outputs,
              mapDesc: '',
              idx: i
            })
            if (fieldDataLength <= i) {
              fieldData.push({
                inFieldId: '',
                outFieldId: '',
                mapDesc: ''
              })
            }
          }
          vm.tableData.data = data
          vm.fieldData = [...vm.fieldData, ...fieldData]
          vm.selections.map(item => {
            vm.tableData.data[item.idx]._checked = true
          })
          vm.currentStep = 2
        })
      } else {
        vm.selections.map(item => {
          vm.tableData.data[item.idx]._checked = true
        })
        vm.currentStep = 2
      }
    },
    jumpStep3 () {
      const vm = this
      const data1 = []
      vm.selections.map(item => {
        const idx = item.idx
        const {inFieldId, outFieldId, mapDesc} = vm.fieldData[idx]
        const inputs = vm.tableData.data[idx].inputs
        const outputs = vm.tableData.data[idx].outputs
        let inFieldName = ''
        let outFieldName = ''
        for (let it of inputs) {
          if (it.id === inFieldId) {
            inFieldName = it.name
            break
          }
        }
        for (let it of outputs) {
          if (it.id === outFieldId) {
            outFieldName = it.name
            break
          }
        }
        data1.push({
          inFieldId,
          outFieldId,
          inFieldName: inFieldName,
          outFieldName: outFieldName,
          mapDesc: mapDesc || ''
        })
      })
      vm.tableData.data1 = data1
      vm.currentStep = 3
    },
    // 上一步
    pre () {
      const vm = this
      if (vm.currentStep === 3) {
        vm.jumpStep2()
      } else {
        vm.currentStep--
      }
    },
    // 选择接口的弹窗
    showTreeModal (inteType) {
      const vm = this
      // 详情
      if (vm.currentStep === 3) {
        return
      }
      vm.currentInteType = inteType
      vm.$refs.selectInterfaceModal.open(inteType)
    },
    // 第二步table被选择的时候触发
    tableSelect (selection) {
      this.selections = selection
    }
  }
}
</script>

<style lang="less">
.div-disabled{
  background-color: #f3f3f3 !important;
  color: #797979;
}
</style>
