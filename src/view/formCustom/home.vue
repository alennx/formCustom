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
                <p>表单总条数：{{ overView.total }}条</p>
                <p>当月新增表单条数：{{ overView.mincrement }}条</p>
              </div>
            </Card>
          </div>
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>当前有效表单条数：{{ overView.valid }}条</p>
                <p>当前失效表单条数：{{ overView.invalid }}条</p>
              </div>
            </Card>
          </div>
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>表单填报总条数：{{ overView.fill_total }}条</p>
                <p>当月表单填报条数：{{ overView.fill_num_month }}条</p>
              </div>
            </Card>
          </div>
          <div class="card-list">
            <Card>
              <div class="card-content">
                <p>表单填报已同意条数：{{ overView.aggreed }}条</p>
                <p>表单填报已拒绝条数：{{ overView.refused }}条</p>
              </div>
            </Card>
          </div>
        </div>
        <Row type="flex" justify="space-between">
          <Col style="width: 49%">
            <chart-card title="表单类别统计">
              <chartPie ref="formTypeStatic" el="formTypeStatic" :lineOption="formTypeStatic">
                <div id="formTypeStatic" style="height: 500px;"></div>
              </chartPie>
            </chart-card>
          </Col>
          <Col style="width: 49%">
            <chart-card title="最近半年新增表单数量统计">
              <chartPie ref="halfYearAddForm" el="halfYearAddForm" :lineOption="halfYearAddForm">
                <div id="halfYearAddForm" style="height: 500px;"></div>
              </chartPie>
            </chart-card>
          </Col>
          <Col style="width: 100%">
            <chart-card title="最近一年表单填报数量统计">
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
import formApiList from '@/api/formApiList'
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
      overView: {
        total: '',
        mincrement: '',
        valid: '',
        invalid: '',
        fill_total: '',
        fill_num_month: '',
        aggreed: '',
        refused: ''
      },
      formTypeArr2: ['申请类', '审批类', '查询类'],
      formTypeStatic: ringPie(),
      halfYearAddForm: areaLine(),
      formStaticYear: basicLine()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 初始化
      this.getFormStatisticForFirstPage()
      this.getFormTypeStatistic()
      this.getIncrementForLastSixMonth()
      this.getFillInFormForLastTwelveMonth()
    },
    getFormStatisticForFirstPage () { // 表单定制系统首页数据概览统计结果获取
      api(formApiList.getFormStatisticForFirstPage).then(res => {
        if (res.data.errcode === 0) {
          this.overView = {
            total: res.data.data.total,
            mincrement: res.data.data.mincrement,
            valid: res.data.data.valid,
            invalid: res.data.data.invalid,
            fill_total: res.data.data.fill_total,
            fill_num_month: res.data.data.fill_num_month,
            aggreed: res.data.data.aggreed,
            refused: res.data.data.refused
          }
        }
      }, error => { console.log(error) })
    },
    getFormTypeStatistic () { // 表单类别统计结果获取
      api(formApiList.getFormTypeStatistic).then(res => {
        if (res.data.errcode === 0) {
          let legendName = []
          let dataVal = []
          res.data.data.forEach(item => {
            legendName.push(this.formTypeArr2[parseInt(item.type) - 1])
            dataVal.push({value: item.num, name: this.formTypeArr2[parseInt(item.type) - 1]})
          })
          this.getDatabaseType(legendName, dataVal)
        }
      }, error => { console.log(error) })
    },
    getIncrementForLastSixMonth () { // 获取最近六个月新增表单数据统计结果
      api(formApiList.getIncrementForLastSixMonth).then(res => {
        if (res.data.errcode === 0) {
          let legendName = []
          let dataVal = []
          res.data.data.forEach(item => {
            legendName.push(item.dateRange)
            dataVal.push(item.num)
          })
          this.gethalfYearAddForm(legendName, dataVal)
        }
      }, error => { console.log(error) })
    },
    getFillInFormForLastTwelveMonth () { // 获取最近12个月表单填报数量统计结果
      api(formApiList.getFillInFormForLastTwelveMonth).then(res => {
        if (res.data.errcode === 0) {
          let legendName = []
          let dataVal = []
          res.data.data.forEach(item => {
            legendName.push(item.dateRange)
            dataVal.push(item.num)
          })
          this.getformStaticYear(legendName, dataVal)
        }
      }, error => { console.log(error) })
    },
    getDatabaseType (legendName, dataVal) {
      this.formTypeStatic.title.text = '各部门计算资源占比统计'
      this.formTypeStatic.legend.data = legendName
      this.formTypeStatic.series[0].data = dataVal
      this.$refs.formTypeStatic.refresh()
    },
    gethalfYearAddForm (legendName, dataVal) {
      this.halfYearAddForm.xAxis.data = legendName
      this.halfYearAddForm.series[0].data = dataVal
      this.halfYearAddForm.series[0].name = '新增表单'
      this.$refs.halfYearAddForm.refresh()
    },
    getformStaticYear (legendName, dataVal) {
      this.formStaticYear.xAxis.data = legendName
      this.formStaticYear.series[0].data = dataVal
      this.formStaticYear.series[0].name = '表单填报'
      this.$refs.formStaticYear.refresh()
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
</style>
