<!-- 新增详情等的弹窗 -->
<template>
  <Modal
    v-model="showModal"
    :title="modalTitle"
    width="40%"
    id="areaDealModal">
    <Form ref="dealForm" :model="dealForm" :rules="validate" :label-width="90">
      <FormItem label="系统名称：" prop="systemName" required>
        <Input v-model="dealForm.systemName" type="text" :disabled="handleType === handleTypes.detail"></Input>
        <!-- <Select v-model="dealForm.systemName" :disabled="handleType === handleTypes.detail">
          <Option :value="item.value" v-for="item in systemList" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="区域：" prop="region" required>
        <Select v-model="dealForm.region" :disabled="handleType === handleTypes.detail">
          <Option :value="item.value" v-for="item in areaList" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="名称：" prop="iconName" required>
        <Input
          v-model="dealForm.iconName"
          type="text" :disabled="handleType === handleTypes.detail">
        </Input>
      </FormItem>
      <FormItem label="图标：">
        <hyUpload
          v-if="handleType !== handleTypes.detail"
          ref="file"
          :showUploadList="isShowUploadList"
          action="/api/file/p/file/simple"
          :onSuccess="fileUploadSuccess"
          :before-upload="beforeFileUpload"
          :default-file-list="defaultFile"
          :on-remove="fileRemove"/>
        </hyUpload>
        <img :src="dealForm.iconImage" alt="" />
      </FormItem>
      <FormItem label="默认标志：">
        <RadioGroup v-model="dealForm.defaultFlag">
          <Radio :label="1" :disabled="handleType === handleTypes.detail">是</Radio>
          <Radio :label="0" :disabled="handleType === handleTypes.detail">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="链接地址：" required prop="iconLinkAddress">
        <Input
          v-model="dealForm.iconLinkAddress"
          type="text" :disabled="handleType === handleTypes.detail">
        </Input>
      </FormItem>
      <FormItem label="备注：" prop="remarks">
        <Input
          v-model="dealForm.remarks"
          type="textarea"
          :autosize="{minRows: 5,maxRows: 5}" :disabled="handleType === handleTypes.detail">
        </Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="modalBtn" type="default" @click="showModal = false" size="large">取消</Button>
      <Button class="modalBtn" type="primary" @click="submit" size="large">确定</Button>
    </div>
  </Modal>
</template>

<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import homeApiList from '@/api/homeApiList'
// 文件上传
import hyUpload from '@/components/hengyun/hyUpload'
import { handleTypes, systemList, areaList } from './constant'

function getDealForm () {
  return {
    systemName: '',
    region: '',
    iconName: '',
    iconImage: '',
    defaultFlag: 1,
    iconLinkAddress: '',
    remarks: ''
  }
}

const modalTitles = {}
modalTitles[handleTypes.create] = '新增'
modalTitles[handleTypes.detail] = '详情'
modalTitles[handleTypes.edit] = '修改'
export default {
  components: {
    hyUpload
  },
  data () {
    const vm = this
    return {
      isShowUploadList: false,
      systemList,
      areaList,
      handleTypes,
      showModal: false,
      handleType: '',
      defaultFile: [],
      dealForm: getDealForm(),
      validate: {
        systemName: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.systemName) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        region: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.region) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        iconName: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.iconName) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        iconLinkAddress: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.iconLinkAddress) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}]
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
    open (id, type) {
      const vm = this
      vm.dealForm = getDealForm()
      vm.handleType = type
      vm.$refs.dealForm.resetFields()
      // 新增
      if (type === handleTypes.create) {
        vm.showModal = true
      } else {
        vm.dealForm.id = id
        vm.getDetail()
      }
    },
    getDetail () {
      const vm = this
      vm.showModal = true
      api(homeApiList.regionManagementDetail, {
        id: vm.dealForm.id
      }).then(res => {
        if (res.data.errcode === 0) {
          const data = res.data.data
          vm.dealForm.systemName = data.systemName
          vm.dealForm.region = data.region
          vm.dealForm.iconName = data.iconName
          vm.dealForm.iconImage = data.iconImage
          vm.dealForm.defaultFlag = data.defaultFlag
          vm.dealForm.iconLinkAddress = data.iconLinkAddress
          vm.dealForm.remarks = data.remarks
        } else {
          vm.$Message.info(res.data.errmsg)
        }
      }, err => { console.log(err) })
    },
    submit () {
      const vm = this
      if (vm.handleType === vm.handleTypes.detail) {
        vm.showModal = false
        return
      }
      vm.$refs.dealForm.validate((valid) => {
        if (valid) {
          vm.doSave({
            ...vm.dealForm
          })
        } else {
          vm.$Message.info('表单验证失败')
        }
      })
    },
    doSave (data) {
      const vm = this
      if (vm.handleType === handleTypes.create) {
        api(homeApiList.regionManagementSave, data)
          .then(res => {
            if (res.data) {
              vm.$Message.success('保存成功！！！')
              vm.$emit('on-ok')
              vm.showModal = false
            }
          }, err => { console.log(err) })
      } else {
        api(homeApiList.regionManagementUpdate, data)
          .then(res => {
            if (res.data) {
              vm.$Message.success('更新成功！！！')
              vm.$emit('on-ok')
              vm.showModal = false
            }
          }, err => { console.log(err) })
      }
    },
    fileUploadSuccess (resp, file, fileList) {
      const vm = this
      vm.dealForm.iconImage = file.response.data.list[0].url
      vm.file = fileList
    },
    // 只能上传一张
    beforeFileUpload () {
      this.$refs.file.clearFiles()
      return true
    },
    fileRemove () {
      const vm = this
      vm.file = []
    }
  }
}
</script>

<style lang="less">
#areaDealModal .hy-upload .ivu-upload-list .ivu-upload-list-file {
  width: 200px;
}
</style>
