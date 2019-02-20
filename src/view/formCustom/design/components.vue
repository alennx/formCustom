<template>
    <section>
        <div style="border:1px solid #ccc">
            <h3 style="width:100%;height:50px;line-height:50px;text-align:center;border-bottom:1px solid #ccc;">元素库</h3>
            <ul class="components-list iview-ui">
                <li draggable="true" @click="exec('formDatePicker')" >
                    日期控件
                </li>
                <li draggable="true" @click="exec('text')">
                    单行文本
                </li>
                <li draggable="true" @click="exec('textarea')">
                    多行文本
                </li>
                <li draggable="true" @click="exec('radios')">
                    单选框
                </li>
                <li draggable="true" @click="exec('select')">
                    下拉列表
                </li>
                <li draggable="true" @click="exec('checkboxs')">
                    复选框
                </li>
                <li draggable="true" @click="exec('user')">
                    选择用户
                </li>
                <li draggable="true" @click="exec('unit')">
                    选择单位
                </li>
            </ul>
        </div>
    </section>
</template>
<script>
export default {
  name: 'components',
  data () {
    return {}
  },
  mounted () {},
  methods: {
    exec (t) {
      this.$emit('getType', t)
    }
  },
  computed: {
    activeUI: {
      get () {
        return this.$store.state.activeUI
      },
      set (val) {
        this.$store.commit('setState', {
          activeUI: val
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.components-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

// .components-list * {
//   cursor: move !important;
// }

.components-list > li {
  min-height: 36px;
  font-size: 18px;
  -webkit-user-select: none;
  transform: scale(0.7) translateX(-15%);
  padding-bottom: 10px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1) translateX(5%);
  }
  i {
    vertical-align: middle;
  }
}

.components-list.iview-ui > li {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #ccc;
  height: 80px;
  line-height: 80px;
  transform: scale(1) translateX(0);
  &:hover {
    // transform: scale(1)translateX(0);
  }
}
</style>
