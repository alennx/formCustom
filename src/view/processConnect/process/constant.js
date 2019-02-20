// 操作类型
export const handleTypes = {
  // 修改、编辑
  edit: 'edit',
  // 详情、查看
  detail: 'detail',
  // 新增
  create: 'create'
}

// 输入方式
export const inputMode = [{
  label: '数据库读取',
  value: '1'
}, {
  label: '标准API',
  value: '2'
}, {
  label: '非标准API',
  value: '3'
}]

// 输出方式
export const outputMode = [{
  label: '数据库读取',
  value: '1'
}, {
  label: '标准API',
  value: '2'
}, {
  label: '非标准API',
  value: '3'
}]

// 更新方式
export const updateMode = [{
  label: '全量更新',
  value: 2
}, {
  label: '增量更新',
  value: 1
}]

// 更新频率
export const updateFrequence = [{
  label: '实时',
  value: 1
}, {
  label: '每天',
  value: 2
}]

// 系统列表
export const systemList = [{
  label: '省公文处理和事务办理系统',
  value: '1'
}, {
  label: '表单定制系统',
  value: '2'
}, {
  label: '统一门户',
  value: '3'
}]

// 标准格式列表
export const standardList = [{
  label: '省公文处理和事务办理系统',
  value: '1'
}, {
  label: '表单定制系统',
  value: '2'
}, {
  label: '统一门户',
  value: '3'
}]

// 更新方式
export const updateMethods = [{
  label: '全部',
  value: '-1'
}, {
  label: '增量',
  value: '1'
}, {
  label: '全量',
  value: '2'
}]

// 更新方式
export const updateFreq = [{
  label: '全部',
  value: '-1'
}, {
  label: '实时',
  value: '1'
}, {
  label: '每天',
  value: '2'
}]

// 接口类型
export const inteTypes = [{
  label: '输入',
  value: '1'
}, {
  label: '输出',
  value: '2'
}]
