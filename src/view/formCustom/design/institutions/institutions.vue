<template>
  <Content>
    <Select v-if="type === 'userModal'" v-model="user" multiple filterable style="width:100%">
      <Option v-for="(item, index) in userData" :key="index" :value="item.name" :label="item.name">
        <span>{{ item.name }}</span>
        <span style="float:right;color:#ccc">{{ item.unit }}</span>
      </Option>
    </Select>
    <Select v-if="type === 'unitModal'" v-model="unit" multiple filterable style="width:100%">
      <Option v-for="(item, index) in unitData" :key="index" :value="item.unit" :label="item.unit"></Option>
    </Select>
  </Content>
</template>

<script>
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
export default {
  props: {
    user: {
      type: Array,
      default: []
    },
    unit: {
      type: Array,
      default: []
    },
    type: {
      type: String,
      default: 'userModal'
    }
  },
  data () {
    return {
      userData: [],
      unitData: [],
      userList: [],
      unitList: []
    }
  },
  mounted () {
    console.log(this.type)
    console.log(this.user)
    this.getUnit()
  },
  methods: {
    getUnit () {
      api(formApiList.getUnit).then(res => {
        if (res.data.errcode === 0) {
          this.unitCount(res.data.data)
          this.userCount(res.data.data)
        }
      }, error => { console.log(error) })
    },
    userCount (data) { // 用户数组计算
      data.forEach(item => {
        item.emps.forEach(items => {
          let obj = {}
          obj.name = items.name
          obj.unit = item.name
          this.userData.push(obj)
        })
      })
    },
    unitCount (data) {
      data.forEach(item => {
        let obj = {}
        obj.unit = item.name
        this.unitData.push(obj)
      })
    }
  },
  watch: {
    user(val) {
      console.log("测试")
      this.userList = val
    },
    userList(val) {
      console.log(val)
      this.$emit("userListChange",val);
    },
    unit(val) {
      console.log(val);
      this.unitList = val
    },
    unitList(val) {
      console.log(val)
      this.$emit("unitListChange",val);
    },
  },
}
</script>

<style>

</style>
