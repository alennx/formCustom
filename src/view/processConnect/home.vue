<!-- 表单定制首页 -->
<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>数据概览</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <div class="card-container">
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>接口总条数：{{homeData.interfaceTotal}}条</p>
                <p>当月新增接口条数：{{homeData.interfaceAdd}}条</p>
              </div>
            </Card>
          </div>
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>流程衔接总条数：{{homeData.flowTotal}}条</p>
                <p>当月新增流程衔接条数：{{homeData.flowAdd}}条</p>
              </div>
            </Card>
          </div>
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>流程衔接启用条数：{{homeData.useCount}}条</p>
                <p>流程衔接禁用条数：{{homeData.noUseCount}}条</p>
              </div>
            </Card>
          </div>
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>流程调用成功条数：{{homeData.sucessCount}}条</p>
                <p>流程调用失败条数 ：{{homeData.failCount}}条</p>
              </div>
            </Card>
          </div>
        </div>
        <Row type="flex" justify="space-between">
          <Col style="width: 49%">
            <chart-card title="流程衔接启用状态统计">
              <chartPie ref="formTypeStatic" el="formTypeStatic" :lineOption="formTypeStatic">
                <div id="formTypeStatic" style="height: 500px;"></div>
              </chartPie>
            </chart-card>
          </Col>
          <Col style="width: 49%">
            <chart-card title="最近半年新增流程衔接数量统计">
              <chartPie ref="halfYearAddForm" el="halfYearAddForm" :lineOption="halfYearAddForm">
                <div id="halfYearAddForm" style="height: 500px;"></div>
              </chartPie>
            </chart-card>
          </Col>
          <Col style="width: 100%">
            <Select v-model="connectId" @on-change="selectConnect" class="connecSel">
              <Option v-for="item in connectName" :value="item.id" :key="item.id">{{ item.connectName }}</Option>
            </Select>
            <label class="connecTitle">衔接名称：</label>
            <chart-card title="最近一年流程调用统计">
              <chartPie ref="formStaticYear" el="formStaticYear" :lineOption="formStaticYear">
                <div id="formStaticYear" style="height: 500px;"></div>
              </chartPie>
            </chart-card>
          </Col>
        </Row>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import processApiList from '@/api/processApiList'
// echart图外层容器，包括卡片样式
import chartCard from '@/view/home/chartCard.vue'
import chartPie from '@/view/home/ChartPie.vue'
import {ringPie, areaLine, basicLine} from '@/assets/js/echartOption'
export default {
  components: {
    chartCard,
    chartPie
  },
  data () {
    return {
      formTypeStatic: ringPie(),
      halfYearAddForm: areaLine(),
      formStaticYear: basicLine(),
      homeData: {
        noUseCount: 0,
        useCount: 0
      },
      halYearData: {},
      connectId: '',
      connectName: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 初始化
      this.getDatabaseType()
      this.gethalfYearAddForm()
      this.getformStaticYear()
      this.findInterfaceCount()
      this.findConnectName()
    },
    getDatabaseType (legendName, dataVal) { // 流程衔接启用状态统计
      this.formTypeStatic.title.text = '流程衔接启用状态统计'
      this.formTypeStatic.legend.data = ['禁用', '启用']
      this.formTypeStatic.series[0].name = '流程衔接启用状态'
      let numList = [
        { value: this.homeData.noUseCount, name: '禁用' },
        { value: this.homeData.useCount, name: '启用' }
      ]
      this.formTypeStatic.series[0].data = numList
      this.$refs.formTypeStatic.refresh()
    },
    gethalfYearAddForm () {
      const vm = this
      api(processApiList.findMonthConnectCount)
        .then(res => {
          if (res.data.errmsg === 'ok') {
            vm.halYearData = res.data.data
            let xData = []
            let seriesData = []
            vm.halYearData.map(x => {
              xData.push(x.month)
              seriesData.push(x.count)
            })
            vm.halfYearAddForm.series[0].name = '新增流程'
            vm.halfYearAddForm.xAxis.data = xData
            vm.halfYearAddForm.series[0].data = seriesData
          }
          this.$refs.halfYearAddForm.refresh()
        }, err => { console.log(err) })
    },
    getformStaticYear () {
      const vm = this
      let data = {connectId: Number(vm.connectId)}
      api(processApiList.findConnectInfoCount, data)
        .then(res => {
          if (res.data.errmsg === 'ok') {
            let staticYearData = res.data.data
            let xData = []
            let seriesData = []
            staticYearData.map(x => {
              xData.push(x.month)
              seriesData.push(x.count)
            })
            vm.formStaticYear.series[0].name = '流程调用'
            vm.formStaticYear.xAxis.data = xData
            vm.formStaticYear.series[0].data = seriesData
          }
          vm.$refs.formStaticYear.refresh()
        }, err => { console.log(err) })
    },
    findInterfaceCount () { // 接口、流程衔接、流程衔接状态、流程调用条数
      const vm = this
      api(processApiList.findInterfaceCount)
        .then(res => {
          if (res.data.errmsg === 'ok') {
            vm.homeData = res.data.data
          }
        }, err => { console.log(err) })
    },
    findConnectName () { // 查询衔接名称列表
      const vm = this
      api(processApiList.findConnectName)
        .then(res => {
          if (res.data.errmsg === 'ok') {
            vm.connectName = res.data.data
            vm.connectId = res.data.data[0].id
            vm.getformStaticYear()
          }
        }, err => { console.log(err) })
    },
    selectConnect (val) { // 衔接名称改变
      const vm = this
      vm.connectId = val
      vm.getformStaticYear()
    }
  },
  watch: {
    homeData: function (val, oldVal) {
      this.getDatabaseType() // 流程衔接启用状态统计
    }
  }
}
</script>

<style lang="less" scoped>
.card-container{
  &:after{
    content: '';
    clear: both;
    display: block;
  }
  .card-list{
    float: left;
    width: 22%;
    margin-left: 4%;
    text-align: center;
    &:nth-child(1){
      margin-left: 0;
    }
    .card-content{
      display: inline-block;
      text-align: left;
      font-size: 14px;
      height: 42px;
    }
  }
}
.connecSel{
  width: 200px;
  float: right;
}
.connecTitle{
  float: right;
  margin-top: 6px;
}
</style>
