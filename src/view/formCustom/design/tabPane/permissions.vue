<template>
  <Card :bordered="false" dis-hover>
    <div>
      <Form ref="formDetail" :label-width="100" class="clearfix">
        <Row :gutter="40">
          <Col span="22">
            <FormItem label="授权人员：" prop="name">
               <Row>
                  <Col span="18">
                    <Card>
                      <p slot="title">选中名单</p>
                      <!-- <p v-for="item in permissionsData" :key="item.id">{{ item.label }}</p> -->
                      <p v-for="item in permissionsData" :key="item.gxqptEmpId">{{ item.label }}</p>
                    </Card>
                  </Col>
                  <Col span="4" offset="1">
                    <Button @click="openModal">选择</Button>
                  </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Modal v-model="treeModal" title="选择人员" @on-ok="cancel"  @on-cancel="cancel" width="60%">
        <div class="layout">
          <Layout>
            <Sider style="width:50%;min-width:50%;max-width:50%;height:500px;overflow-y:scroll;" hide-trigger>
              <Input placeholder="输入关键字进行过滤" v-model="filterTree"/>
              <el-tree
                class="filter-tree"
                show-checkbox
                node-key="gxqptEmpId"
                :data="treeData"
                :props="defaultProps"
                :default-checked-keys="defaultCheckedKeys"
                :default-expanded-keys="defaultCheckedKeys"
                :filter-node-method="filterNode"
                @check="getCheck"
                ref="tree">
              </el-tree>
            </Sider>
            <Layout style="width:50%;min-width:50%;max-width:50%;background:#fff;padding:0 0 0 20px;">
              <Row>
                <Col span="22">
                  <Card>
                    <p slot="title">选中名单</p>
                    <p v-for="item in checkData" :key="item.gxqptEmpId">{{ item.label }}</p>
                  </Card>
                </Col>
              </Row>
            </Layout>
          </Layout>
        </div>
        <div slot="footer">
          <Button class="modalBtn" type="primary" @click="sumbit" size="large">确定</Button>
          <Button class="modalBtn" type="default" @click="cancel" size="large">关闭</Button>
        </div>
      </Modal>
    </div>
  </Card>
</template>

<script>
import api from '@/api/axiosApi'
import comApiList from '@/api/comApiList'
export default {
  props: {
    permissionsData: {
      type: Array,
      default () {
        return []
      }
    },
    defaultCheckedKeys: { // 默认树状图checkout显示
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      treeModal: false,
      filterTree: '', // 树形图筛选input
      treeData: [],
      checkData: this.permissionsData || [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    console.log('权限')
  },
  methods: {
    findDpmAndEmpToTreeByLogin () {
      api(comApiList.findDpmAndEmpToTreeByLogin).then(res => {
        if (res.data.errcode === 0) {
          let data = JSON.stringify(res.data.data).replace(new RegExp('"list":', 'g'), '"children":')
          this.treeData = JSON.parse(data.replace(new RegExp('"name":', 'g'), '"label":'))
          this.permissionsData.forEach(item => {
            this.defaultCheckedKeys.push(item.gxqptEmpId)
          })
          this.checkData = JSON.parse(JSON.stringify(this.permissionsData))
        }
      }, error => { this.$Message.error(error) })
    },
    getCheck (val, data) {
      let arr = []
      data.checkedNodes.forEach(item => {
        if (!item.children) {
          arr.push(item)
        }
      })
      this.checkData = arr
    },
    filterNode (value, data) { // 树状过滤
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    openModal () {
      this.findDpmAndEmpToTreeByLogin()
      this.treeModal = true
    },
    sumbit () {
      this.$emit('getData', this.checkData)
      this.cancel()
    },
    cancel () {
      this.treeModal = false
    },
    getForm () {
      return this.checkData
    }
  },
  components: {},
  watch: {
    filterTree (val) {
      this.$refs.tree.filter(val)
    },
    permissionsData: { // 监听表单类型为判断情况下的表单字段列表内容
      handler (newValue, oldValue) {
        if (oldValue !== newValue) {
          this.checkData = newValue
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
  border: none;
}
/deep/.ivu-layout {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
/deep/.ivu-modal-body{
  height:500px;
  overflow-y: scroll;
}
</style>
