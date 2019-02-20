<!-- 新增详情等的弹窗 -->
<template>
  <Modal
    v-model="showModal"
    title="接口选择"
    width="560px"
    :mask-closable="false">
    <Form ref="form1" :model="form1" :label-width="90">
      <FormItem label="接口类型" prop="inteType" required>
        <Select v-model="form1.inteType" disabled>
          <Option :value="item.value" v-for="item in inteTypes" :key="item.value" v-if="item.value != '-1'">{{item.label}}</Option>
        </Select>
      </FormItem>
      <Row>
        <Col span="10">
          <FormItem label="接口名称">
            <Input
              v-model="form1.inteName"
              type="text" />
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem label="所属系统">
            <Select v-model="form1.appId">
              <Option :value="item.appId" v-for="item in systemList" :key="item.appId">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4">
          <Button class="modalBtn" type="primary" @click="search" style="float: right;">查询</Button>
        </Col>
      </Row>
    </Form>
    <div class="spliter-line"></div>
    <interfaceTree ref="interfaceTree" />
    <div slot="footer">
      <Button class="modalBtn" type="primary" @click="submit" size="large">确定</Button>
      <Button class="modalBtn" type="default" @click="showModal = false" size="large">取消</Button>
    </div>
  </Modal>
</template>

<script>
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
import interfaceTree from './interfaceTree'
import { inteTypes } from './constant'

function getForm1 () {
  return {
    inteType: '',
    inteName: '',
    appId: '-1'
  }
}

function makeTree ({children = [], father = []}) {
  const fa = JSON.parse(JSON.stringify(father))
  children.map(child => {
    const appId = child.appId
    for (let f of fa) {
      if (appId === f.appId) {
        if (!f.children) {
          f.children = []
        }
        f.expand = true
        f.children.push(child)
      }
    }
  })
  const treeData = []
  for (let f of fa) {
    if (f.children) {
      treeData.push(f)
    }
  }
  return treeData
}

export default {
  components: {
    interfaceTree
  },
  data () {
    // const vm = this
    return {
      inteTypes,
      systemList: [],
      showModal: false,
      handleType: '',
      treeData: [],
      form1: getForm1()
    }
  },
  methods: {
    // 获取系统列表
    applicationFindAllLike () {
      const vm = this
      api(processApiList.applicationFindAllLike, {type: 'jryy'})
        .then(res => {
          if (res.data) {
            vm.systemList = [{name: '全部', appId: '-1'}, ...res.data.data]
            if (vm.systemList.length > 0) {
              vm.form1.appId = vm.systemList[0].appId
              vm.search()
            }
          }
        }, err => { console.log(err) })
    },
    open (inteType) {
      const vm = this
      vm.applicationFindAllLike()
      vm.form1 = getForm1()
      vm.$refs.form1.resetFields()
      vm.form1.inteType = inteType
      vm.showModal = true
      vm.$refs.interfaceTree.refresh()
    },
    submit () {
      const vm = this
      const data = vm.$refs.interfaceTree.getSelection()
      if (data.length === 0 || data[0].children) {
        vm.$Message.info('请选择接口')
        return
      }
      vm.$emit('on-ok', data)
      vm.showModal = false
    },
    search () {
      const vm = this
      const data = vm.form1
      api(processApiList.getInterfacePage, {
        data,
        pageNo: 1,
        pageSize: 1000
      }).then(res => {
        if (res.data.errcode === 0) {
          // 接口列表
          const intes = res.data.data.list
          const children = JSON.parse(JSON.stringify(intes).replace(/inteName/g, 'title')) || []
          const father = JSON.parse(JSON.stringify(this.systemList).replace(/name/g, 'title')) || []
          const treeData = makeTree({children, father})
          // let treeData = []
          // for (let l of list) {
          //   if (l.appId === vm.form1.appId) {
          //     l.children = children
          //     treeData = l
          //     break
          //   }
          // }
          // debugger
          console.log(JSON.stringify(treeData))
          vm.$refs.interfaceTree.refresh(treeData)
        }
      }, error => { console.log(error) })
    }
  }
}
</script>

<style lang="less" scoped>
.spliter-line{
  height: 0;
  border: 1px solid #c5c8ce;
}
</style>
