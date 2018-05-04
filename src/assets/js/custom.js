// 定制js
'use strict'
import $ from 'jquery'

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
 * 判断form group type
 * @param value
 * @returns {string}
 */
let formGroupType = function (value) {
  let type = ''
  switch (value) {
    case 'text':
    case 'password':
    case 'hidden':
    case 'number':
    case 'date':
      type = 'form-group-input'
      break
    case 'select':
      type = 'form-group-select'
      break
    case 'checkbox':
      type = 'form-group-checkbox'
      break
    case 'radio':
      type = 'form-group-radio'
      break
    case 'textarea':
      type = 'form-group-textarea'
      break
    default:
      type = 'form-group-input'
  }
  return type
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

export { settingSave, uuid, formGroupType, nameToId, attr }
