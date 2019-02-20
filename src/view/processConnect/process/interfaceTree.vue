<template>
  <Row>
    <Col span="20" offset="2">
      <Tree ref="tree" :data="treeData" empty-text="无数据"></Tree>
    </Col>
  </Row>
</template>

<script>
export default {
  data () {
    return {
      treeData: []
    }
  },
  methods: {
    // 获取选择的项目
    getSelection () {
      const vm = this
      const obj = vm.$refs.tree.getSelectedNodes()
      return obj
    },
    // 根据数据更新树结构
    refresh (data = []) {
      const vm = this
      vm.treeData = data
    }
  }
}
</script>
