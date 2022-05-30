import ajax from '@/uni_modules/u-ajax/js_sdk'
import store from '@/store'
// import qs from 'qs'
import {
  clearUserInfo
} from '@/utils/util'
import apiConfig from '@/api/config'

const service = ajax.create({
  headers: {},
  baseURL: `${apiConfig.baseUrl}`,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.loading && uni.showLoading({
      title: '加载中'
    });
    // 转换参数格式
    // if (config.headers['Content-Type'] ===
    //   'application/x-www-form-urlencoded') {
    //   config.data = qs.stringify(config.data)
    // }
    const token = uni.getStorageSync('access_token')
    token && (config.headers['Authorization'] = token)
    config.header = config.headers
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const {
      statusCode: status,
      data,
      config
    } = response
    const {
      code,
      msg: message
    } = data
    config.loading && uni.hideLoading();
    if (status == 401 || code == 401) {
      if (store.state.loginModal) {
        return Promise.reject(code)
      }
      uni.showModal({
        title: '提示',
        content: '登录信息已经过期了，请重新登录',
        success: function(res) {
          clearUserInfo()
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
      return Promise.reject(code)
    } else if (code != 200) {
      if (!config.noToast && message) {
        uni.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        });
      }
      return Promise.reject(data || 'Error')
    } else {
      return data
    }
  },
  error => {
    if (error.statusCode == 401) {
      uni.showModal({
        title: '提示',
        content: '登录信息已经过期了，请重新登录',
        success: function(res) {
          clearUserInfo()
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
      return Promise.reject(code)
    } else if (error.errMsg && error.errMsg.includes('timeout')) {
      uni.showToast({
        title: '请求超时',
        icon: 'none',
        duration: 2000
      });
    } else if (!error.config.noToast) {
      uni.showToast({
        title: error.data.msg,
        icon: 'none',
        duration: 2000
      });
    }
    return Promise.reject(error)
  }
)

export default service
