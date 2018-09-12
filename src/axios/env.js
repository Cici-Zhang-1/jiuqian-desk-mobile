/**
 * Created by chuangchuangzhang on 2018/2/6.
 */
let baseUrl
let host
let pubUrl

if (process.env.NODE_ENV === 'development') {
  host = 'http://localhost:8080'
  baseUrl = 'http://localhost/jiuqian-mobile'
  // baseUrl = 'http://localhost/jiuqian-produce'
  pubUrl = 'http://localhost/pub_365huijia'
} else if (process.env.NODE_ENV === 'production') {
  host = 'http://localhost/jiuqian-mobile'
  baseUrl = 'http://localhost/jiuqian-mobile'
  pubUrl = 'http://localhost/pub_365huijia'
  // host = 'http://localhost/jiuqian-produce'
  // baseUrl = 'http://localhost/jiuqian-produce'
  // pubUrl = 'http://localhost/jiuqian-pub_365huijia'
  // host = 'https://www.365huijia.com'
  // baseUrl = 'https://www.365huijia.com'
  // pubUrl = 'http://pub.365huijia.com'
} else if (process.env.NODE_ENV === 'middle') {
  host = 'http://localhost/jiuqian-mobile'
  baseUrl = 'http://localhost/jiuqian-mobile'
  pubUrl = 'http://localhost/pub_365huijia'
}

export {
  baseUrl,
  host,
  pubUrl
}
