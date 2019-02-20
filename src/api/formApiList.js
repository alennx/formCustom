/**
 * 表单设计接口列表
 * author：liuGuangRui
 */

const api = {
  /* 首页 */
  getFillInFormForLastTwelveMonth: { // 获取最近12个月表单填报数量统计结果
    url: '/api/form/formStat/getFillInFormForLastTwelveMonth',
    method: 'get'
  },
  getFormStatisticForFirstPage: { // 表单定制系统首页数据概览统计结果获取
    url: '/api/form/formStat/getFormStatisticForFirstPage',
    method: 'get'
  },
  getFormTypeStatistic: { // 表单类别统计结果获取
    url: '/api/form/formStat/getFormTypeStatistic',
    method: 'get'
  },
  getIncrementForLastSixMonth: { // 获取最近六个月新增表单数据统计结果
    url: '/api/form/formStat/getIncrementForLastSixMonth',
    method: 'get'
  },
  /* 表单设计 */
  pageFormMgr: { // 查询表单管理列表
    url: '/api/form/form/page',
    method: 'post'
  },
  saveFormDesign: { // 保存/提交表单设计内容
    url: '/api/form/form/save',
    method: 'post'
  },
  updateFormDesign: { // 修改表单设计内容
    url: '/api/form/form/update',
    method: 'post'
  },
  getByFormId: { // 根据表单ID查询
    url: '/api/form/form/getByFormId',
    method: 'post',
    contentType: 'query'
  },
  deleteForm: { // 删除表单设计项
    url: '/api/form/form/delete',
    method: 'get'
  },
  findAllOrgAddEmpByUser: { // 查询当前应用的所有可用角色
    url: '/api/admin/emp/findAllOrgAddEmpByUser',
    method: 'get'
  },
  competenceList: { // 根据表单ID查询角色信息
    url: '/api/form/authorityForm/list',
    method: 'get'
  },
  saveItem: { // 保存表单权限
    url: '/api/form/authorityForm/save',
    method: 'post'
  },
  /** 流程设计 */
  saveOrUpdateProcess: { // 更新或保存流程定义
    url: '/api/form/formv2/saveOrUpdateProcess',
    method: 'post'
  },
  getProcessJson: { // 获取流程定义
    url: '/api/form/formv2/getProcessJson',
    method: 'get'
  },
  getFormFieldListByFormId: { // 获取表单字段列表
    url: '/api/form/form/getFormFieldListByFormId',
    method: 'get'
  },
  /* 表单填报管理 */
  pageFormList: { // 分页查询授权指定用户填报的表单
    url: '/api/form/fillform/pageFormList',
    method: 'post'
  },
  getFormInfoAndResult: { // 查询表单填报结果接口
    url: '/api/form/formv2/getFormInfoAndResult',
    method: 'get'
  },
  saveOrUpdateForm: { // 更新或保存表单数据接口
    url: '/api/form/formv2/saveOrUpdateForm',
    method: 'post'
  },
  updateFillResult: { // 修改申请中的表单填报结果
    url: '/api/form/formv2/updateFillResult',
    method: 'post'
  },
  getFieldAuthList: { // 获取当前任务字段权限列表
    url: '/api/form/formv2/getFieldAuthList',
    method: 'get'
  },
  /* 填报结果管理 */
  findPage: { // 填报结果管理列表
    url: '/api/form/formv2/pageAllProcessInstance',
    method: 'post'
  },
  getInfo: { // 查询表单填报单条记录
    url: '/api/form/formResult/getInfo',
    method: 'get'
  },
  formStaticsInfo: { // 表单填报统计
    url: '/api/form/formStatistics/formStaticsInfo',
    method: 'post'
  },
  pageProcessInstance: { // 分页查询已申请表单列表
    url: '/api/form/formv2/pageProcessInstance',
    method: 'post'
  },
  pageExecutingTask: { // 分页查询待填报表单列表
    url: '/api/form/formv2/pageExecutingTask',
    method: 'post'
  },
  pageExecutedTaskList: { // 分页查询已填报表单列表
    url: '/api/form/formv2/pageExecutedTaskList',
    method: 'post'
  },
  getUseableFormList: { // 获取可填报表单列表
    url: '/api/form/formv2/getUseableFormList',
    method: 'post'
  },
  getProcessFlowChart: { // 获取填报的流程图片
    url: '/api/form/formv2/getProcessFlowChart',
    method: 'get'
  },
  getTheFirstTaskNameOfProcess: { // 获取流程定义第一个节点taskName
    url: '/api/form/formv2/getTheFirstTaskNameOfProcess',
    method: 'get'
  },
  /* 单位/用户列表 */
  getUnit: {
    url: '/api/admin/emp/findOrgAddEmpByUser',
    method: 'get'
  }
}
const formApiList = { ...api }

export default formApiList
