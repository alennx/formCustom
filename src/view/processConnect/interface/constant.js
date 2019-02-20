// 操作类型
export const handleTypes = {
  // 修改、编辑
  edit: 'edit',
  // 详情、查看
  detail: 'detail',
  // 新增
  create: 'create'
}

// 接口类型
export const interfaceTypes = [{
  label: '全部',
  value: ''
}]

// 系统名称
export const systemList = [{
  label: '全部',
  value: '-1'
}, {
  label: '系统1',
  value: '23125646651'
}, {
  label: '系统2',
  value: '23125646652'
}]

// 接口格式
export const patterns = [{
  label: '全部',
  value: '-1'
}, {
  label: 'API',
  value: '1'
}, {
  label: 'WebService',
  value: '2'
}, {
  label: '其他',
  value: '3'
}]

// 请求方式列表
export const requestMethods = [{
  label: 'POST',
  value: 1
}, {
  label: 'GET',
  value: 2
}, {
  label: '其他',
  value: 3
}]

// 接口类型
export const inteTypes = [{
  label: '全部',
  value: '-1'
}, {
  label: '输入',
  value: '1'
}, {
  label: '输出',
  value: '2'
}]

// 字段类型
export const fieldTypes = [{
  label: 'Varchar',
  value: 'Varchar'
}, {
  label: 'Int',
  value: 'Int'
}, {
  label: 'Double',
  value: 'Double'
}, {
  label: 'Date',
  value: 'Date'
}, {
  label: 'DateTime',
  value: 'DateTime'
}]
