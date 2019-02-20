<!-- 线图 -->
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    lineOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    el: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    refresh () {
      const vm = this
      const option = {
        title: {
          text: vm.title
        },
        series: [{
          type: 'pie'
        }],
        ...vm.lineOption
      }
      const line = vm.$echarts.init(document.getElementById(vm.el))
      line.setOption(option)
    }
  }
}
</script>
