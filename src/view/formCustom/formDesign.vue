<template>
    <Layout>
        <Row class="main-content">
            <Col span="4"><!-- 组件栏 -->
                <components @getType="pullUe" ref="components" />
            </Col>
            <Col span="16">
              <Breadcrumb>
                <BreadcrumbItem>表单设计</BreadcrumbItem>
                <BreadcrumbItem>{{ title }}</BreadcrumbItem>
              </Breadcrumb>
              <Card>
                <Form ref="formValidate" inline :label-width="110">
                  <FormItem :label-width="20">
                    <Button type="primary" @click="goback(-1)">上一步</Button>
                    <Button type="primary" @click="preview">预览</Button>
                    <Button type="primary" @click="save(0)">保存</Button>
                    <Button type="primary" @click="save(1)">提交</Button>
                    <Button type="primary" @click="goback">取消</Button>
                  </FormItem>
                </Form>
                  <UE v-on:editorUpdate="editorUpdate" :formData="formData" :defaultMsg="defaultMsg" :config="config" :id="ue1" ref="ue"></UE>
              </Card>
            </Col>
        </Row>
    </Layout>
</template>

<script>
import UE from '@/components/ue/ue'
import components from './design/components'
export default {
  data () {
    return {
      // defaultMsg: '<p><input name="data_1" type="text" title="datab" value="" plugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/></p><p><textarea title="datac" name="data_2" plugins="textarea" value="" orgrich="0" orgfontsize="" orgwidth="300" orgheight="80" style="width:300px;height:80px;"></textarea></p><p>{|-<span plugins="radios" name="data_3" title="datad"><input type="radio" name="data_3" value="1"  />1&nbsp;<input type="radio" name="data_3" value="2"  />2&nbsp;</span>-|}</p><p>{|-<span plugins="select"><select name="data_4" title="datae" formplugins="select" size="1" orgwidth="150" style="width: 150px;"><option value="11">11</option><option value="22">22</option></select>&nbsp;&nbsp;</span>-|}</p><p>{|-<span plugins="checkboxs"  title="dataf"><input type="checkbox" name="data_5" value="33" fieldname="undefinedundefined" fieldflow="undefined" />33&nbsp;<input type="checkbox" name="data_6" value="44" fieldname="undefinedundefined" fieldflow="undefined" />44&nbsp;</span>-|}</p><p>datePicker</p><p>这里是文字&nbsp;</p><table><tbody><tr class="firstRow"><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td></tr><tr><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td></tr><tr><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td><td width="121" valign="top"><br/></td></tr></tbody></table><p><br/></p>',
      defaultMsg: this.$store.state.parse,
      upgradeConent: '',
      formData: {},
      title: '',
      formModal: false,
      formDetail: {
        type: 1
      },
      config: {
        // allowDivTransToP: false,// 阻止转换div 为p
        tool: true, // 是否显示，设计器的 toolbars
        textarea: 'design_content',
        // 这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: [[
          'fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink', '|', 'horizontal', 'spechars', 'wordimage', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells']],
        // focus时自动清空初始化时的内容
        // autoClearinitialContent:true,
        // 关闭字数统计
        wordCount: false,
        // 关闭elementPath
        elementPathEnabled: true,
        // 默认的编辑区域高度
        initialFrameHeight: 550
        // iframeCssUrl:"css/bootstrap/css/bootstrap.css" // 引入自身 css使编辑器兼容你网站css
        // 更多其他参数，请参考ueditor.config.js中的配置项
      },
      ue1: 'formDesign' // 不同编辑器必须不同的id
    }
  },
  mounted () {
    console.log(this.$route.params.formData)
    if (this.$route.params.formData) {
      this.$store.state.formData = this.$route.params.formData
      this.$store.state.formItemType = this.$route.params.type
    }
    if (this.$store.state.formData.type === 'copy') {
      this.defaultMsg = this.$store.state.formData.originalHtml
    }
    this.formData = this.$store.state.formData
    this.title = this.$store.state.formData.formName
  },
  methods: {
    editorUpdate (dataString) {
      this.upgradeConent = dataString
    },
    pullUe (t) {
      this.$refs.ue.exec(t)
    },
    goback (n) { // 返回
      if (n === -1) {
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'formDesignMgr'
        })
      }
    },
    preview () { // 预览
      this.$refs.ue.fnCheckForm('preview')
    },
    save (type) { // 保存
      this.$refs.ue.fnCheckForm(type, this.$store.state.formItemType)
    }
  },
  components: {
    components,
    UE
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-layout{
  background: #fff
}
</style>
