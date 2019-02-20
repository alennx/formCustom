<template>
  <div class="ivu-form-item-content">
    <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type">
      <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
      <input autocomplete="off" spellcheck="false" type="number" placeholder="" class="ivu-input ivu-input-default" :value="value" @input="valueChange">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: ''
  },
  methods: {
    valueChange (val) {
      this.$emit('input', val.target.value)
    }
  }
}
</script>
