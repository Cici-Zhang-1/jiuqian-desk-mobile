/**
 * Created by chuangchuangzhang on 2018/2/6.
 */
let baseUrl
let host
if (process.env.NODE_ENV === 'development') {
  // host = 'http://localhost/jiuqian.online.back'
  host = 'http://localhost:8080'
  baseUrl = 'http://localhost/jiuqian-online-back'
} else if (process.env.NODE_ENV === 'production') {
  // host = 'https://www.365huijia.com'
  // baseUrl = 'https://www.365huijia.com'
  // host = 'https://www.jqdz.online'
  // baseUrl = 'https://www.jqdz.online'
  // host = 'http://localhost/jiuqian-online-back'
  // baseUrl = 'http://localhost/jiuqian-online-back'
  host = window.location.protocol + '//' + window.location.host
  baseUrl = window.location.protocol + '//' + window.location.host
}

export {
  baseUrl,
  host
}
