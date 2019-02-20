<template>
  <div>
    <Form
      ref="formValidate"
      inline
      :label-width="100"
      :model="searchCondition">
      <FormItem label="接口名称：">
        <Input
          type="text"
          v-model="searchCondition.inteName">
        </Input>
      </FormItem>
      <FormItem label="所属系统：">
        <Select v-model="searchCondition.appId" style="width:200px">
          <Option value="-1" key="-1">全部</Option>
          <Option v-for="item in systemList" :value="item.appId" :key="item.appId">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="接口类型：">
        <Select v-model="searchCondition.inteType" style="width:200px">
          <Option value="-1">全部</Option>
          <Option value="1">输入</Option>
          <Option value="2">输出</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="20">
        <Button type="primary" @click="preSearch">查询</Button>
        <Button type="primary" @click="create">新增</Button>
      </FormItem>
    </Form>
    <dealModal ref="dealModal" @on-ok="preSearch" />
  </div>
</template>

<script>
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
import dealModal from './dealModal.vue'
import {interfaceTypes, handleTypes} from './constant'

export default {
  components: {
    dealModal
  },
  data () {
    return {
      // 接口类型
      interfaceTypes,
      // 所属系统列表
      systemList: [],
      // 预警搜索条件
      searchCondition: {
        inteName: '',
        appId: '-1',
        inteType: '-1'
      },
      // 选择的类型名称
      typeName: '全部'
    }
  },
  mounted () {
    this.applicationFindAllLike()
  },
  methods: {
    // 获取系统列表
    applicationFindAllLike () {
      const vm = this
      api(processApiList.applicationFindAllLike, {type: 'jryy'})
        .then(res => {
          if (res.data) {
            vm.systemList = res.data.data
          }
        }, err => { console.log(err) })
    },
    // 打开新增弹窗
    create () {
      this.$refs.dealModal.open('', handleTypes.create)
    },
    // 预备搜索
    preSearch () {
      const vm = this
      const condition = vm.getCondition()
      vm.$emit('searchClick', condition)
    },
    getCondition () {
      const vm = this
      return vm.searchCondition
    }
  }
}
</script>
