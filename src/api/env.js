/**
 * Created by chuangchuangzhang on 2018/2/6.
 */
let baseUrl
let host

if (process.env.NODE_ENV === 'development') {
  host = 'http://localhost:8080'
  baseUrl = 'http://localhost/jiuqian-mobile'
} else if (process.env.NODE_ENV === 'production') {
  // host = 'https://www.365huijia.com'
  // baseUrl = 'https://www.365huijia.com'
    host = 'https://jqdz.online'
    baseUrl = 'https://jqdz.online'
}

export {
  baseUrl,
  host
}
