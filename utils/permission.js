import {
  setUserPostion
} from '@/api/user'
import {
  bMapGetLocationInfo
} from '@/utils/util'

/*  scope.userInfo	uni.getUserInfo	用户信息	
    scope.userLocation	uni.getLocation, uni.chooseLocation	地理位置	
    scope.userLocationBackground	wx.userLocationBackground	后台定位	微信小程序
    scope.address	uni.chooseAddress	通信地址	
    scope.record	uni.getRecorderManager	录音功能	
    scope.writePhotosAlbum	uni.saveImageToPhotosAlbum, uni.saveVideoToPhotosAlbum	保存到相册	字节跳动小程序的返回值是scope.album
    scope.camera	<camera /> 组件，头条下的扫码、拍照、选择相册	摄像头	
    scope.invoice	wx.chooseInvoice(opens new window)	获取发票	微信小程序、QQ小程序
    scope.invoiceTitle	uni.chooseInvoiceTitle	发票抬头	微信小程序、百度小程序、QQ小程序
    scope.werun	wx.getWeRunData(opens new window)	微信运动步数	微信小程序 */
/**
 * 判断是否有权限并发起提醒，没有权限的情况下请求权限
 * @param {Object} perm
 * @return {Promise} 返回成功或失败结果
 * {
 *    name:     //权限名
 *    message:  //提醒语
 *    className: dialog自定义类名
 *    overlayStyle: dialog自定义遮罩样式
 * }
 */
export function handlePermission({
  name,
  message = '',
  title = '提示',
  confirmButtonText = '去开启'
}) {
  return new Promise((resolve, reject) => {
    hasPermission(name).then(() => {
      resolve()
    }).catch(() => {
      const scope = `scope.${name}`
      uni.authorize({
        scope,
        success() {
          if (name === 'userLocation') {
            getCurrentLocation(resolve, reject)
          } else {
            resolve()
          }
        },
        fail() {
          uni.showModal({
            title,
            content: message,
            confirmText: confirmButtonText,
            success: function(res) {
              if (res.confirm) {
                uni.openSetting({
                  success(res) {
                    if (res.authSetting[
                        'scope.userLocation']) {
                      getCurrentLocation(resolve, reject)
                    }
                    if (res.authSetting[scope]) {
                      resolve()
                    } else {
                      reject()
                    }
                  },
                  fail(e) {
                    reject()
                  }
                })
              } else if (res.cancel) {
                reject(false)
              }
            }
          });
        }
      })
    })
  })
}

/**
 * 判断是否有权限
 * @param {string} perm 权限名
 * @return {Object} 查询权限结果
 * {scope.address: true}
 */
export async function hasPermission(perm) {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success(res) {
        const setting = res.authSetting
        const key = `scope.${perm}`
        if (setting[key]) {
          resolve(true, setting)
          return
        }
        reject()
      },
      fail() {
        reject()
      }
    })
  })
}


function getCurrentLocation(resolve, reject) {
  // 开启定位，则获取用户的定位信息保存在后端
  const hasToken = uni.getStorageSync('access_token')
  hasToken && bMapGetLocationInfo()
    .then(data => {
      const {
        longitude,
        latitude,
      } = data
      setUserPostion({
        longitude,
        latitude,
      }).finally(() => {
        resolve()
      })
    })
    .catch(() => {
      console.log('error')
      reject(false)
    })
}
