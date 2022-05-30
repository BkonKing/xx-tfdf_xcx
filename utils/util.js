import store from '../store'
import apiConfig from '@/api/config'

/**
 * 获取当前地址信息
 * @param {type} 1：返回转换为详细地址信息（省市县），2：返回 getLocation获取到信息
 * @return {Promise} 根据type返回不同格式的地址信息
 */
export function bMapGetLocationInfo(type = 1) {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success(res) {
        resolve(res)
      },
      fail() {
        reject()
      }
    })
  })
}

export function clearUserInfo() {
  // const userId = store.getters.userInfo.id
  // if (userId) {
    // let tokenList = uni.getStorageSync('token_list')
    // tokenList = typeof tokenList === 'string' ? JSON.parse(tokenList) :
    //   tokenList
    // delete tokenList[userId]
    // uni.setStorageSync('token_list', tokenList)
    // let userList = uni.getStorageSync('userList')
    // console.log(userList);
    // userList = typeof userList === 'string' ? JSON.parse(userList) : userList
    // delete userList[userId]
    // uni.setStorageSync('userList', userList)
  // }
  uni.removeStorageSync('userInfo')
  store.commit('setUserInfo', '')
  // store.commit('setCurrentProject', null)
  uni.removeStorageSync('access_token')
  // uni.removeStorageSync('refresh_token')
  // uni.removeStorageSync('currentProject')
}

export function getDate(time) {
  const date = time || new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  return `${year}/${month}/${day}`
}

export function validForm(arr) {
  const status = arr.some(obj => {
    return validEmpty(obj.value, obj.message)
  })
  return new Promise((resolve, reject) => {
    if (!status) {
      resolve(status)
    } else {
      reject(status)
    }
  })
}

export function validEmpty(val, message) {
  const status = typeof val === 'undefined' || val === null || val === ''
  if (status) {
    uni.showToast({
      title: message || '值不能为空',
      icon: 'none'
    })
  }
  return status
}

export function requestPayment(data) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'wxpay',
      ...data,
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    });
  })
}

export function goApp(data) {
  uni.showModal({
    content: '前往美好生活家园APP体验',
    confirmText: '我知道了',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {} else if (res.cancel) {}
    }
  });
}

export function toLogin(data) {
  uni.navigateTo({
    url: '/pages/index/login'
  })
  return
}

export function chooseImage(params) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...params,
      success: function(chooseImageRes) {
        const tempFilePaths = chooseImageRes.tempFilePaths;
        const remoteData = []
        if (tempFilePaths && tempFilePaths.length) {
          const result = tempFilePaths.map((filePath, index) => {
            return uploadImage(filePath, index).then((url) => {
              url && (remoteData[index] = url)
            });
          });
          Promise.all(result).then(() => {
            if (params.count === 1) {
              resolve(remoteData[0])
              return
            }
            resolve(remoteData)
          })
        }
      },
      fail: function(error) {
        reject(error)
      }
    })
  })
}

export function uploadImage(filePath, index) {
  const baseUrl = apiConfig.baseUrl;
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl}/app/api/v1/ulogin/login/upload_img`,
      filePath,
      name: 'img',
      formData: {
        num: index,
        uid: 1
      },
      header: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
        Authorization: uni.getStorageSync('access_token')
      },
      success: ({
        data
      }) => {
        data = data.replace(' ', '');
        if (typeof data !== 'object') {
          data = data.replace(/\ufeff/g, '');
          data = JSON.parse(data);
        }
        const result = baseUrl + data.data
        resolve(result)
      },
      fail: function() {
        resolve()
      }
    });
  })
}

export function openLocation(data) {
  const {
    latitude,
    longitude,
    ...params
  } = data
  const newLocation = convert2TecentMap({
    latitude,
    longitude
  })
  uni.openLocation({
    longitude: +newLocation.longitude,
    latitude: +newLocation.latitude,
    ...params
  })
}

export function convert2TecentMap({longitude, latitude}) {
  if (longitude == '' && latitude == '') {
    return {
      longitude: 0,
      latitude: 0
    }
  }
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0
  var x = +longitude - 0.0065
  var y = +latitude - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  var qqLongitude = z * Math.cos(theta)
  var qqLatitude = z * Math.sin(theta)
  return {
    longitude: qqLongitude,
    latitude: qqLatitude
  }
}

// 防抖函数
export function debounce(fn, delay = 500) {
  let timer
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    const args = arguments
    timer = setTimeout(() => {
      fn.apply(this, args) // 改变this指向为调用debounce所指的对象
    }, delay)
  }
}

export function throttle(func, delay = 1000) {
  var timer = null;
  return function() {
    if (!timer) {
      func.apply(this, arguments);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  }
}
