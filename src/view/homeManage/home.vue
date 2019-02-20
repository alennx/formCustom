<!-- 门户后台管理首页 -->
<template>
  <Content>
    <Breadcrumb>
      <BreadcrumbItem>数据概览</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-container">
        <div class="card-list">
          <Card>
            <div class="card-content">
              <p class="single-line">新闻累计条数：{{cardData.card0}}条</p>
            </div>
          </Card>
        </div>
        <div class="card-list">
          <Card>
            <div class="card-content">
              <p class="single-line">快速办理区：{{cardData.card1}}个</p>
            </div>
          </Card>
        </div>
        <div class="card-list">
          <Card>
            <div class="card-content">
              <p class="single-line">辅助办公区：{{cardData.card2}}个</p>
            </div>
          </Card>
        </div>
        <div class="card-list">
          <Card>
            <div class="card-content">
              <p class="single-line">应用集成区：{{cardData.card3}}个</p>
            </div>
          </Card>
        </div>
      </div>
      <Row type="flex" justify="space-between">
        <Col style="width: 100%">
          <chart-card title="皮肤使用统计">
            <chartPie ref="chart1" el="chart1" :lineOption="chart1Option">
              <div id="chart1" style="height: 340px;"></div>
            </chartPie>
          </chart-card>
        </Col>
        <!--<Col style="width: 49%">
          <chart-card title="风格使用统计">
            <chartPie ref="chart2" el="chart2" :lineOption="chart2Option">
              <div id="chart2" style="height: 340px;"></div>
            </chartPie>
          </chart-card>
        </Col>-->
        <Col style="width: 100%">
          <chart-card title="最近一年登录次数统计">
            <chartPie ref="chart3" el="chart3" :lineOption="chart3Option">
              <div id="chart3" style="height: 340px;"></div>
            </chartPie>
          </chart-card>
        </Col>
      </Row>
    </Card>
  </Content>
</template>

<script>
import api from '@/api/axiosApi'
import homeApiList from '@/api/homeApiList'
// echart图外层容器，包括卡片样式
import chartCard from '@/view/home/chartCard.vue'
import chartPie from '@/view/home/ChartPie.vue'
import {ringPie, basicLine} from '@/assets/js/echartOption'
export default {
  components: {
    chartCard,
    chartPie
  },
  data () {
    return {
      chart1Option: ringPie(),
      // chart2Option: simplePie(),
      chart3Option: basicLine(),
      cardData: {
        card0: 0,
        card1: 0,
        card2: 0,
        card3: 0
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 初始化
      this.drawChart1()
      // this.drawChart2()
      this.drawChart3()
      this.getCardData()
    },
    drawChart1 () {
      const vm = this
      api(homeApiList.styleStatistical)
        .then(res => {
          if (res.data) {
            const data = res.data.data
            vm.chart1Option.color = data.colorList
            vm.chart1Option.title.show = false
            vm.chart1Option.legend.data = data.nameList
            vm.chart1Option.series[0].name = '皮肤使用统计'
            vm.chart1Option.series[0].data = data.numList
            vm.$refs.chart1.refresh()
          }
        }, err => { console.log(err) })
    },
    /* drawChart2 () {
      const vm = this
      api(homeApiList.remplateStatistical)
        .then(res => {
          if (res.data) {
            const data = res.data.data
            vm.chart2Option.color = data.colorList
            vm.chart2Option.legend.data = data.nameList
            vm.chart2Option.series[0].name = '风格使用统计'
            vm.chart2Option.series[0].data = data.numList
            vm.$refs.chart2.refresh()
          }
        }, err => { console.log(err) })
    }, */
    drawChart3 () {
      const vm = this
      api(homeApiList.loginLogsStatistical)
        .then(res => {
          if (res.data) {
            vm.chart3Option.xAxis.data = res.data.data.yearMonth
            vm.chart3Option.series[0].data = res.data.data.num
            vm.$refs.chart3.refresh()
          }
        }, err => { console.log(err) })
    },
    getCardData () {
      const vm = this
      api(homeApiList.newsStatistical)
        .then(res => {
          if (res.data) {
            const data = res.data.data
            vm.cardData.card0 = data.num
          }
        }, err => { console.log(err) })

      api(homeApiList.regionStatistical)
        .then(res => {
          if (res.data) {
            const data = res.data.data
            data.map(item => {
              vm.cardData[`card${item.type}`] = item.num
            })
          }
        }, err => { console.log(err) })
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
      .single-line{
        line-height: 42px;
      }
    }
  }
}
</style>
