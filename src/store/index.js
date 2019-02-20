/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import comApiList from '@/api/comApiList'
import api from '@/api/axiosApi'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authButton: [],
    // parse: '<table data-sort="sortDisabled"><tbody><tr class="firstRow"><td width="123" valign="top" style="word-break: break-all;">姓名</td><td width="123" valign="top" style="word-break: break-all;"><input name="data_1" type="text" title="name" value="" plugins="text" orgtype="text"/></td><td width="123" valign="top" style="word-break: break-all;">性别</td><td width="123" valign="top">{|-<span plugins="radios" name="data_2" title="six"><input type="radio" name="data_2" value="男"  />男&nbsp;<input type="radio" name="data_2" value="女"  />女&nbsp;</span>-|}</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">出生年月</td><td width="123" valign="top" style="word-break: break-all;">{- datePicker -}</td><td width="123" valign="top" style="word-break: break-all;">职业</td><td width="123" valign="top">{|-<span plugins="select"><select name="data_3" title="work" formplugins="select"><option value="学生">学生</option><option value="老师">老师</option></select>&nbsp;&nbsp;</span>-|}</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">爱好</td><td valign="top" rowspan="1" colspan="3">{|-<span plugins="checkboxs"  title="like"><input type="checkbox" name="" value="足球" fieldname="undefinedundefined" fieldflow="undefined" />足球&nbsp;<input type="checkbox" name="" value="篮球" fieldname="undefinedundefined" fieldflow="undefined" />篮球&nbsp;<input type="checkbox" name="work" value="羽毛球" fieldname="undefinedundefined" fieldflow="undefined" />羽毛球&nbsp;</span>-|}</td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">单位</td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">{- Unit -}</td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">用户</td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">{- User -}</td></tr></tbody></table><p><br/></p>',
    parse: '',
    formData: {},
    formItemType: 0,
    processXml: '',
    // processData: { "total": 5, "list": [{ "id": "1", "flow_id": "1990", "process_name": "发起申请", "process_to": "3,4", "icon": "icon-ok", "type": "start", "style": "width:121px;height:41px;line-height:41px;color:#0e76a8;left:193px;top:132px;" }, { "id": "2", "flow_id": "1990", "process_name": "审批2", "process_to": "5", "icon": "icon-star", "type": "task", "style": "width:120px;height:30px;line-height:30px;color:#0e76a8;left:486px;top:337px;" }, { "id": "3", "flow_id": "1990", "process_name": "快捷审批", "process_to": "5", "icon": "icon-star", "type": "task", "style": "width:120px;height:30px;line-height:30px;color:#0e76a8;left:193px;top:472px;" }, { "id": "4", "flow_id": "1990", "process_name": "审批1", "process_to": "2,5", "icon": "icon-star", "type": "task", "style": "width:120px;height:30px;line-height:30px;color:#ff66b5;left:486px;top:137px;" }, { "id": "5", "flow_id": "1990", "process_name": "归档整理人", "process_to": "", "icon": "icon-star", "type": "end", "style": "width:120px;height:30px;line-height:30px;color:#0e76a8;left:738px;top:472px;" }] },
    processData: {},
    logoutUrl: '/gaxq-center/admin/backstageIndex?isAdmin=1' // 退出登陆链接
  },
  mutations: {
    GETUSERINFO (state) {
      // 解析所有的token到此store下面。
      state.userInfo = loginController.getLoginUserInfo()
      state.userInfo.userId = state.userInfo.userid
    },
    GETAUTHBUTTON (state, params) {
      state.authButton = params
    }
  },
  actions: {
    getAuthButton ({ commit, state }, resourceId) { // 获取后端权限接口数据
      var arr = []
      if (loginController.isLogined()) {
        api(comApiList.getOperateButton, {
          resourceId: resourceId,
          userId: state.userInfo.userId // 本地测试
        }).then((res) => {
          if (res.data.errcode == 0) {
            res.data.data.forEach(function (item) {
              arr.push(item.code)
            })
            commit('GETAUTHBUTTON', arr)
          } else {
            console.log(res.data.errmsg)
          }
        })
      }
    }
  },
  modules: {}
})

export default store