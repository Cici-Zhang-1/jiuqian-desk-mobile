/**
 * Created by chuangchuangzhang on 2018/2/6.
 */
let baseUrl
let host
if (process.env.NODE_ENV === 'development') {
  // host = 'http://localhost/jiuqian.online.back'
  host = 'http://localhost:8080'
  baseUrl = 'http://localhost:7070/jiuqian-online-back'
} else if (process.env.NODE_ENV === 'production') {
  // host = 'https://www.365huijia.com'
  // baseUrl = 'https://www.365huijia.com'
  // host = 'https://t.jqgd.online'
  // baseUrl = 'https://t.jqgd.online'
  host = 'https://www.jqgd.online'
  baseUrl = 'https://www.jqgd.online'
  // host = 'http://localhost/jiuqian-online-back'
  // baseUrl = 'http://localhost/jiuqian-online-back'
}

export {
  baseUrl,
  host
}
