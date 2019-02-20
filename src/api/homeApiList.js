/**
 * 门户首页后台管理接口文档地址
 * author：wang-chong
 */

const api = {
  loginLogsStatistical: { // 首页最近一年登录时间统计
    url: '/api/admin/homeStatistical/loginLogsStatistical',
    method: 'get'
  },
  styleStatistical: { // 首页皮肤使用统计
    url: '/api/admin/homeStatistical/styleStatistical',
    method: 'get'
  },
  remplateStatistical: { // 首页风格使用统计
    url: '/api/admin/homeStatistical/remplateStatistical',
    method: 'get'
  },
  newsStatistical: { // 首页新闻统计
    url: '/api/admin/homeStatistical/newsStatistical',
    method: 'get'
  },
  regionStatistical: { // 首页区域统计
    url: '/api/admin/homeStatistical/regionStatistical',
    method: 'get'
  },
  nmPageList: { // 新闻管理列表
    url: '/api/admin/newsManagement/nmPageList',
    method: 'post'
  },
  newsDelete: { // 删除新闻
    url: '/api/admin/newsManagement/delete',
    method: 'post',
    contentType: 'postparam'
  },
  newsManagementDetail: { // 详情
    url: '/api/admin/newsManagement/detail',
    method: 'get'
  },
  newsManagementSave: { // 新增新闻管理
    url: '/api/admin/newsManagement/save',
    method: 'post'
  },
  newsManagementUpdate: { // 编辑新闻
    url: '/api/admin/newsManagement/update',
    method: 'post'
  },
  regionManagementNmPageList: { // 列表
    url: '/api/admin/regionManagement/nmPageList',
    method: 'post'
  },
  regionManagementSave: { // 首页区域管理新增
    url: '/api/admin/regionManagement/save',
    method: 'post'
  },
  regionManagementDelete: { // 首页区域管理删除
    url: '/api/admin/regionManagement/delete',
    method: 'post',
    contentType: 'postparam'
  },
  regionManagementUpdate: { // 首页区域管理更新
    url: '/api/admin/regionManagement/update',
    method: 'post'
  },
  regionManagementDetail: { // 获取详情
    url: '/api/admin/regionManagement/detail',
    method: 'get'
  }
}
const homeApiList = { ...api }

export default homeApiList
