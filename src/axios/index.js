import axios from 'axios/dist/axios'
import router from '@/router'
import store from '@/store'
import { baseUrl } from './env'
import { dataToStr } from '@/assets/js/custom'
//
// let dataToStr = function (data, p = '') {
//   if (data) {
//     let dataStr = '' // 数据拼接字符串
//     Object.keys(data).forEach(key => {
//       let realKey
//       if (p !== '') {
//         realKey = p + '[' + key + ']'
//       } else {
//         realKey = key
//       }
//       if (data[key] === null || data[key] === undefined) {
//         dataStr += realKey + '=&'
//       } if (typeof data[key] === 'object') {
//         data[key] = dataToStr(data[key], realKey)
//         dataStr += data[key] + '&'
//       } else {
//         data[key] = encodeURIComponent(data[key])
//
//         if (p !== '') {
//           dataStr += realKey + '=' + data[key] + '&'
//         } else {
//           dataStr += realKey + '=' + data[key] + '&'
//         }
//       }
//     })
//     return trimRight(dataStr, '&')
//   } else {
//     return data
//   }
// }
// 创建axios实例
// console.log(window.location.host)
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  withCredentials: true,
  transformRequest: [function (data) {
    return dataToStr(data)
    // 对 data 进行任意转换处理
    /* if (data) {
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach(key => {
        if (typeof data[key] === "object") {
          data[key] = dataToStr(data[key], key)
          dataStr += data[key] + '&'
        } else {
          dataStr += key + '=' + data[key] + '&'
        }
      })
      return dataStr
    } else {
      return data
    } */
  }],
  timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    let data = response.data
    if (data.code === 10) {
      store.commit('SET_SIGNIN', { signin: true })
      router.replace('/sign/index/in')
    }
    return data
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit('SET_SIGNIN', { signin: true })
          router.replace('/sign/index/in')
          break
      }
    }
    return Promise.reject(error)
  })

export default service
