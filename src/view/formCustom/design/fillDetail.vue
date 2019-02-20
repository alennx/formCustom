<template>
    <Card :bordered="false" dis-hover>
        <div style="text-align:center">
            <Form ref="evalData" :model="formDetail" :label-width="80" class="clearfix">
                <Row :gutter="40">
                    <Col span="22">
                        <FormItem label="表单名称：">
                            <Input v-model="formDetail.form.formName" :disabled='disab' />
                        </FormItem>
                    </Col>
                    <Col span="22">
                        <FormItem label="表单类别：">
                            <Input v-model="formDetail.form.formType" :disabled='disab' />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="有效日期:">
                            <Input v-model="formDetail.form.startValidityTime" :disabled='disab' />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="到">
                            <Input v-model="formDetail.form.endValidityTime" :disabled='disab' />
                        </FormItem>
                    </Col>
                    <!-- <Col span="11">
                        <FormItem label="填写人：">
                            <Input v-model="formDetail.fillLog.userName" :disabled='disab' />
                        </FormItem>
                    </Col> -->
                    <Col span="11">
                        <FormItem label="填写时间：">
                            <Input v-model="formDetail.fillLog.fillTime" :disabled='disab' />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    </Card>
</template>

<script>
export default {
  props: {
    formDetail: {
      type: Object,
      default () {
        return {
          formName: '',
          formType: '',
          startValidityTime: '',
          endValidityTime: '',
          createUserName: '',
          createTime: ''
        }
      }
    },
    disab: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      evalData: {
        disabledGroup: ['苹果'],
        formName: '',
        formType: '',
        startValidityTime: '',
        endValidityTime: '',
        createUserName: '',
        createTime: ''
      }
    }
  },
  mounted () {
    console.log(this.formDetail)
  },
  methods: {
  },
  components: {
  },
  watch: {
    formDetail (curVal, oldVal) {
      console.log(curVal)
      console.log(oldVal)
    }
  }
}
</script>
<style>
</style>
