<template>
  <div>
    <Form
      ref="formValidate"
      inline
      :label-width="100"
      :model="searchCondition">
      <FormItem label="系统名称：">
        <Select v-model="searchCondition.systemName" style="width:200px">
          <Option v-for="item in systemList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="区域：">
        <Select v-model="searchCondition.region" style="width:200px">
          <Option v-for="item in areaList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="名称：">
        <Input
          type="text"
          v-model="searchCondition.iconName">
        </Input>
      </FormItem>
      <FormItem label="默认标志：">
        <Select v-model="searchCondition.defaultFlag" style="width:200px">
          <Option value="-1">全部</Option>
          <Option :value="1">是</Option>
          <Option :value="0">否</Option>
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
import dealModal from './dealModal.vue'
import {areaList, handleTypes, systemList} from './constant'

export default {
  components: {
    dealModal
  },
  data () {
    return {
      // 区域列表
      areaList,
      systemList,
      // 预警搜索条件
      searchCondition: {
        // 系统名称
        systemName: '-1',
        // 区域
        region: '-1',
        // 名称
        iconName: '',
        // 默认标志：
        defaultFlag: '-1'
      },
      // 选择的类型名称
      typeName: '全部'
    }
  },
  methods: {
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
