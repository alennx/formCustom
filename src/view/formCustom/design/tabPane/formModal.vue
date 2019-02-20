<template>
  <Card :bordered="false">
    <div>
      <hy-table ref="selection" :data="tableData" :columns="columns" show-sizer show-elevator :needPage='false'/>
    </div>
  </Card>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    disab: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const arr = {'只读': 'r', '可写': 'w', '隐藏': 'n'}
    const obj = {'n': '隐藏', 'r': '只读', 'w': '可写'}
    const fieldTypeList = {'text': '文本框', 'textarea': '多行文本框', 'radios': '单选框', 'select': '下拉框', 'checkboxs': '多选框', 'datePicker': '时间选择器', 'Unit': '单位组件', 'User': '用户组件'}
    return {
      total: {},
      columns: [
        {
          title: '字段名称',
          key: 'fieldName',
          render: (h, params) => {
            return h('span', params.row.fieldName.slice(2))
          }
        },
        {
          title: '控件类型',
          key: 'fieldPlugins',
          render: (h, params) => {
            return h('span', fieldTypeList[params.row.fieldPlugins])
          }
        },
        {
          title: '操作字段',
          key: 'act',
          align: 'center',
          width: 300,
          render: (h, params) => {
            const switchs = h('RadioGroup',
              {
                props: {
                  value: obj[params.row.checkItem]
                },
                on: {
                  'on-change': (val) => {
                    // this.total[params.row.id] = arr[val]
                    this.tableData[params.index].checkItem = arr[val]
                  }
                }
              }, [h('Radio', {
                props: {
                  label: '隐藏'
                }
              }), h('Radio', {
                props: {
                  label: '只读'
                }
              }), h('Radio', {
                props: {
                  label: '可写'
                }
              })
              ]
            )
            return h('div', [switchs])
          }
        }
      ],
      data: []
    }
  },
  mounted () {
    console.log(this.formDetail)
  },
  methods: {
    getForm () {
      this.tableData.forEach(item => {
        if (item.checkItem !== 'w') {
          this.total[item.id] = item.checkItem
        }
      })
      console.log(this.total)
      return this.total
    }
  },
  components: {},
  watch: {
    tableData: {
      handler (newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i] !== newValue[i]) {
            this.total = {}
            console.log(newValue)
          }
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ input[type="text"]{
  height:32px;
}
</style>
