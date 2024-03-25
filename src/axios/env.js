/**
 * Created by chuangchuangzhang on 2018/2/6.
 */
let baseUrl
let host
let pubUrl

if (process.env.NODE_ENV === 'development') {
  host = 'http://localhost:8080'
  // host = 'http://localhost:8080'
  baseUrl = 'http://localhost:7070/jiuqian-online-back'
  // baseUrl = 'http://localhost/jiuqian-produce'
  pubUrl = 'http://localhost:7070/pub_365huijia'
} else if (process.env.NODE_ENV === 'production') {
  // host = 'http://localhost/jiuqian-mobile'
  // baseUrl = 'http://localhost/jiuqian-mobile'
  // pubUrl = 'http://localhost/pub_365huijia'
  // host = 'http://localhost/jiuqian-produce'
  // baseUrl = 'http://localhost/jiuqian-produce'
  // pubUrl = 'http://localhost/jiuqian-pub_365huijia'
  // host = 'https://xyw.365huijia.com'
  // baseUrl = 'https://xyw.365huijia.com'
  // pubUrl = 'http://xyw.pub.365huijia.com'
  // host = 'https://www.365huijia.com'
  // baseUrl = 'https://www.365huijia.com'
  // pubUrl = 'http://pub.365huijia.com'
  // host = 'https://t.jqgd.online'
  // baseUrl = 'https://t.jqgd.online'
  pubUrl = 'http://pub.jqgd.online'
  host = 'https://www.jqgd.online'
  baseUrl = 'https://www.jqgd.online'
  // pubUrl = 'http://pub.jqgd.online'
  // host = 'http://localhost/jiuqian-online-back'
  // baseUrl = 'http://localhost/jiuqian-online-back'
  // pubUrl = 'http://localhost/jiuqian-online-pub'
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
