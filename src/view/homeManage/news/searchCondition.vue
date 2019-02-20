<template>
  <div>
    <Form
      ref="formValidate"
      inline
      :label-width="100"
      :model="searchCondition">
      <FormItem label="新闻名称：">
        <Input
          type="text"
          v-model="searchCondition.newsTitle">
        </Input>
      </FormItem>
      <FormItem label="新闻类别：">
        <Select v-model="searchCondition.newsType" style="width:200px">
          <Option v-for="item in newsTypes" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="显示标志：">
        <Select v-model="searchCondition.displaySign" style="width:200px">
          <Option value="-1">全部</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      </FormItem>
      <FormItem label="获取方式：">
        <Select v-model="searchCondition.obtainType" style="width:200px">
          <Option v-for="item in newsSources" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="20">
        <Button type="primary" @click="preSearch">查询</Button>
        <Button type="primary" @click="create">新增</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {newsTypes, newsSources} from './constant'

export default {
  data () {
    return {
      // 类别list
      newsTypes,
      // 获取方式列表
      newsSources,
      // 预警搜索条件
      searchCondition: {
        // 新闻名称
        newsTitle: '',
        // 类别
        newsType: '',
        // 标志
        displaySign: '',
        // 获取方式
        obtainType: ''
      },
      // 选择的类型名称
      typeName: '全部'
    }
  },
  methods: {
    // 打开新增弹窗
    create () {
      this.$emit('create')
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
