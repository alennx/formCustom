<!-- 新增详情等的弹窗 -->
<template>
  <Modal
    v-model="showModal"
    :title="modalTitle"
    width="860px"
    :mask-closable="false">
    <template v-if="currentStep === 1">
      <Form ref="dealForm" :model="dealForm" :rules="validate" :label-width="110">
        <FormItem label="接口名称" prop="inteName">
          <Input
            v-model="dealForm.inteName"
            type="text">
          </Input>
        </FormItem>
        <FormItem label="接口地址" prop="inteUrl">
          <Input
            v-model="dealForm.inteUrl"
            type="text">
          </Input>
        </FormItem>
        <FormItem label="所属系统" prop="appId">
          <Select v-model="systemIdx">
            <Option :value="idx" v-for="(item, idx) in systemList" :key="item.appId">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="接口格式" prop="intePattern">
          <Select v-model="dealForm.intePattern">
            <Option :value="item.value" v-for="item in patterns" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="接口类型" prop="inteType">
          <Select v-model="dealForm.inteType">
            <Option :value="item.value" v-for="item in inteTypes" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
          </Select>
          </Input>
        </FormItem>
        <FormItem label="请求示例" prop="inteExample">
          <Input
            v-model="dealForm.inteExample"
            type="text">
          </Input>
        </FormItem>
        <FormItem label="请求方式" prop="reqType" required>
          <Select v-model="dealForm.reqType">
            <Option :value="item.value" v-for="item in requestMethods" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="参数传递方式" prop="reqParamType" required>
          <Select v-model="dealForm.reqParamType">
            <Option :value="item.value" v-for="item in requestMethods" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="接口描述">
          <Input
            v-model="dealForm.inteDesc"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 4}">
          </Input>
        </FormItem>
      </Form>
    </template>
    <template v-if="currentStep === 2">
      <div class="switch-container">
        <RadioGroup v-model="putType" type="button">
          <Radio label="input">输入参数</Radio>
          <Radio label="output">输出参数</Radio>
        </RadioGroup>
      </div>
      <Table
        border
        ref="selection"
        :columns="tableData.columns"
        :data="tableData.data"
        v-if="putType === 'input'"></Table>
      <Table
        border
        ref="selection"
        :columns="tableData.columns1"
        :data="tableData.data1"
        v-if="putType === 'output'"></Table>
      <Row style="margin: 10px 0px;text-align: right;">
        <Button class="modalBtn" type="primary" size="small" @click="addRow">增加</Button>
      </Row>
    </template>
    <div slot="footer">
      <Button class="modalBtn" type="primary" @click="pre" size="large" v-show="currentStep === 2">上一步</Button>
      <Button class="modalBtn" type="primary" @click="next" size="large" v-show="currentStep === 1">下一步</Button>
      <Button class="modalBtn" type="primary" @click="submit" size="large" v-show="currentStep === 2">保存</Button>
      <Button class="modalBtn" type="default" @click="closeModel" size="large">取消</Button>
    </div>
  </Modal>
</template>

<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
import inputItem from './inputItem'
import { handleTypes, requestMethods, patterns, inteTypes, fieldTypes } from './constant'

function getDealForm () {
  return {
    inteName: '',
    inteUrl: '',
    appId: '',
    intePattern: '',
    inteType: '',
    inteExample: '',
    reqType: 1,
    reqParamType: 1,
    inteDesc: '',
    delInterfaceFieldIds: []
  }
}

function getDefaultData (isInput) {
  const data = {
    name: '',
    fieldCode: '',
    fieldLength: '',
    isFilled: false, // 0:非必填1:必填
    type: '',
    fieldDesc: ''
  }
  if (isInput) {
    data.fieldType = 1 // 1:输入2：输出
  } else {
    data.fieldType = 2 // 1:输入2：输出
  }
  return data
}

const modalTitles = {}
modalTitles[handleTypes.create] = '新增'
modalTitles[handleTypes.detail] = '详情'
modalTitles[handleTypes.edit] = '修改'
export default {
  components: {
    inputItem
  },
  data () {
    const vm = this
    return {
      requestMethods,
      systemList: [],
      patterns,
      inteTypes,
      fieldTypes,
      systemIdx: '', // 系统列表的索引
      isRequesting: false, // 防止重复提交
      showModal: false,
      handleType: '',
      currentStep: 1,
      putType: 'input',
      inputData: [],
      outputData: [],
      dealForm: getDealForm(),
      validate: {
        inteName: [{
          required: true,
          validator: (rule, value, cb) => {
            if (!vm.dealForm.inteName) {
              cb(new Error('不能为空'))
              return
            }
            cb()
          },
          tigger: 'blur'
        }],
        inteUrl: [{
          required: true,
          validator: (rule, value, cb) => {
            if (!vm.dealForm.inteUrl) {
              cb(new Error('不能为空'))
              return
            }
            cb()
          },
          tigger: 'blur'
        }],
        appId: [{
          required: true,
          validator: (rule, value, cb) => {
            if (typeof vm.systemIdx !== 'number' && !vm.systemIdx) {
              cb(new Error('不能为空'))
              return
            }
            cb()
          },
          tigger: 'change'
        }],
        intePattern: [{
          required: true,
          validator: (rule, value, cb) => {
            if (!vm.dealForm.intePattern) {
              cb(new Error('不能为空'))
              return
            }
            cb()
          },
          tigger: 'change'
        }],
        inteType: [{
          required: true,
          validator: (rule, value, cb) => {
            if (!vm.dealForm.inteType) {
              cb(new Error('不能为空'))
              return
            }
            cb()
          },
          tigger: 'change'
        }]
      },
      tableData: {
        columns: [{
          title: '名称',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            const { name } = params.row
            const html = h('Input', {
              attrs: {
                value: name
              },
              on: {
                input: (val) => {
                  params.row.name = val
                  vm.inputData[params.row['_index']].name = val
                }
              }
            })
            return html
          }
        }, {
          title: '字段',
          key: 'fieldCode',
          align: 'center',
          render: (h, params) => {
            const { fieldCode } = params.row
            const html = h('Input', {
              attrs: {
                value: fieldCode
              },
              on: {
                input: (val) => {
                  params.row.fieldCode = val
                  vm.inputData[params.row['_index']].fieldCode = val
                }
              }
            })
            return html
          }
        }, {
          title: '是否必填',
          key: 'isFilled',
          align: 'center',
          width: 80,
          render: (h, params) => {
            const { isFilled } = params.row
            const html = h('Checkbox', {
              attrs: {
                value: isFilled
              },
              on: {
                input: (val) => {
                  params.row.isFilled = val
                  vm.inputData[params.row['_index']].isFilled = val
                }
              }
            })
            return html
          }
        }, {
          title: '字段类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            const { type } = params.row
            const options = []
            fieldTypes.map(option => {
              options.push(h('Option', {
                props: {
                  value: option.value
                }
              }, option.label))
            })
            const html = h('Select', {
              props: {
                value: type
              },
              on: {
                input: (val) => {
                  params.row.type = val
                  vm.inputData[params.row['_index']].type = val
                }
              }
            }, options)
            return html
          }
        }, {
          title: '字段长度',
          key: 'fieldLength',
          align: 'center',
          render: (h, params) => {
            const { fieldLength } = params.row
            const html = h(inputItem, {
              attrs: {
                value: fieldLength
              },
              props: {
                value: fieldLength
              },
              on: {
                input: (val) => {
                  vm.$set(params.row, 'fieldLength', val)
                  vm.$set(vm.inputData[params.row['_index']], 'fieldLength', val)
                }
              }
            })
            return html
          }
        }, {
          title: '备注',
          key: 'fieldDesc',
          align: 'center',
          render: (h, params) => {
            const { fieldDesc } = params.row
            const html = h('Input', {
              attrs: {
                value: fieldDesc
              },
              on: {
                input: (val) => {
                  params.row.fieldDesc = val
                  vm.inputData[params.row['_index']].fieldDesc = val
                }
              }
            })
            return html
          }
        }, {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            const html = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  vm.inputData.splice(params.row['_index'], 1)
                  if (params.row.flowInterfaceId) {
                    vm.dealForm.delInterfaceFieldIds.push(params.row.flowInterfaceId)
                  }
                  vm.refreshData()
                }
              }
            }, '删除')
            return html
          }
        }],
        data: [],
        columns1: [{
          title: '名称',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            const { name } = params.row
            const html = h('Input', {
              attrs: {
                value: name
              },
              on: {
                input: (val) => {
                  params.row.name = val
                  vm.outputData[params.row['_index']].name = val
                }
              }
            })
            return html
          }
        }, {
          title: '字段',
          key: 'fieldCode',
          align: 'center',
          render: (h, params) => {
            const { fieldCode } = params.row
            const html = h('Input', {
              attrs: {
                value: fieldCode
              },
              on: {
                input: (val) => {
                  params.row.fieldCode = val
                  vm.outputData[params.row['_index']].fieldCode = val
                }
              }
            })
            return html
          }
        }, {
          title: '是否必填',
          key: 'isFilled',
          align: 'center',
          width: 80,
          render: (h, params) => {
            const { isFilled } = params.row
            const html = h('Checkbox', {
              attrs: {
                value: isFilled
              },
              on: {
                input: (val) => {
                  params.row.isFilled = val
                  vm.outputData[params.row['_index']].isFilled = val
                }
              }
            })
            return html
          }
        }, {
          title: '字段类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            const { type } = params.row
            const options = []
            fieldTypes.map(option => {
              options.push(h('Option', {
                props: {
                  value: option.value
                }
              }, option.label))
            })
            const html = h('Select', {
              props: {
                value: type
              },
              on: {
                input: (val) => {
                  params.row.type = val
                  vm.outputData[params.row['_index']].type = val
                }
              }
            }, options)
            return html
          }
        }, {
          title: '字段长度',
          key: 'fieldLength',
          align: 'center',
          render: (h, params) => {
            const { fieldLength } = params.row
            const html = h(inputItem, {
              attrs: {
                value: fieldLength
              },
              props: {
                value: fieldLength
              },
              on: {
                input: (val) => {
                  vm.$set(params.row, 'fieldLength', val)
                  vm.$set(vm.outputData[params.row['_index']], 'fieldLength', val)
                }
              }
            })
            return html
          }
        }, {
          title: '备注',
          key: 'fieldDesc',
          align: 'center',
          render: (h, params) => {
            const { fieldDesc } = params.row
            const html = h('Input', {
              attrs: {
                value: fieldDesc
              },
              on: {
                input: (val) => {
                  params.row.fieldDesc = val
                  vm.outputData[params.row['_index']].fieldDesc = val
                }
              }
            })
            return html
          }
        }, {
          title: '操作',
          key: 'remark',
          align: 'center',
          render: (h, params) => {
            const html = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  vm.outputData.splice(params.row['_index'], 1)
                  if (params.row.flowInterfaceId) {
                    vm.dealForm.delInterfaceFieldIds.push(params.row.flowInterfaceId)
                  }
                  vm.refreshData()
                }
              }
            }, '删除')
            return html
          }
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
    applicationFindAllLike (data) {
      const vm = this
      api(processApiList.applicationFindAllLike, {type: 'jryy'})
        .then(res => {
          if (res.data) {
            vm.systemList = res.data.data
            if (data && data.appId) {
              for (var i = 0; i < vm.systemList.length; i++) {
                if (data.appId === vm.systemList[i].appId) {
                  vm.systemIdx = i
                  break
                }
              }
            }
          }
        }, err => { console.log(err) })
    },
    open (id, type, detail) {
      const vm = this
      vm.$refs.dealForm.resetFields() // 清空表单
      let data = null
      if (detail) {
        data = JSON.parse(JSON.stringify(detail || {}))
      }
      if (data) {
        data.intePattern = data.intePattern ? data.intePattern.toString() : data.intePattern
        data.inteType = data.inteType ? data.inteType.toString() : data.inteType
      }
      // 初始化步骤二里面的表单数据
      vm.inputData = []
      vm.outputData = []
      vm.refreshData()
      // 有data的时候是指点击修改的时候
      if (!data) {
        vm.dealForm = getDealForm()
      } else {
        vm.dealForm = data
      }
      vm.handleType = type
      vm.currentStep = 1
      vm.$nextTick(() => {
        // 新增
        if (type !== handleTypes.create) {
          vm.getDetail()
        } else {
          vm.$refs.dealForm.resetFields()
        }
        vm.systemIdx = ''
        vm.applicationFindAllLike(data)
        vm.dealForm.id = id
        vm.showModal = true
      })
    },
    getDetail () {
      const vm = this
      // 输入参数
      api(processApiList.getFieldDetailById, {
        interId: vm.dealForm.id,
        fieldType: 1
      }).then(res => {
        if (res.data.errcode === 0) {
          vm.inputData = res.data.data
        } else {
          vm.$Message.info(res.data.errmsg)
        }
      }, err => { console.log(err) })

      // 输出参数
      setTimeout(() => {
        api(processApiList.getFieldDetailById, {
          interId: vm.dealForm.id,
          fieldType: 2
        }).then(res => {
          if (res.data.errcode === 0) {
            vm.outputData = res.data.data
          } else {
            vm.$Message.info(res.data.errmsg)
          }
        }, err => { console.log(err) })
      }, 1000)
    },
    // 验证步骤二的table字段
    validTable () {
      const vm = this
      let valid = true
      const arr = [...vm.inputData, ...vm.outputData]
      for (let it of arr) {
        if ((it.name && !it.fieldCode) || (!it.name && it.fieldCode)) {
          valid = false
          break
        }
      }
      if (!valid) {
        vm.$Modal.confirm({
          title: '错误提示',
          content: '输入参数和输出参数的名称和字段，两个输入框只能同时填写或者同时不填写!',
          okText: '好的'
        })
      }
      return valid
    },
    submit () {
      const vm = this
      const valid = vm.validTable()
      if (valid) {
        vm.refreshData()
        const inteFieldDto = []
        const temp = [...vm.tableData.data, ...vm.tableData.data1]
        temp.map(item => {
          if (item.fieldCode && item.name) {
            if (vm.handleType === handleTypes.edit) {
              item.flowInterfaceId = vm.dealForm.id
            }
            inteFieldDto.push(item)
          } else if (item.flowInterfaceId) {
            vm.dealForm.delInterfaceFieldIds.push(item.flowInterfaceId)
          }
        })
        const data = {
          inteFieldDto: inteFieldDto,
          ...vm.dealForm
        }
        vm.doSave(data)
      }
    },
    // 下一步
    next () {
      const vm = this
      console.log(vm.dealForm)
      vm.$refs.dealForm.validate((valid) => {
        if (valid) {
          const vm = this
          if (!vm.dealForm.id) {
            for (let i = 0; i < 5; i++) {
              if (vm.inputData.length < 5) {
                vm.inputData.push(getDefaultData(true))
              }
              if (vm.outputData.length < 5) {
                vm.outputData.push(getDefaultData())
              }
            }
          }
          vm.refreshData()
          vm.currentStep++
        } else {
          vm.$Message.info('表单验证失败')
        }
      })
    },
    // 上一步
    pre () {
      const vm = this
      vm.currentStep--
    },
    addRow () {
      const vm = this
      if (vm.putType === 'input') {
        vm.inputData.push(getDefaultData(true))
      } else {
        vm.outputData.push(getDefaultData())
      }
      vm.refreshData()
    },
    refreshData () {
      const vm = this
      vm.tableData.data = JSON.parse(JSON.stringify(vm.inputData))
      vm.tableData.data1 = JSON.parse(JSON.stringify(vm.outputData))
    },
    doSave (data) {
      const vm = this
      // 防止重复提交
      if (vm.isRequesting) {
        return
      }
      vm.isRequesting = true
      if (vm.handleType === handleTypes.create) {
        api(processApiList.interfaceSave, data)
          .then(res => {
            if (res.data) {
              vm.$Message.success('保存成功！！！')
              vm.$emit('on-ok')
              vm.showModal = false
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
      } else {
        api(processApiList.interfaceUpdate, data)
          .then(res => {
            if (res.data) {
              vm.$Message.success('更新成功！！！')
              vm.$emit('on-ok')
              vm.showModal = false
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
      }
    },
    closeModel () {
      this.showModal = false
      this.$nextTick(() => {
        this.currentStep = 1
      })
    }
  },
  watch: {
    systemIdx () {
      const sys = this.systemList[this.systemIdx] || {}
      this.dealForm.appId = sys.appId
      this.dealForm.appName = sys.name
    },
    currentStep () {
      this.refreshData()
    },
    putType () {
      this.refreshData()
    }
  }
}
</script>

<style lang="less" scoped>
.switch-container{
  margin-bottom: 20px;
}
</style>
