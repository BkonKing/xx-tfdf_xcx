import request from '@/utils/request.js'
import apiConfig from '@/api/config'

// 发送手机验证码
export function verifCode (data) {
  return request({
    url: '/ulogin/login/verifCode',
    method: 'post',
    data,
    headers: {
      completeData: true
    }
  })
}

// 退出登录
export function outLogin () {
  return request.post('/login/logout')
}

// 账户信息
export function getMyAccount () {
  return request({
    url: '/user/userInfo',
    method: 'get'
  })
}

// 小程序授权登录
export function wxLogin (data) {
  return request({
    url: '/wxLogin/xcx_authorize_new',
    baseURL: `${apiConfig.baseUrl}/xcx/api/v1`,
    method: 'post',
    data
  })
}

// 获取微信绑定手机号
export function getWxMobile (data) {
  return request({
    url: '/login/xcxMobile',
    method: 'post',
    noToast: true,
    data
  })
}

export function getProjectList(data) {
  return request({
    url: '/project/getList',
    method: 'post',
    data
  })
}

// 分享信息接口
export function getShareInfo(data) {
  return request({
    url: '/Share/info',
    method: 'post',
    data
  })
}

// 楼盘详情数据接口
export function getProjectInfo(data) {
  return request({
    url: '/project/projectInfo',
    method: 'post',
    data
  })
}

// 协义详情接口
export function getAgreementInfo(data) {
  return request({
    url: '/agreement/agreementInfo',
    method: 'post',
    data
  })
}

// 手机号获取验证码接口
export function getYzmCode(data) {
  return request({
    url: '/login/getYzmCode',
    method: 'post',
    data
  })
}

// 手机验证码登录验证接口
export function yzmLogin(data) {
  return request({
    url: '/login/yzmLogin',
    method: 'post',
    data
  })
}

// 新增预约接口
export function addIntention(data) {
  return request({
    url: '/intention/addIntention',
    method: 'post',
    data
  })
}

// 修改预约状态接口
export function updateIntentionStatus(data) {
  return request({
    url: '/intention/updateIntentionStatus',
    method: 'post',
    data
  })
}

// 下拉选择所有楼盘接口
export function getAllProject(data) {
  return request({
    url: '/project/allProject',
    method: 'post',
    data
  })
}

// 下拉选择户型接口
export function getAllHouse(data) {
  return request({
    url: '/project/allHouse',
    method: 'post',
    data
  })
}

// 预约记录接口
export function getIntentionList(data) {
  return request({
    url: '/user/getIntentionList',
    method: 'post',
    data
  })
}