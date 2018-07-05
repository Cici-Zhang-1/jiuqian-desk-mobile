/**
 * Created by chuangchuangzhang on 2018/2/3.
 */
import $ from 'jquery'
import { baseUrl } from './env'
const EXIT_SIGNIN = 10

const getJSON = function (uri, data = {}) {
  if (uri.indexOf('/') !== 0) {
    uri = '/' + uri
  }
  const promise = new Promise(function (resolve, reject) {
    $.ajax({
      async: true,
      type: 'GET',
      url: baseUrl + uri,
      data: { ...data },
      dataType: 'JSONP',
      success: function (data) {
        console.log('bbb')
        resolve(data)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest)
        reject(new Error(textStatus))
      }
    })
  })
  return promise
}

export function fetchJsonByParams ({ uri, data = {} }) {
  return getJSON(uri, data).then(function (json) {
    return json
  })
    /* .cache(function (error) {
    let Message = JSON.parse(error.message)
    if (parseInt(Message.code) === EXIT_SIGNIN) {

    } else {
    }
  }) */
}
