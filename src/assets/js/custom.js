// 定制js
'use strict'
import $ from 'jquery'
import { trimRight } from 'voca'

let getData = function (sourceData, key) {
  return sourceData[key]
}

let settingSave = function (This, $form) {
  // This.$root.$data.settings.tables.btOrders.checkLists.first.checked = false
  $form.each(function (index) {
    let savePath = $(this).data('save-path').split('/')
    let currentSetting = This.$root.$data
    for (let index in savePath) {
      currentSetting = getData(currentSetting, savePath[index])
    }
    $(this).find('input,select,textarea').each(function (ii) {
      if ($(this).is('input') && this.type === 'checkbox') {
        currentSetting[this.name]['checked'] = $(this).prop('checked')
      }
    })
  })
}

/**
 * Generate Uuid
 * @param len
 * @param radix
 * @returns {string}
 */
let uuid = function (len = 8, radix = 0) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 * Name To Id
 * @param name
 */
let nameToId = function (name) {
  return name.trim().split('_').map(function (v) {
    return v.toLowerCase().replace(/( |^)[a-z]/g, function (iv) {
      return iv.toUpperCase()
    })
  }).join('').replace(/( |^)[A-Z]/g, function (iv) {
    return iv.toLowerCase()
  })
}

let attr = function (configs) {
  let a = ''
  if (configs.readonly_name) {
    a += 'readonly '
  }
  if (configs.required_name) {
    a += 'required '
  }
  if (configs.multiple_name) {
    a += 'multiple '
  }
  if (configs.max !== null) {
    a += 'max="' + configs.max + '" '
  }
  if (configs.min !== null) {
    a += 'min="' + configs.min + '" '
  }
  if (configs.maxlength) {
    a += 'maxlength="' + configs.maxlength + '" '
  }
  if (configs.pattern !== null) {
    a += 'pattern="' + configs.pattern + '" '
  }
  return a
}

let isJSON = function (str, pass_object) {
  if (pass_object && isObject(str)) return true

  if (!isString(str)) return false

  str = str.replace(/\s/g, '').replace(/\n|\r/, '')

  if (/^\{(.*?)\}$/.test(str))
    return /"(.*?)":(.*?)/g.test(str)

  if (/^\[(.*?)\]$/.test(str)) {
    return str.replace(/^\[/, '')
      .replace(/\]$/, '')
      .replace(/},{/g, '}\n{')
      .split(/\n/)
      .map(function (s) { return isJSON(s) })
      .reduce(function (prev, curr) { return !!curr })
  }

  return false
}

let cloneData = function (obj) {
  let o
  switch (typeof obj) {
    case 'undefined':
      break
    case 'string':
      o = obj + ''
      break
    case 'number':
      o = obj - 0
      break
    case 'boolean':
      o = obj
      break
    case 'object':
      if (obj === null) {
        o = null
      } else {
        if(obj instanceof Array) {
          o = []
          for (let i = 0, len = obj.length; i < len; i++) {
            o.push(cloneData(obj[i]))
          }
        } else {
          o = {}
          for (let k in obj) {
            o[k] = cloneData(obj[k])
          }
        }
      }
      break
    default:
      o = obj
      break
  }
  return o
}

let highLightTable = function ($$) {
  $$.find('tbody tr').each(function (i, v) {
    $(this).off('click.high-light').on('click.high-light', function (e) {
      $(this).addClass('table-success').siblings().removeClass('table-success')
    })
  })
}

/**
 * 表格中生产链接
 * @param Data // 内嵌文本
 * @param Thead // 表格头
 * @param Table // 表格数据
 * @returns {*}
 */
let generateLink = function (Data, Thead, Table) {
  let Url = Thead.url
  let Query = Thead.query
  if (Url && Url !== '') {
    Query = (Query && Query.split(',')) || []
    if (Query.length > 0) {
      let I = Query.length
      let Params = ''
      for (let J = 0; J < I; J++) {
        if (Table[Query[J]] !== undefined) {
          Params += Query[J] + '=' + Table[Query[J]] + '&'
        }
      }
      Params = trimRight(Params, '&')
      Url = Url.indexOf('?') >= 0 ? Url + '&' + Params : Url + '?' + Params
    }
    Data = '<a href="#' + Url + '">' + Data + '</a>'
  }
  return Data
}

let dataToStr = function (data, p = '') {
  if (typeof data !== 'object') {
    return data
  }
  if (data) {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      let realKey
      if (p !== '') {
        realKey = p + '[' + key + ']'
      } else {
        realKey = key
      }
      if (data[key] === null || data[key] === undefined) {
        dataStr += realKey + '=&'
      } if (typeof data[key] === 'object') {
        data[key] = dataToStr(data[key], realKey)
        dataStr += data[key] + '&'
      } else {
        data[key] = encodeURIComponent(data[key])
        if (p !== '') {
          dataStr += realKey + '=' + data[key] + '&'
        } else {
          dataStr += realKey + '=' + data[key] + '&'
        }
      }
    })
    return trimRight(dataStr, '&')
  } else {
    return data
  }
}

let FetchError = function (message) {
  this.message = message;
  this.name = "FetchError";
}
export { settingSave, uuid, nameToId, attr, isJSON, cloneData, highLightTable, generateLink, dataToStr, FetchError }
