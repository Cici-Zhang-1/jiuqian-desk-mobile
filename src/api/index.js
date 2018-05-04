/**
 * Created by chuangchuangzhang on 2018/2/3.
 */
import $ from 'jquery'

const configs = {
  site_url: 'http://localhost/jiuqian-mobile'
}

const getJSON = function (uri, data = {}) {
  if (uri.indexOf('/') !== 0) {
    uri = '/' + uri
  }
  const promise = new Promise(function (resolve, reject) {
    $.ajax({
      async: true,
      type: 'GET',
      url: configs.site_url + uri,
      data: { ...data },
      dataType: 'JSONP',
      success: function (data) {
        resolve(data)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        reject(new Error(textStatus))
      }
    })
  })
  return promise
}

export function fetchJsonByParams ({ uri, data }) {
  return getJSON(uri, data).then(function (json) {
    return json
  })
}
