<template>
  <div>
    <script :id='id' type="text/plain"></script>
    <form method="post" id="saveform" name="saveform" action="/index.php?s=/index/parse.html"></form>
    <Modal v-model="formModal" title="预览页面" width="60%">
      <preview ref="preview" :parse_form="formDetail"></preview>
      <div slot="footer">
        <Button class="modalBtn" type="default" @click="formModal = false" size="large">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
/* eslint-disable */
import '@static/ueditor/formdesign/formdesign.v4.js'
import api from '@/api/axiosApi'
import formApiList from '@/api/formApiList'
import preview from '@/view/formCustom/design/preview' // 预览组件
export default {
  name: 'UE',
  data () {
    return {
      editor: null,
      formModal: false,
      formDetail: {
        type: 1
      }
    }
  },
  props: {
    defaultMsg: {
      type: String
    },
    config: {
      type: Object
    },
    id: {
      type: String
    },
    formData: {
      type: Object,
      default: {}
    }
  },
  mounted () {
    const _this = this
    // _this.setReview()
    this.editor = UE.getEditor(this.id, this.config) // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
    UE.registerUI('uploadimg', function (editor, uiName) {
      // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
      editor.registerCommand(uiName, {
        execCommand: function () {
          alert('execCommand:' + uiName)
        }
      })
      // 创建一个button
      var uploadimg = new UE.ui.Button({
        // 按钮的名字
        name: 'uploadimg',
        // 提示
        title: '图片上传',
        // 添加额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -380px 0px;',
        // 点击时执行的命令
        onclick: function () {
          // 这里可以不用执行命令,做你自己的操作也可
          // editor.execCommand(uiName);

          $('#uploader1 .webuploader-element-invisible').click()
        }
      })
      // 当点到编辑内容上时，按钮要做的状态反射
      editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
          uploadimg.setDisabled(true);
          uploadimg.setChecked(false);
        } else {
          uploadimg.setDisabled(false);
          uploadimg.setChecked(state);
        }
      })
      // 因为你是添加button,所以需要返回这个button
      return uploadimg
    });
    UE.registerUI('uploadfiles', function (editor, uiName) {
      // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
      editor.registerCommand(uiName, {
        execCommand: function () {
          alert('execCommand:' + uiName)
        }
      })
      // 创建一个button
      var uploadfiles = new UE.ui.Button({
        // 按钮的名字
        name: "uploadfiles",
        // 提示
        title: "附件上传",
        // 添加额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -620px -40px;',
        // 点击时执行的命令
        onclick: function () {
          // 这里可以不用执行命令,做你自己的操作也可
          // editor.execCommand(uiName);
          $("#filePicker1 .webuploader-element-invisible").click();
        }
      })
      // 当点到编辑内容上时，按钮要做的状态反射
      editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
          uploadfiles.setDisabled(true);
          uploadfiles.setChecked(false);
        } else {
          uploadfiles.setDisabled(false);
          uploadfiles.setChecked(state);
        }
      })
      // 因为你是添加button,所以需要返回这个button
      return uploadfiles
    });
    UE.registerUI('button_preview',function(editor,uiName){
      if(!this.options.tool)
      {
          return false;
      }
      //注册按钮执行时的command命令，使用命令默认就会带有回退操作
      editor.registerCommand(uiName,{
          execCommand:function(){
              try {
                  _this.fnReview();
              } catch ( e ) {
                console.log(e)
                  alert('FormDesign.fnReview 预览异常');
              }
          }
      });
      //创建一个button
      var btn = new UE.ui.Button({
          //按钮的名字
          name:uiName,
          //提示
          title:"预览",
          //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
          cssRules :'background-position: -420px -19px;',
          //点击时执行的命令
          onclick:function () {
              //这里可以不用执行命令,做你自己的操作也可
            editor.execCommand(uiName);
          }
      });

      //因为你是添加button,所以需要返回这个button
      return btn;
    });
    UE.registerUI('button_save',function(editor,uiName){
        if(!this.options.tool)
        {
            return false;
        }
        //注册按钮执行时的command命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName,{
            execCommand:function(){
                try {
                    _this.fnCheckForm('save');
                } catch ( e ) {
                    alert('FormDesign.fnCheckForm("save") 保存异常');
                }
                
            }
        });
        //创建一个button
        var btn = new UE.ui.Button({
            //按钮的名字
            name:uiName,
            //提示
            title:"保存表单",
            //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
            cssRules :'background-position: -481px -20px;',
            //点击时执行的命令
            onclick:function () {
                //这里可以不用执行命令,做你自己的操作也可
              editor.execCommand(uiName);
            }
        });

        //因为你是添加button,所以需要返回这个button
        return btn;
    });
    UE.getEditor(this.id).addListener('blur',function (editor){
      _this.$emit('editorUpdate',_this.getUEContent())
    })
  },
  destroyed() {
    this.editor.destroy();
  },
  methods: {
    exec (method) { // 设定调用组件方法
      switch (method) {
        case 'formDatePicker':
          this.editor.execCommand('insertHtml', '{- datePicker -}');
          break;
        case 'unit':
          this.editor.execCommand('insertHtml', '{- Unit -}');
          break;
        case 'user':
          this.editor.execCommand('insertHtml', '{- User -}');
          break;
        default:
          this.editor.execCommand(method)
          break;
      }
      // if(method === 'formDatePicker'){
      //   console.log("进来")
      //   this.editor.execCommand('insertHtml', 'datePicker');
      //   // this.editor.execCommand('insertHtml', '<a name="datePicker" style="width:60px;height:60px;" @click="getUserAll">日期</a>');
      // }else{
      //   this.editor.execCommand(method)
      // }
    },
    fnReview: function () {
      console.log(this.editor)
      if (this.editor.queryCommandState('source')){
         this.editor.execCommand('source');/*切换到编辑模式才提交，否则部分浏览器有bug*/
      }
      if (this.editor.hasContents()) {
        this.editor.sync();       /*同步内容*/
        alert("你点击了预览,请自行处理....");
        // return false;
        //--------------以下仅参考-------------------------------------------------------------------
        /*设计form的target 然后提交至一个新的窗口进行预览*/
        document.saveform.target = "mywin";
        window.open('', 'mywin', "menubar=0,toolbar=0,status=0,resizable=1,left=0,top=0,scrollbars=1,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50) + "\"");
        document.saveform.action = "gaxq-formCustom#/formDesign/preview";
        document.saveform.submit(); //提交表单
      } else {
        alert('表单内容不能为空！');
        return false;
      }
    },
     fnCheckForm (type, formItemType) {
        if (this.editor.queryCommandState('source'))
            this.editor.execCommand('source');//切换到编辑模式才提交，否则有bug

        if (this.editor.hasContents()) {
            this.editor.sync();/*同步内容*/

            // alert("你点击了保存,这里可以异步提交，请自行处理....");
            // return false;
            //--------------以下仅参考-----------------------------------------------------------------------------------------------------
            var type_value = '', formid = 0, fields = $("#fields").val(), formeditor = '';

            if (typeof type !== 'undefined') {
                type_value = type;
            }
            //获取表单设计器里的内容
            formeditor = this.editor.getContent();
            //解析表单设计器控件
            var parse_form = ''
            parse_form = this.parse_form(formeditor, fields);
            this.$store.state.parse = JSON.parse(parse_form).template // 保存已修改的template
            let formJSON = JSON.parse(parse_form);
            if(type !== 'preview'){
              let fieldList = [];
              formJSON.data.forEach(item=>{
                let obj = {};
                if(!item.orghide)item.orghide='0';
                (item.orghide == '0') ? obj.fieldFlow = true : obj.fieldFlow = false;
                obj.fieldName = "f_" + item.title; // 字段名称name
                obj.fieldPlugins = item.plugins; // 字段插件
                obj.fieldTitle = item.value; // 字段内容
                obj.fieldType = item.type || ''; // 字段类型
                fieldList.push(obj);
              })
              let url = '';
              if(formItemType === 0){ // 判断是否为保存或修改
                this.formData.id = 0;
                url = formApiList.saveFormDesign
              } else {
                url = formApiList.updateFormDesign
              }
              let nameArr = []
              for (let i = 0; i< fieldList.length; i++) {
                nameArr.push(fieldList[i].fieldName)
              }
              if((new Set(nameArr)).size != nameArr.length){ // 判断是否有重复值
                this.$Message.error('表单中组件name不能为重复值，请检查修改后重试！')
              } else {
                let data = {
                  "endValidityTime": this.formData.ValidityTime[1],
                  "fieldList": fieldList,
                  "fieldSum": fieldList.length, // 字段数量
                  "formName": this.formData.formName,
                  "formType": this.formData.formType,
                  "fromDescribe": this.formData.fromDescribe,
                  "id": this.formData.id,
                  "originalHtml": formJSON.template,
                  "parseHtml": formJSON.parse,
                  "startValidityTime": this.formData.ValidityTime[0],
                  "status": type_value
                }
                console.log(data)
                // 异步提交数据
                api(url, data).then(res => {
                  if (res.data.errcode === 0) {
                    if (res.data.errmsg === 'ok') {
                      if (type_value === 0 ){
                        this.$Message.success('保存成功！！')
                        this.$router.push({
                          name: 'formDesignMgr'
                        })
                      }else{
                        this.$Message.success('提交成功！！')
                        this.$router.push({
                          name: 'formDesignMgr'
                        })
                      }
                    } else {
                      this.$Message.error(res.data.errmsg)
                    }
                  }
                }, error => { console.log(error) })
              }
            }else{
              console.log(formJSON)
              formJSON.type = 1
              formJSON.parseHtml = formJSON.parse
              this.formDetail = formJSON
              this.formModal = true
              // this.$router.push({
              //   name: 'preview',
              //   params: {
              //     type: type_value,
              //     formid: formid,
              //     parse_form: parse_form
              //   }
              // })
            }
        } else {
          this.$Message.error('表单内容不能为空！')
          // alert('表单内容不能为空！')
          return false;
        }
    },
    parse_form (template,fields){
        //正则  radios|checkboxs|select 匹配的边界 |--|  因为当使用 {} 时js报错 (plugins|fieldname|fieldflow)
        var preg =  /(\|-<span(((?!<span).)*plugins=\"(radios|checkboxs|select)\".*?)>(.*?)<\/span>-\||<(img|input|textarea|select).*?(<\/select>|<\/textarea>|\/>))/gi,preg_attr =/(\w+)=\"(.?|.+?)\"/gi,preg_group =/<input.*?\/>/gi;
        if(!fields) fields = 0;

        var template_parse = template,template_data = new Array(),add_fields=new Object(),checkboxs=0;

        var pno = 0;
        template.replace(preg, function(plugin,p1,p2,p3,p4,p5,p6){
            var parse_attr = new Array(),attr_arr_all = new Object(),name = '', select_dot = '' , is_new=false;
            var p0 = plugin;
            var tag = p6 ? p6 : p4;
            //alert(tag + " \n- t1 - "+p1 +" \n-2- " +p2+" \n-3- " +p3+" \n-4- " +p4+" \n-5- " +p5+" \n-6- " +p6);

            if(tag == 'radios' || tag == 'checkboxs')
            {
                plugin = p2;
            }else if(tag == 'select')
            {
                plugin = plugin.replace('|-','');
                plugin = plugin.replace('-|','');
            }
            plugin.replace(preg_attr, function(str0,attr,val) {
                if(attr=='name')
                {
                    if(val=='NewField')
                    {
                        is_new=true;
                        fields++;
                        // val = 'data_'+fields;
                        val = 'data_'+fields;
                    }
                    name = val;
                }

                if(tag=='select' && attr=='value')
                {
                    if(!attr_arr_all[attr]) attr_arr_all[attr] = '';
                    attr_arr_all[attr] += select_dot + val;
                    select_dot = ',';
                }else
                {
                    attr_arr_all[attr] = val;
                }
                var oField = new Object();
                oField[attr] = val;
                parse_attr.push(oField);
            })
            /*alert(JSON.stringify(parse_attr));return;*/
            if(tag =='checkboxs') /*复选组  多个字段 */
            {
                plugin = p0;
                plugin = plugin.replace('|-','');
                plugin = plugin.replace('-|','');
                var name = 'checkboxs_'+checkboxs;
                attr_arr_all['parse_name'] = name;
                attr_arr_all['name'] = '';
                attr_arr_all['value'] = '';

                attr_arr_all['content'] = '<span plugins="checkboxs"  title="'+attr_arr_all['title']+'">';
                var dot_name ='', dot_value = '';
                p5.replace(preg_group, function(parse_group) {
                    var is_new=false,option = new Object();
                    parse_group.replace(preg_attr, function(str0,k,val) {
                        if(k=='name')
                        {
                        	if(val=='NewField')
                            {
                                is_new=true;
                                fields++;
                                val = 'data_'+fields;
                            }

                            attr_arr_all['name'] += dot_name + val;
                            dot_name = ',';

                        }
                        else if(k=='value')
                        {
                            attr_arr_all['value'] += dot_value + val;
                            dot_value = ',';

                        }
                        option[k] = val;
                    });

                    if(!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                    attr_arr_all['options'].push(option);
                    if(!option['checked']) option['checked'] = '';
                    var checked = option['checked'] ? 'checked="checked"' : '';
                    attr_arr_all['content'] +='<input type="checkbox" name="'+option['name']+'" value="'+option['value']+'" fieldname="' + attr_arr_all['fieldname'] + option['fieldname'] + '" fieldflow="' + attr_arr_all['fieldflow'] + '" '+checked+'/>'+option['value']+'&nbsp;';

                    if(is_new)
                    {
                        var arr = new Object();
                        arr['name'] = option['name'];
                        arr['plugins'] = attr_arr_all['plugins'];
                        arr['fieldname'] = attr_arr_all['fieldname'] + option['fieldname'];
                        arr['fieldflow'] = attr_arr_all['fieldflow'];
                        add_fields[option['name']] = arr;
                    }

                });
                attr_arr_all['content'] += '</span>';

                //parse
                template = template.replace(plugin,attr_arr_all['content']);
                template_parse = template_parse.replace(plugin,'{'+name+'}');
                template_parse = template_parse.replace('{|-','');
                template_parse = template_parse.replace('-|}','');
                template_data[pno] = attr_arr_all;
                checkboxs++;

            }else if(name)
            {
                if(tag =='radios') /*单选组  一个字段*/
                {
                    plugin = p0;
                    plugin = plugin.replace('|-','');
                    plugin = plugin.replace('-|','');
                    attr_arr_all['value'] = '';
                    attr_arr_all['content'] = '<span plugins="radios" name="'+attr_arr_all['name']+'" title="'+attr_arr_all['title']+'">';
                    var dot='';
                    p5.replace(preg_group, function(parse_group) {
                        var option = new Object();
                        parse_group.replace(preg_attr, function(str0,k,val) {
                            if(k=='value')
                            {
                                attr_arr_all['value'] += dot + val;
                                dot = ',';
                            }
                            option[k] = val;
                        });
                        option['name'] = attr_arr_all['name'];
                        if(!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                        attr_arr_all['options'].push(option);
                        if(!option['checked']) option['checked'] = '';
                        var checked = option['checked'] ? 'checked="checked"' : '';
                        attr_arr_all['content'] +='<input type="radio" name="'+attr_arr_all['name']+'" value="'+option['value']+'"  '+checked+'/>'+option['value']+'&nbsp;';

                    });
                    attr_arr_all['content'] += '</span>';

                }else
                {
                    attr_arr_all['content'] = is_new ? plugin.replace(/NewField/,name) : plugin;
                }
                //attr_arr_all['itemid'] = fields;
                //attr_arr_all['tag'] = tag;
                template = template.replace(plugin,attr_arr_all['content']);
                template_parse = template_parse.replace(plugin,'{'+name+'}');
                template_parse = template_parse.replace('{|-','');
                template_parse = template_parse.replace('-|}','');
                if(is_new)
                {
                    var arr = new Object();
                    arr['name'] = name;
                    arr['plugins'] = attr_arr_all['plugins'];
                    arr['title'] = attr_arr_all['title'];
                    arr['orgtype'] = attr_arr_all['orgtype'];
                    arr['fieldname'] = attr_arr_all['fieldname'];
                    arr['fieldflow'] = attr_arr_all['fieldflow'];
                    add_fields[arr['name']] = arr;
                }
                template_data[pno] = attr_arr_all;


            }
            pno++;
        })
        var view = template.replace(/{\|-/g,'');
        view = view.replace(/-\|}/g,'');
        if(template.indexOf('datePicker') !== -1){ // 判断为日期组件
          let n = (template.split('datePicker')).length-1;
          for(var i =0;i<n;i++){
            let name = 'datepicker'+(i+1);
            add_fields.name = {
              name:name,
              title:name,
              orgtype:"datePicker"
            };
            template_data.push({
              plugins:'datePicker',
              type:'datePicker',
              name:name,
              title:name
            });
            fields++
          }
        }
        if(template.indexOf('Unit') !== -1){ // 判断为单位组件
          let n = (template.split('Unit')).length-1;
          for(var i =0;i<n;i++){
            let name = 'unit'+(i+1);
            add_fields.name = {
              name:name,
              title:name,
              orgtype:"Unit"
            };
            template_data.push({
              plugins:'Unit',
              type:'Unit',
              name:name,
              title:name
            });
            fields++
          }
        }
        if(template.indexOf('User') !== -1){ // 判断为用户组件
          let n = (template.split('User')).length-1;
          for(var i =0;i<n;i++){
            let name = 'user'+(i+1);
            add_fields.name = {
              name:name,
              title:name,
              orgtype:"User"
            };
            template_data.push({
              plugins:'User',
              type:'User',
              name:name,
              title:name
            });
            fields++
          }
        }
        var parse_form = new Object({
            'fields':fields,//总字段数
            'template':template,//完整html
            'parse':view,
            'data':template_data,//控件属性
            'add_fields':add_fields//新增控件
        });
        console.log(parse_form);
        return JSON.stringify(parse_form);
    },
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    },
    getUEContentTxt () { // 获取纯文本内容方法
      return this.editor.getContentTxt()
    },
  },
  components: {
    preview
  }
}
</script>