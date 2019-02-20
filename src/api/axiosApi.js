/**
 * axiosApi封装，接口属于mock，可以修改
 * author：liuguangrui
 */
/* eslint-disable */
import axios from 'axios'
// import qs from 'qs'
import store from '@/store'
import '@static/login'

//请求拦截器配置
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// 返回拦截器配置
axios.interceptors.response.use(response => {
	if(response.data.errcode == '-9999'){//已退出登陆
		loginController.emptyLoginUserInfo();
		loginController.loginFlow();
	}
	if(response.data && response.data.data && response.data.data.total){
		response.data.data.total = Number(response.data.data.total);
	}
  return response
}, error => {
  return Promise.resolve(error.response)
})

// 错误返回
function errorState(response) {
  //加入loading  
  console.log(response)
  // 如果http状态码正常，则直接返回数据  
  if (response && response.data.errcode == 0) {
    return response
  // token过期失效码，重新向安卓请求
  } else if (response && (response.data["errcode"] == 40001 || response.data["errcode"] == 40003 || response.data["errcode"] == 40005)) {
    store.commit('GETUSERINFO');//重新获取userId和token
    store.state.alertText = response.data.msg;
    store.state.isAlert = true;
  } else {
    store.state.alertText = res.data.msg || '网络异常，请检查网络后重试！';
    store.state.isAlert = true;
    console.log('网络异常1');
  }
}
// 成功后返回
function successState(res) {
  //加入loading 
  //统一判断后端返回的错误码  
  if (res.data.errcode == 0) {
    console.log('接口返回正常');
  } else if (res.data.errcode != 0 && res.data.errcode != '0') {
    store.state.alertText = res.data.msg || '网络异常，请检查网络后重试！';
    store.state.isAlert = true;
    console.log('网络异常2');
  }
}

// http请求
const httpServer = (opts, data) => {
	var userInfo = loginController.getLoginUserInfo();
  userInfo.userId = userInfo.userid;
  let HYtimestamp = (new Date()).getTime();
  let Public = { //公共参数  
    'HYtimestamp': HYtimestamp
  }
  let httpDefaultOpts = { //http默认配置  
    method: opts.method,
    baseURL:'/',
    url: opts.url,
    timeout: 10000,
    params: Object.assign(Public, data),
    data: Object.assign(Public, data),
    headers: opts.method == 'get' ? { //配置请求头数据
      'X-Requested-With': 'XMLHttpRequest',
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8",
      "token": userInfo.token
    } : {
      '_user_id': userInfo.userId,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': opts.contentType || 'application/json',
      "token": userInfo.token
    }
  }
  if (opts.method == 'get') {
    delete httpDefaultOpts.data
  } else {
    httpDefaultOpts.url = httpDefaultOpts.url + '?HYtimestamp=' + HYtimestamp 
    if (opts.contentType){//判断post请求条件下是否有设置contentType
      delete httpDefaultOpts.data
    }else{
      delete httpDefaultOpts.params
    } 
  }

  let promise = new Promise((resolve, reject) => {
    axios(httpDefaultOpts).then(res => {
      successState(res)
      resolve(res)
    }).catch(response => {
      if (response.data["errcode"] == 40001 || response.data["errcode"] == 40003 || response.data["errcode"] == 40005) {
        store.commit('GETUSERINFO'); // 重新获取userId和token
        return 
      }
      errorState(response)
      reject(response)
    })
  })
  return promise
}

export default httpServer  