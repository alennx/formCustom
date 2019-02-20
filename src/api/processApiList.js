/**
 * 流程衔接系统接口文档地址
 * author：wang-chong
 */

const api = {
  findInterfaceCount: { // 接口、流程衔接、流程衔接状态、流程调用条数
    url: '/api/flow/findInterfaceCount',
    method: 'post'
  },
  getInterfacePage: { // 分页
    url: '/api/flow/inner/interface/getInterfacePage',
    method: 'post'
  },
  interfaceDeleteById: { // 删除接口
    url: '/api/flow/inner/interface/deleteById',
    method: 'post',
    contentType: 'postparam'
  },
  interfaceSave: { // 接口新增
    url: '/api/flow/inner/interface/save',
    method: 'post'
  },
  interfaceUpdate: { // 接口更新
    url: '/api/flow/inner/interface/update',
    method: 'post'
  },
  getFieldDetailById: { // 获取字段详情
    url: '/api/flow/inner/interface/getFieldDetailById',
    method: 'post'
  },
  connectPageFind: { // 流程衔接管理列表
    url: '/api/flow/connect/pageFind',
    method: 'post'
  },
  findMonthConnectCount: { // 最近半年新增流程衔接数量统计
    url: '/api/flow/findMonthConnectCount',
    method: 'post'
  },
  findConnectName: { // 最近半年新增流程衔接数量统计
    url: '/api/flow/findConnectName',
    method: 'get'
  },
  findConnectInfoCount: { // 最近一年流程调用统计
    url: '/api/flow/findConnectInfoCount',
    method: 'post',
    contentType: '1'
  },
  findUseInfoList: { // 流程调用统计分页列表
    url: '/api/flow/findUseInfoList',
    method: 'post'
  },
  useRecordPage: { // 流程调用记录分页
    url: '/api/flow/inner/flowUse/useRecordPage',
    method: 'post'
  },
  applicationFindAllLike: { // 获取应用列表查询
    url: '/api/developer/application/findAllLike',
    method: 'post'
  },
  getConnectCode: { // 获取流程衔接的编码
    url: '/api/flow/connect/getConnectCode',
    method: 'get'
  },
  createFlowConnect: { // 新增流程衔接
    url: '/api/flow/connect/createFlowConnect',
    method: 'post'
  },
  getFlowConnectInfo: { // 获取流程衔接详情
    url: '/api/flow/connect/getFlowConnectInfo',
    method: 'get'
  },
  enableConnect: { // 启用禁用衔接
    url: '/api/flow/connect/enableConnect',
    method: 'get'
  }
}
const homeApiList = { ...api }

export default homeApiList
