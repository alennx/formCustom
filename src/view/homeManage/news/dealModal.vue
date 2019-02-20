<!-- 新增详情等的弹窗 -->
<template>
  <Modal
    v-model="showModal"
    :title="modalTitle"
    width="70%">
    <Form ref="dealForm" :model="dealForm" :rules="validate" :label-width="90">
      <FormItem label="新闻标题" prop="newsTitle" required>
        <Input
          v-model="dealForm.newsTitle"
          type="text"
          :disabled="handleType === handleTypes.detail" />
      </FormItem>
      <FormItem label="发表人" prop="postedByName" required>
        <Input
          v-model="dealForm.postedByName"
          type="text"
          :disabled="handleType === handleTypes.detail" />
        </Input>
      </FormItem>
      <FormItem label="发表日期" prop="publicationTime" required>
        <DatePicker
          v-model="dealForm.publicationTime"
          format="yyyy-MM-dd"
          type="date"
          style="width: 200px"
          :disabled="handleType === handleTypes.detail">
        </DatePicker>
      </FormItem>
      <FormItem label="显示标志">
        <RadioGroup v-model="dealForm.displaySign"
          :disabled="handleType === handleTypes.detail">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="新闻类别" required>
        <Select v-model="dealForm.newsType" prop="newsType" required
          :disabled="handleType === handleTypes.detail">
          <Option :value="item.value" v-for="item in newsTypes" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="新闻来源">
        <Input
          v-model="dealForm.newsSource"
          type="text"
          :disabled="handleType === handleTypes.detail" />
        </Input>
      </FormItem>
      <Row style="height: 80px;">
        <Col span="12">
          <FormItem label="新闻小图">
            <hyUpload
              ref="file1"
              action="/api/file/p/file/simple"
              :onSuccess="file1UploadSuccess"
              :before-upload="beforeFile1Upload"
              :default-file-list="defaultFile1"
              :on-remove="file1Remove"
              :show-upload-list="false"
              v-if="handleType !== handleTypes.detail" />
            <div class="img"
              :class="{'active': handleType === handleTypes.detail}"
              :style="{ 'background-image': `url(${dealForm.newsSmallIcon})` }"
              v-if="dealForm.newsSmallIcon"></div>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="新闻大图">
            <hyUpload
              ref="file2"
              action="/api/file/p/file/simple"
              :onSuccess="file2UploadSuccess"
              :before-upload="beforeFile2Upload"
              :default-file-list="defaultFile2"
              :on-remove="file2Remove"
              :show-upload-list="false"
              v-if="handleType !== handleTypes.detail" />
            <div class="img"
              :class="{'active': handleType === handleTypes.detail}"
              :style="{ 'background-image': `url(${dealForm.newsBigIcon})` }"
              v-if="dealForm.newsBigIcon"></div>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="来源网址">
        <Input
          v-model="dealForm.sourceUrl"
          type="text"
          :disabled="handleType === handleTypes.detail" />
        </Input>
      </FormItem>
      <FormItem label="新闻内容" prop="newsContent" required>
        <hyUE
          @editorUpdate="editorUpdate"
          :defaultMsg="defaultMsg"
          :config="ueConfig"
          id="hyue"
          ref="hyue"
          :disabled="handleType === handleTypes.detail" />
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
import hyUE from '@/components/ue/hyue'
// 文件上传
import hyUpload from '@/components/hengyun/hyUpload'
import { handleTypes, newsTypes } from './constant'

function getDealForm () {
  return {
    newsTitle: '',
    postedByName: '',
    publicationTime: '',
    displaySign: 1,
    newsType: '',
    newsSource: '',
    defaultFlag: 1,
    sourceUrl: '',
    newsContent: '',
    newsSmallIcon: null,
    newsBigIcon: null
  }
}

const modalTitles = {}
modalTitles[handleTypes.create] = '新增'
modalTitles[handleTypes.detail] = '详情'
modalTitles[handleTypes.edit] = '修改'
export default {
  components: {
    hyUpload,
    hyUE
  },
  data () {
    const vm = this
    return {
      newsTypes,
      showModal: false,
      handleTypes,
      handleType: '',
      currentIdx: 0,
      dealForm: getDealForm(),
      ueConfig: {
        initialFrameWidth: 'auto',
        initialFrameHeight: 250,
        scaleEnabled: true // 设置不自动调整高度
      },
      defaultMsg: '',
      validate: {
        newsTitle: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.newsTitle) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        postedByName: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.postedByName) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        publicationTime: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.publicationTime) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        newsType: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.newsType) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}],
        newsContent: [{validator: (rule, value, cb) => {
          if (!vm.dealForm.newsContent) {
            cb(new Error('不能为空'))
            return
          }
          cb()
        }}]
      },
      // 默认的小图
      defaultFile1: [],
      // 小图
      file1: [],
      // 默认的大图
      defaultFile2: [],
      // 大图
      file2: []
    }
  },
  computed: {
    modalTitle () {
      return modalTitles[this.handleType] || ''
    },
    ...mapState(['userInfo'])
  },
  methods: {
    editorUpdate (dataString) {
      this.dealForm.newsContent = dataString
    },
    open (id, type) {
      const vm = this
      vm.dealForm = getDealForm()
      vm.$refs.hyue.execCommand()
      vm.handleType = type
      vm.$refs.dealForm.resetFields()
      vm.defaultMsg = ''
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
      api(homeApiList.newsManagementDetail, {
        id: vm.dealForm.id
      }).then(res => {
        if (res.data.errcode === 0) {
          const data = res.data.data
          vm.dealForm.newsTitle = data.newsTitle
          vm.dealForm.postedByName = data.postedByName
          vm.dealForm.publicationTime = data.publicationTime
          vm.dealForm.displaySign = data.displaySign
          vm.dealForm.newsType = data.newsType
          vm.dealForm.newsSource = data.newsSource
          vm.dealForm.sourceUrl = data.sourceUrl
          vm.dealForm.newsContent = data.newsContent
          vm.dealForm.newsSmallIcon = data.newsSmallIcon
          vm.dealForm.newsBigIcon = data.newsBigIcon
          vm.defaultMsg = data.newsContent
        } else {
          vm.$Message.info(res.data.errmsg)
        }
      }, err => { console.log(err) })
    },
    submit () {
      const vm = this
      if (vm.handleType === handleTypes.detail) {
        vm.showModal = false
        return
      }
      vm.$refs.dealForm.validate(valid => {
        if (valid) {
          const date = vm.dealForm.publicationTime
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()
          // const hour = date.getHours()
          // const minute = date.getMinutes()
          // const second = date.getSeconds()
          const publicationTime = `${year}-${month}-${day} 00:00:00`
          let newsSmallIconVal = ''
          if (vm.file1.length > 0) {
            newsSmallIconVal = vm.file1[0].url
          }
          let newsBigIconVal = ''
          if (vm.file1.length > 0) {
            newsBigIconVal = vm.file2[0].url
          }
          vm.doSave({
            newsSmallIcon: newsSmallIconVal,
            newsBigIcon: newsBigIconVal,
            ...vm.dealForm,
            publicationTime: publicationTime
          })
        } else {
          vm.$Message.info('表单验证失败')
        }
      })
    },
    doSave (data) {
      const vm = this
      if (vm.handleType === handleTypes.create) {
        api(homeApiList.newsManagementSave, data)
          .then(res => {
            if (res.data) {
              vm.$Message.success('保存成功！！！')
              vm.$emit('on-ok')
              vm.showModal = false
            }
          }, err => { console.log(err) })
      } else {
        api(homeApiList.newsManagementUpdate, data)
          .then(res => {
            if (res.data) {
              vm.$Message.success('更新成功！！！')
              vm.$emit('on-ok')
              vm.showModal = false
            }
          }, err => { console.log(err) })
      }
    },
    file1UploadSuccess (resp, file, fileList) {
      console.log(resp.data.list)
      const vm = this
      vm.file1 = resp.data.list
      vm.dealForm.newsSmallIcon = vm.file1[0].url
      console.log(vm.dealForm)
    },
    // 只能上传一张
    beforeFile1Upload () {
      this.$refs.file1.clearFiles()
      return true
    },
    file1Remove () {
      const vm = this
      vm.file1 = [{}]
      vm.dealForm.newsSmallIcon = ''
    },
    file2UploadSuccess (resp, file, fileList) {
      const vm = this
      vm.file2 = resp.data.list
      vm.dealForm.newsBigIcon = vm.file2[0].url
    },
    // 只能上传一张
    beforeFile2Upload () {
      this.$refs.file2.clearFiles()
      return true
    },
    file2Remove () {
      const vm = this
      vm.file2 = [{}]
      vm.dealForm.newsBigIcon = ''
    }
  }
}
</script>

<style lang="less" scoped>
.img{
  position: absolute;
  left: 110px;
  top: -12px;
  width: 70px;
  height: 60px;
  border: 1px dotted #999;
  border-radius: 5px;
  overflow: hidden;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  &.active{
    left: 0;
  }
}
</style>
