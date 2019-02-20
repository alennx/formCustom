/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  getOperateMenu: { // 通过账号Id和应用Id获取可访问资源树(只访问菜单)
    url: '/api/admin/p/resource/findcanoperatemenu',
    method: 'post'
  },
  getOperateButton: { // 通过账号Id、[分组、资源Id]获取可访问按钮
    url: '/api/admin/p/resource/findcanoperatebutton',
    method: 'post'
  },
  // 获取当前登录用户的所有单位
  getMyOrgList: {
    url: '/api/mt/userConfi/getMyOrgList',
    method: 'get'
  },
  // 查询指定用户可见的应用列表
  FindAppVisibleForSelf: {
    url: '/api/developer/application/findAppVisibleForSelf',
    method: 'get'
  },
  // 查询部门，人员树
  findDpmAndEmpToTreeByLogin: {
    url: '/api/admin/emp/findDpmAndEmpToTreeByLogin',
    method: 'get'
  },
  // 获取消息
  getMessage: {
    url: '/api/msgs/bbs/msg/getNotReadMsg',
    method: 'post'
  },
  toHandlerMsg: {
    url: '/api/msgs/bbs/msg/flagReadedAndGetUrl',
    method: 'get'
  },
  findAppByAdminWithEnable: { // 查询我所管理的所有启用的应用或服务(1：应用；2：服务)
    url: '/api/developer/application/findAppByAdminWithEnable',
    method: 'get'
  }
}
const comApiList = { ...serviceModule }

export default comApiList
