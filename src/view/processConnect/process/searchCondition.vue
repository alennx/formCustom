<template>
  <div>
    <Form
      ref="formValidate"
      inline
      :label-width="100"
      :model="searchCondition">
      <FormItem label="衔接名称：">
        <Input
          type="text"
          v-model="searchCondition.connectName">
        </Input>
      </FormItem>
      <FormItem label="启用状态：">
        <Select v-model="searchCondition.isUse" style="width:100px">
          <Option value="-1">全部</Option>
          <Option value="1">启用</Option>
          <Option value="2">禁用</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="20">
        <Button type="primary" @click="preSearch">查询</Button>
        <Button v-if="hasAddAuthority" type="primary" @click="create">新增</Button>
      </FormItem>
    </Form>
    <dealModal ref="dealModal" @on-ok="preSearch" />
  </div>
</template>

<script>
import dealModal from './dealModal.vue'
import {handleTypes} from './constant'
import {mapState} from 'vuex'
export default {
  components: {
    dealModal
  },
  data () {
    return {
      // 新增按钮权限
      hasAddAuthority: false,
      // 搜索条件
      searchCondition: {
        // 关键字
        connectName: '',
        // 启用状态
        isUse: '-1'
      },
      // 选择的类型名称
      typeName: '全部'
    }
  },
  computed: {
    ...mapState(['authButton'])
  },
  mounted () {
    const vm = this
    if (vm.authButton) {
      vm.authButton.map(item => {
        if (item === 'process_connect_add') {
          vm.hasAddAuthority = true
        }
      })
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
      vm.$emit('searchClick')
    },
    getCondition () {
      const vm = this
      return vm.searchCondition
    }
  }
}
</script>
